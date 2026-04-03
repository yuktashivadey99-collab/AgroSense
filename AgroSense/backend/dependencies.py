"""
Dependencies for FastAPI application
"""

from typing import Optional
from fastapi import Header, HTTPException
from pymongo.collection import Collection
from utils.database import get_collection
from logger import setup_logging
import structlog

# Global logger
logger = setup_logging()


def get_predictions_collection() -> Optional[Collection]:
    """Dependency for predictions collection"""
    return get_collection('predictions')


def get_current_user_email(x_user_email: Optional[str] = Header(None)) -> str:
    """Require a lightweight user identity for user-scoped actions."""
    if not x_user_email:
        raise HTTPException(status_code=401, detail="Sign in required")
    return x_user_email.strip().lower()


def get_logger():
    """Dependency for logger"""
    return logger
