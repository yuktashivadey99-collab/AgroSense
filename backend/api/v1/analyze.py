"""
Analyze endpoint for AgroSense AI API v1
"""

import datetime
import uuid
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pymongo.collection import Collection
import structlog

from schemas import AnalysisResponse, ErrorResponse
from utils.image_processing import (
    load_image_from_bytes,
    preprocess_for_model,
    calculate_cdi,
    analyze_stem,
)
from models.ml_model import predict_leaf_disease, adaptive_fusion
from dependencies import get_predictions_collection, get_logger, get_current_user_email

router = APIRouter()
logger = get_logger()

# In-memory fallback history when MongoDB is not configured
_in_memory_history = []


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={
        400: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def analyze(
    leaf_image: Optional[UploadFile] = File(None),
    stem_image: Optional[UploadFile] = File(None),
    crop_name: str = Form(...),
    collection: Optional[Collection] = Depends(get_predictions_collection),
    user_email: str = Depends(get_current_user_email),
):
    """
    Analyze plant images for disease detection.

    Accepts multipart/form-data with optional leaf_image and stem_image fields.
    Returns full disease analysis JSON.
    """
    normalized_crop_name = crop_name.strip()
    if not normalized_crop_name:
        raise HTTPException(status_code=400, detail="Crop selection is required")

    logger.info(
        "analyze_endpoint_called",
        leaf_provided=leaf_image is not None,
        stem_provided=stem_image is not None,
        crop_name=normalized_crop_name,
        user_email=user_email,
    )

    if not leaf_image and not stem_image:
        raise HTTPException(status_code=400, detail="At least one image (leaf or stem) is required")

    leaf_result = None
    stem_result = None
    cdi_score = 0.0

    # Process leaf image
    if leaf_image:
        try:
            leaf_bytes = await leaf_image.read()
            leaf_img = load_image_from_bytes(leaf_bytes)
            leaf_arr = preprocess_for_model(leaf_img)
            cdi_score = calculate_cdi(leaf_img)
            leaf_result = predict_leaf_disease(leaf_arr, selected_crop=normalized_crop_name)
            logger.info("leaf_analysis_completed", disease=leaf_result.get("disease"))
        except Exception as e:
            logger.error("leaf_image_processing_failed", error=str(e))
            raise HTTPException(status_code=422, detail=f"Leaf image processing failed: {str(e)}")

    # Process stem image
    if stem_image:
        try:
            stem_bytes = await stem_image.read()
            stem_img = load_image_from_bytes(stem_bytes)
            stem_result = analyze_stem(stem_img)
            if not leaf_image:
                cdi_score = calculate_cdi(stem_img)
            logger.info("stem_analysis_completed", condition=stem_result.get("condition"))
        except Exception as e:
            logger.error("stem_image_processing_failed", error=str(e))
            raise HTTPException(status_code=422, detail=f"Stem image processing failed: {str(e)}")

    # Adaptive fusion
    result = adaptive_fusion(leaf_result, stem_result, cdi_score)
    logger.info("analysis_completed", disease_name=result.get("disease_name"), health_score=result.get("health_score"))

    # Persist to DB
    record = {
        **result,
        "crop_name": normalized_crop_name,
        "user_email": user_email,
        "id": str(uuid.uuid4()),
        "created_at": datetime.datetime.utcnow().isoformat(),
    }
    if collection is not None:
        try:
            collection.insert_one({**record})
        except Exception as e:
            logger.warning("database_insert_failed", error=str(e))
            _in_memory_history.append(record)
    else:
        _in_memory_history.append(record)

    # Clean leaf/stem sub-results for response
    if record.get('leaf_result') and 'recommendations' in record['leaf_result']:
        record['leaf_result'].pop('recommendations', None)

    return AnalysisResponse(**record)
