"""
/api/analyze  –  POST
Accepts multipart/form-data with optional leaf_image and stem_image fields.
Returns full disease analysis JSON.
"""

import datetime
from flask import Blueprint, request, jsonify
from PIL import Image

from utils.image_processing import (
    load_image_from_bytes,
    preprocess_for_model,
    calculate_cdi,
    analyze_stem,
)
from models.ml_model import predict_leaf_disease, adaptive_fusion
from utils.database import get_collection

analyze_bp = Blueprint('analyze', __name__)

# In-memory fallback history when MongoDB is not configured
_in_memory_history = []


@analyze_bp.route('/analyze', methods=['POST'])
def analyze():
    leaf_file = request.files.get('leaf_image')
    stem_file = request.files.get('stem_image')

    if not leaf_file and not stem_file:
        return jsonify({"error": "At least one image (leaf or stem) is required"}), 400

    leaf_result = None
    stem_result = None
    cdi_score   = 0.0

    # ── Leaf Analysis ──────────────────────────────────────────────────────────
    if leaf_file:
        try:
            leaf_bytes = leaf_file.read()
            leaf_img   = load_image_from_bytes(leaf_bytes)
            leaf_arr   = preprocess_for_model(leaf_img)
            cdi_score  = calculate_cdi(leaf_img)
            leaf_result = predict_leaf_disease(leaf_arr)
        except Exception as e:
            return jsonify({"error": f"Leaf image processing failed: {str(e)}"}), 422

    # ── Stem Analysis ──────────────────────────────────────────────────────────
    if stem_file:
        try:
            stem_bytes  = stem_file.read()
            stem_img    = load_image_from_bytes(stem_bytes)
            stem_result = analyze_stem(stem_img)
            if not leaf_file:
                cdi_score = calculate_cdi(stem_img)
        except Exception as e:
            return jsonify({"error": f"Stem image processing failed: {str(e)}"}), 422

    # ── Adaptive Fusion ────────────────────────────────────────────────────────
    result = adaptive_fusion(leaf_result, stem_result, cdi_score)

    # ── Persist to DB ──────────────────────────────────────────────────────────
    record = {**result, "created_at": datetime.datetime.utcnow().isoformat()}
    collection = get_collection('predictions')
    if collection is not None:
        try:
            inserted = collection.insert_one({**record})
            record['_id'] = str(inserted.inserted_id)
        except Exception:
            pass
    else:
        import uuid
        record['_id'] = str(uuid.uuid4())
        _in_memory_history.append(record)

    # Clean leaf/stem sub-results for response (remove internal fields)
    if record.get('leaf_result'):
        record['leaf_result'].pop('recommendations', None)
    
    return jsonify(record), 200
