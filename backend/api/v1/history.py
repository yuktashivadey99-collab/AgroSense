"""
History endpoints for AgroSense AI API v1
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pymongo.collection import Collection
from bson import ObjectId
import structlog

from schemas import HistoryResponse, StatsResponse, ErrorResponse
from dependencies import get_predictions_collection, get_logger, get_current_user_email
from api.v1.analyze import _in_memory_history

router = APIRouter()
logger = get_logger()


@router.get(
    "/history",
    response_model=HistoryResponse,
    responses={500: {"model": ErrorResponse}}
)
async def get_history(
    collection: Optional[Collection] = Depends(get_predictions_collection),
    user_email: str = Depends(get_current_user_email),
):
    """Fetch prediction records for the signed-in user only."""
    logger.info("get_history_called", user_email=user_email)

    if collection is not None:
        try:
            docs = list(
                collection.find(
                    {"user_email": user_email},
                    {"_id": 0, "id": 1, "crop_name": 1, "disease_name": 1, "classification": 1,
                     "health_score": 1, "confidence": 1, "created_at": 1}
                ).sort("created_at", -1).limit(100)
            )
            records = docs
        except Exception as e:
            logger.error("database_query_failed", error=str(e))
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # In-memory fallback
        records = sorted(
            [r for r in _in_memory_history if r.get("user_email") == user_email],
            key=lambda x: x.get('created_at', ''),
            reverse=True
        )
        records = [
            {
                "id": r.get("id"),
                "crop_name": r.get("crop_name"),
                "disease_name": r.get("disease_name"),
                "classification": r.get("classification"),
                "health_score": r.get("health_score"),
                "confidence": r.get("confidence"),
                "created_at": r.get("created_at"),
            }
            for r in records
        ]

    return HistoryResponse(records=records)


@router.delete(
    "/history/{record_id}",
    responses={
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def delete_record(
    record_id: str,
    collection: Optional[Collection] = Depends(get_predictions_collection),
    user_email: str = Depends(get_current_user_email),
):
    """Delete a record by ID."""
    logger.info("delete_record_called", record_id=record_id, user_email=user_email)

    if collection is not None:
        try:
            if ObjectId.is_valid(record_id):
                result = collection.delete_one({"_id": ObjectId(record_id), "user_email": user_email})
            else:
                result = collection.delete_one({"id": record_id, "user_email": user_email})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Record not found")
            return {"message": "Deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error("database_delete_failed", error=str(e))
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # In-memory fallback
        global _in_memory_history
        before = len(_in_memory_history)
        _in_memory_history = [
            r for r in _in_memory_history
            if not (r.get('id') == record_id and r.get("user_email") == user_email)
        ]
        if len(_in_memory_history) == before:
            raise HTTPException(status_code=404, detail="Record not found")
        return {"message": "Deleted successfully"}


@router.get(
    "/history/stats",
    response_model=StatsResponse,
    responses={500: {"model": ErrorResponse}}
)
async def get_stats(
    collection: Optional[Collection] = Depends(get_predictions_collection),
    user_email: str = Depends(get_current_user_email),
):
    """Aggregate stats for dashboard use."""
    logger.info("get_stats_called", user_email=user_email)

    source = []
    if collection is not None:
        try:
            source = list(collection.find({"user_email": user_email}))
        except Exception as e:
            logger.error("database_stats_query_failed", error=str(e))
            raise HTTPException(status_code=500, detail=str(e))
    else:
        source = [r for r in _in_memory_history if r.get("user_email") == user_email]

    total = len(source)
    by_class = {}
    for r in source:
        cls = r.get('classification', 'Unknown')
        by_class[cls] = by_class.get(cls, 0) + 1

    avg_health = (
        sum(r.get('health_score', 0) for r in source) / total
        if total > 0 else 0
    )

    return StatsResponse(
        total_scans=total,
        by_class=by_class,
        avg_health=round(avg_health, 2)
    )


@router.get(
    "/history/{record_id}/pdf",
    responses={
        200: {"content": {"media_type": "application/pdf"}},
        404: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def download_pdf_report(
    record_id: str,
    collection: Optional[Collection] = Depends(get_predictions_collection),
    user_email: str = Depends(get_current_user_email),
):
    """Generate and download PDF report for a specific analysis."""
    logger.info("download_pdf_called", record_id=record_id, user_email=user_email)

    # Fetch the record
    record = None
    if collection is not None:
        try:
            if ObjectId.is_valid(record_id):
                record = collection.find_one({"_id": ObjectId(record_id), "user_email": user_email})
            else:
                record = collection.find_one({"id": record_id, "user_email": user_email})
        except Exception as e:
            logger.error("database_pdf_query_failed", error=str(e), record_id=record_id)
            raise HTTPException(status_code=500, detail="Database error")
    else:
        # In-memory fallback
        record = next(
            (r for r in _in_memory_history if r.get('id') == record_id and r.get("user_email") == user_email),
            None
        )

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # Generate PDF
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from io import BytesIO

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.green
    )
    heading_style = ParagraphStyle(
        'Heading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        textColor=colors.darkgreen
    )
    normal_style = styles['Normal']

    elements = []

    # Title
    elements.append(Paragraph("AgroSense AI - Plant Health Report", title_style))
    elements.append(Spacer(1, 12))

    # Basic info
    elements.append(Paragraph("Analysis Details", heading_style))
    data = [
        ["Disease Name", record.get('disease_name', 'N/A')],
        ["Classification", record.get('classification', 'N/A')],
        ["Health Score", f"{record.get('health_score', 0):.1f}/100"],
        ["Confidence", f"{record.get('confidence', 0):.1%}"],
        ["CDI Score", f"{record.get('cdi_score', 0):.4f}"],
        ["Date", record.get('created_at', 'N/A')],
    ]
    table = Table(data, colWidths=[120, 300])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgreen),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(table)
    elements.append(Spacer(1, 20))

    # Recommendations
    if record.get('prevention'):
        elements.append(Paragraph("Prevention Measures", heading_style))
        for item in record['prevention']:
            elements.append(Paragraph(f"• {item}", normal_style))
        elements.append(Spacer(1, 12))

    if record.get('treatment'):
        elements.append(Paragraph("Treatment Recommendations", heading_style))
        for item in record['treatment']:
            elements.append(Paragraph(f"• {item}", normal_style))
        elements.append(Spacer(1, 12))

    if record.get('fertilizer'):
        elements.append(Paragraph("Fertilizer Suggestions", heading_style))
        for item in record['fertilizer']:
            elements.append(Paragraph(f"• {item}", normal_style))
        elements.append(Spacer(1, 12))

    elements.append(Paragraph(f"Viability: {record.get('viability', 'N/A')}", normal_style))

    doc.build(elements)
    buffer.seek(0)

    from fastapi.responses import StreamingResponse
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=agrosense_report_{record_id}.pdf"}
    )
