"""
AgroSense AI - FastAPI Backend
Main application entry point
"""

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog

from config import settings
from logger import setup_logging
from schemas import HealthResponse, ErrorResponse
from api.v1.analyze import router as analyze_router
from api.v1.history import router as history_router
from routes.auth import router as auth_router

# Setup logging
logger = setup_logging(settings.debug)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI-powered plant disease detection and analysis API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(
        "request_started",
        method=request.method,
        url=str(request.url),
        client=request.client.host if request.client else None
    )
    response = await call_next(request)
    logger.info(
        "request_completed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code
    )
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(
        "unhandled_exception",
        exc_info=exc,
        url=str(request.url),
        method=request.method
    )
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(error="Internal server error").dict()
    )

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return HealthResponse()

# API v1 routes
app.include_router(
    analyze_router,
    prefix="/api/v1",
    tags=["analysis"]
)
app.include_router(
    history_router,
    prefix="/api/v1",
    tags=["history"]
)
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["auth"]
)

# Backward compatibility - include v1 routes at /api
app.include_router(
    analyze_router,
    prefix="/api",
    tags=["analysis"]
)
app.include_router(
    history_router,
    prefix="/api",
    tags=["history"]
)
app.include_router(
    auth_router,
    prefix="/api/auth",
    tags=["auth"]
)

# Backward compatibility - redirect old endpoints
@app.get("/api/health")
async def legacy_health():
    return await health()

if __name__ == "__main__":
    print(f"{settings.app_name} v{settings.version} starting...")
    print(f"API docs available at http://{settings.host}:{settings.port}/docs")
    print(f"ReDoc available at http://{settings.host}:{settings.port}/redoc")

    uvicorn.run(
        "app:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info"
    )
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    print(f"AgroSense AI Backend running on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)

