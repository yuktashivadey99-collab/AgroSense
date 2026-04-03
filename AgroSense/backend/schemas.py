"""
Pydantic models for AgroSense AI API
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "AgroSense AI Backend"
    version: str = "1.0.0"


class AnalysisRequest(BaseModel):
    # This will be handled by multipart form data, so no fields here
    pass


class LeafResult(BaseModel):
    disease_class: str
    disease: str
    confidence: float
    is_healthy: bool
    recommendations: Optional[Dict[str, Any]] = None


class StemResult(BaseModel):
    condition: str
    brown_ratio: float
    yellow_ratio: float
    affected_pct: float
    score: float


class AnalysisResponse(BaseModel):
    id: str
    crop_name: str
    disease_name: str
    classification: str
    confidence: float
    health_score: float
    severity_score: float
    cdi_score: float
    leaf_result: Optional[LeafResult] = None
    stem_result: Optional[StemResult] = None
    prevention: List[str]
    treatment: List[str]
    fertilizer: List[str]
    viability: str
    created_at: str


class HistoryRecord(BaseModel):
    id: str
    crop_name: Optional[str] = None
    disease_name: str
    classification: str
    health_score: float
    confidence: float
    created_at: str


class HistoryResponse(BaseModel):
    records: List[HistoryRecord]


class StatsResponse(BaseModel):
    total_scans: int
    by_class: Dict[str, int]
    avg_health: float


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
