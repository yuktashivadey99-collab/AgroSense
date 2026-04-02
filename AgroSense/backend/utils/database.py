"""
MongoDB connection utility for AgroSense AI
Handles connection pooling and graceful fallback
"""

import os
from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import settings

_client: Optional[MongoClient] = None
_db: Optional[Database] = None


def get_db() -> Optional[Database]:
    """Get MongoDB database instance with connection caching."""
    global _client, _db

    if _db is not None:
        return _db

    mongo_uri = settings.mongo_uri or os.getenv('MONGO_URI', '')

    if not mongo_uri or "username:password@cluster.mongodb.net" in mongo_uri:
        print("⚠️  MONGO_URI not set. History features will use in-memory storage.")
        return None

    try:
        _client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        _client.admin.command('ping')
        _db = _client[settings.database_name]
        print("✅ MongoDB connected successfully")
        return _db
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"⚠️  MongoDB connection failed: {e}")
        print("   History features will use in-memory storage.")
        return None


def get_collection(name: str):
    """Get a specific collection from the database."""
    db = get_db()
    if db is None:
        return None
    return db[name]

