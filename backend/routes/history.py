"""
/api/history  –  GET    – Fetch all prediction records
/api/history/<id>  –  DELETE  – Delete a record by ID
"""

from flask import Blueprint, jsonify, request
from utils.database import get_collection
from routes.analyze import _in_memory_history

history_bp = Blueprint('history', __name__)


@history_bp.route('/history', methods=['GET'])
def get_history():
    collection = get_collection('predictions')

    if collection is not None:
        try:
            docs = list(
                collection.find({}, {"_id": 1, "disease_name": 1, "classification": 1,
                                     "health_score": 1, "confidence": 1, "created_at": 1})
                          .sort("created_at", -1)
                          .limit(100)
            )
            for d in docs:
                d['_id'] = str(d['_id'])
            return jsonify({"records": docs}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # In-memory fallback
    records = sorted(_in_memory_history, key=lambda x: x.get('created_at', ''), reverse=True)
    slim = [
        {
            "_id":            r.get("_id"),
            "disease_name":   r.get("disease_name"),
            "classification": r.get("classification"),
            "health_score":   r.get("health_score"),
            "confidence":     r.get("confidence"),
            "created_at":     r.get("created_at"),
        }
        for r in records
    ]
    return jsonify({"records": slim}), 200


@history_bp.route('/history/<record_id>', methods=['DELETE'])
def delete_record(record_id):
    collection = get_collection('predictions')

    if collection is not None:
        try:
            from bson import ObjectId
            result = collection.delete_one({"_id": ObjectId(record_id)})
            if result.deleted_count == 0:
                return jsonify({"error": "Record not found"}), 404
            return jsonify({"message": "Deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # In-memory fallback
    global _in_memory_history
    before = len(_in_memory_history)
    _in_memory_history = [r for r in _in_memory_history if r.get('_id') != record_id]
    if len(_in_memory_history) == before:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"message": "Deleted successfully"}), 200


@history_bp.route('/history/stats', methods=['GET'])
def get_stats():
    """Aggregate stats for dashboard use."""
    collection = get_collection('predictions')
    source = list(collection.find()) if collection else _in_memory_history

    total = len(source)
    by_class = {}
    for r in source:
        cls = r.get('classification', 'Unknown')
        by_class[cls] = by_class.get(cls, 0) + 1

    avg_health = (
        sum(r.get('health_score', 0) for r in source) / total
        if total > 0 else 0
    )

    return jsonify({
        "total_scans":    total,
        "by_class":       by_class,
        "avg_health":     round(avg_health, 2),
    }), 200
