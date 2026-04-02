"""
Dependencies for FastAPI application
"""

from typing import Optional
from pymongo.collection import Collection
from utils.database import get_collection
from logger import setup_logging
import structlog

# Global logger
logger = setup_logging()


def get_predictions_collection() -> Optional[Collection]:
    """Dependency for predictions collection"""
    return get_collection('predictions')


def get_logger():
    """Dependency for logger"""
    return logger