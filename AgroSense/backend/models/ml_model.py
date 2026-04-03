"""
ML Model Module for AgroSense AI
Handles MobileNetV2 model loading, disease prediction,
and adaptive weighted fusion of leaf + stem + CDI signals.
"""

import os
import json
import numpy as np
from config import settings

# Lazy-load TensorFlow to avoid import overhead
_tf   = None
_model = None

# ─── Disease Classes ───────────────────────────────────────────────────────────
# Matches the PlantVillage dataset class ordering (38 classes subset shown below)
DISEASE_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry___Powdery_mildew",
    "Cherry___healthy",
    "Corn___Cercospora_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]

# Human-readable names
DISPLAY_NAMES = {c: c.replace("___", " – ").replace("_", " ") for c in DISEASE_CLASSES}

# ─── Recommendations DB ────────────────────────────────────────────────────────
RECOMMENDATIONS = {
    "healthy": {
        "prevention": [
            "Maintain regular watering schedule (avoid overhead irrigation)",
            "Apply balanced NPK fertilizer monthly during growing season",
            "Inspect plants weekly for early signs of pest or disease activity",
            "Ensure adequate sunlight exposure and proper plant spacing",
        ],
        "treatment": [],
        "fertilizer": [
            "Apply 10-10-10 NPK fertilizer every 4-6 weeks",
            "Add compost or organic matter to improve soil structure",
            "Use micronutrient foliar spray (Zn, Mn, Fe) once a month",
        ],
        "viability": "Plant is in excellent health. Continue current care practices.",
    },
    "early_blight": {
        "prevention": [
            "Apply preventive copper-based fungicide spray every 7-10 days",
            "Avoid overhead irrigation; use drip irrigation instead",
            "Remove and destroy infected leaves immediately",
            "Ensure proper plant spacing for air circulation",
            "Rotate crops — do not plant same family in same soil for 2 years",
        ],
        "treatment": [
            "Apply Mancozeb (2.5 g/L) or Chlorothalonil fungicide every 7 days",
            "Use systemic fungicide: Azoxystrobin (1 mL/L) for severe infections",
            "Remove infected foliage and dispose away from field",
            "Spray during cool morning or evening for best absorption",
            "Repeat treatment for 3-4 weeks, monitoring disease progression",
        ],
        "fertilizer": [
            "Reduce nitrogen; apply potassium-rich fertilizer (0-0-60) to strengthen cell walls",
            "Apply calcium nitrate to improve plant immunity",
            "Use foliar spray with micronutrients (Zinc 0.5%, Boron 0.1%)",
            "Maintain soil pH between 6.0-6.5 for optimal nutrient uptake",
        ],
        "viability": "Moderate recovery potential. With prompt fungicide treatment, 70-80% recovery expected within 3-4 weeks.",
    },
    "late_blight": {
        "prevention": [
            "Apply preventive Mancozeb or Cymoxanil-Mancozeb every 5-7 days",
            "Avoid working in field when plants are wet",
            "Plant disease-resistant varieties in future seasons",
            "Destroy all infected plant material; do not compost",
        ],
        "treatment": [
            "Apply Metalaxyl-M + Mancozeb (Ridomil Gold) immediately",
            "Use Dimethomorph + Mancozeb for advanced infections",
            "Apply systemic fungicide every 5 days during active infection",
            "Remove all infected plant parts and nearby plant debris",
        ],
        "fertilizer": [
            "Reduce irrigation significantly to minimize humidity",
            "Apply potassium sulfate to improve disease resistance",
            "Avoid high nitrogen fertilizers which encourage soft growth",
        ],
        "viability": "Severe disease. Act immediately — untreated late blight can destroy entire crop within 1-2 weeks under favorable conditions.",
    },
    "default": {
        "prevention": [
            "Inspect plants regularly and remove infected material promptly",
            "Avoid wetting foliage during irrigation",
            "Improve air circulation by proper pruning and spacing",
            "Apply preventive broad-spectrum fungicide/bactericide",
        ],
        "treatment": [
            "Identify specific pathogen and apply targeted fungicide or bactericide",
            "Apply broad-spectrum copper-based spray as first response",
            "Remove all visibly infected plant material",
            "Repeat treatment every 7-10 days until symptoms subside",
        ],
        "fertilizer": [
            "Apply balanced NPK fertilizer to support plant recovery",
            "Use potassium-rich fertilizer to strengthen plant immunity",
            "Add micronutrients via foliar spray to boost recovery",
        ],
        "viability": "Recovery depends on disease severity and promptness of treatment. Consult a local agronomist for precise guidance.",
    },
}


def _get_recs(disease_class: str) -> dict:
    """Match disease class to recommendation set."""
    dc_lower = disease_class.lower()
    if "healthy" in dc_lower:
        return RECOMMENDATIONS["healthy"]
    elif "early_blight" in dc_lower or "early blight" in dc_lower:
        return RECOMMENDATIONS["early_blight"]
    elif "late_blight" in dc_lower or "late blight" in dc_lower:
        return RECOMMENDATIONS["late_blight"]
    return RECOMMENDATIONS["default"]


def _load_tf():
    global _tf
    if _tf is None:
        import tensorflow as tf
        _tf = tf
    return _tf


def load_model(model_path: str = None):
    """Load (or create stub) MobileNetV2 model."""
    global _model
    if _model is not None:
        return _model

    path = model_path or settings.model_path

    if os.path.exists(path):
        try:
            tf = _load_tf()
            print(f"Loading model from {path}")
            _model = tf.keras.models.load_model(path)
        except Exception as exc:
            print(f"Model load failed for '{path}': {exc}")
            print("Using statistical fallback predictor instead.")
            _model = None
    else:
        print(f"Model not found at '{path}'. Using statistical fallback predictor.")
        _model = None

    return _model


def predict_leaf_disease(image_array: np.ndarray) -> dict:
    """
    Run leaf disease prediction.
    Falls back to a deterministic heuristic if no model is loaded.
    image_array: shape (1, 224, 224, 3), float32, [0,1]
    """
    model = load_model()

    if model is not None:
        preds = model.predict(image_array, verbose=0)[0]
        class_idx = int(np.argmax(preds))
        confidence = float(preds[class_idx])
        disease_class = DISEASE_CLASSES[class_idx] if class_idx < len(DISEASE_CLASSES) else "Unknown"
    else:
        # ── Heuristic fallback (based on color statistics) ──
        # Mean green channel intensity as proxy for health
        green_mean = float(image_array[0, :, :, 1].mean())
        if green_mean > 0.45:
            disease_class = "Tomato___healthy"
            confidence = min(0.70 + green_mean * 0.3, 0.96)
        elif green_mean > 0.30:
            disease_class = "Tomato___Early_blight"
            confidence = 0.72 + (0.45 - green_mean)
        else:
            disease_class = "Tomato___Late_blight"
            confidence = 0.78 + (0.30 - green_mean)

    display = DISPLAY_NAMES.get(disease_class, disease_class.replace("_", " "))
    recs = _get_recs(disease_class)

    return {
        "disease_class": disease_class,
        "disease":       display,
        "confidence":    round(float(confidence), 4),
        "is_healthy":    "healthy" in disease_class.lower(),
        "recommendations": recs,
    }


def classify_plant(health_score: float) -> str:
    """Map health score to 5-tier classification."""
    if health_score >= 85:
        return "Healthy"
    elif health_score >= 70:
        return "Preventive"
    elif health_score >= 45:
        return "Treatable"
    elif health_score >= 20:
        return "Critical"
    return "Remove"


def adaptive_fusion(
    leaf_result:  dict | None,
    stem_result:  dict | None,
    cdi_score:    float,
) -> dict:
    """
    Adaptive weighted fusion of leaf + stem + CDI signals.

    Weights (adapt when a signal is absent):
        leaf  → 0.50
        stem  → 0.30
        cdi   → 0.20
    """
    weights = {"leaf": 0.50, "stem": 0.30, "cdi": 0.20}

    # CDI contribution: lower CDI = healthier
    cdi_health = (1.0 - cdi_score) * 100   # [0, 100]

    scores = {"cdi": cdi_health}
    active_weights = {"cdi": weights["cdi"]}

    if leaf_result:
        # Confidence-weighted leaf health
        conf = leaf_result.get("confidence", 0.5)
        if leaf_result.get("is_healthy"):
            leaf_health = 50 + conf * 50       # 50-100
        else:
            leaf_health = (1.0 - conf) * 60    # 0-60
        scores["leaf"] = leaf_health
        active_weights["leaf"] = weights["leaf"]
    else:
        # Redistribute leaf weight to CDI and stem
        weights["stem"] += weights["leaf"] * 0.6
        active_weights["cdi"] += weights["leaf"] * 0.4

    if stem_result:
        scores["stem"] = float(stem_result.get("score", 75))
        active_weights["stem"] = weights["stem"]

    # Normalise weights
    total_w = sum(active_weights.values())
    norm    = {k: v / total_w for k, v in active_weights.items()}

    health_score = sum(scores[k] * norm[k] for k in scores)

    # Severity score (inverse of health, boosted by CDI)
    severity_score = max(0, 100 - health_score) * (1 + cdi_score * 0.3)
    severity_score = min(severity_score, 100)

    classification = classify_plant(health_score)

    # Determine primary disease name
    if leaf_result:
        disease_name = leaf_result.get("disease", "Unknown")
        recommendations = leaf_result.get("recommendations", RECOMMENDATIONS["default"])
    elif stem_result:
        cond = stem_result.get("condition", "Normal")
        disease_name = f"Stem – {cond}"
        recommendations = RECOMMENDATIONS["default"]
    else:
        disease_name = "Insufficient data"
        recommendations = RECOMMENDATIONS["default"]

    return {
        "disease_name":   disease_name,
        "classification": classification,
        "confidence":     leaf_result.get("confidence", 0.5) if leaf_result else 0.5,
        "health_score":   round(health_score,   2),
        "severity_score": round(severity_score, 2),
        "cdi_score":      round(cdi_score,       4),
        "leaf_result":    leaf_result,
        "stem_result":    stem_result,
        "prevention":     recommendations.get("prevention",  []),
        "treatment":      recommendations.get("treatment",   []),
        "fertilizer":     recommendations.get("fertilizer",  []),
        "viability":      recommendations.get("viability",   ""),
    }

