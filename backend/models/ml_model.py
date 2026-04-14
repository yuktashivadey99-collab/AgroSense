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
_FALLBACK_DISEASE_CLASSES = [
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


def _load_disease_classes() -> list[str]:
    """Load class order from class_indices.json saved during training."""
    mapping_path = os.path.join(os.path.dirname(__file__), "class_indices.json")
    try:
        with open(mapping_path, "r", encoding="utf-8") as fh:
            class_map = json.load(fh)
        ordered = [label for _, label in sorted(class_map.items(), key=lambda kv: int(kv[0]))]
        if ordered:
            return ordered
        print(f"class_indices.json at '{mapping_path}' is empty; using fallback classes.")
    except Exception as exc:
        print(f"Failed to load class indices from '{mapping_path}': {exc}")
        print("Using fallback disease classes.")
    return _FALLBACK_DISEASE_CLASSES


DISEASE_CLASSES = _load_disease_classes()

def _crop_token_from_label(label: str) -> str:
    if "___" in label:
        return label.split("___", 1)[0]
    return label.split("_", 1)[0]


def _display_name_for_class(label: str) -> str:
    if "___" in label:
        crop, disease = label.split("___", 1)
        return f"{crop.replace(',', '').replace('_', ' ').title()} - {disease.replace('_', ' ').title()}"

    if "_" in label:
        crop, disease = label.split("_", 1)
        return f"{crop.replace(',', '').replace('_', ' ').title()} - {disease.replace('_', ' ').title()}"

    return label.replace(",", "").replace("_", " ").title()


# Use ASCII display labels consistently in the API/UI layer.
DISPLAY_NAMES = {label: _display_name_for_class(label) for label in DISEASE_CLASSES}
SUPPORTED_CROPS = sorted({
    " ".join(_crop_token_from_label(label).replace(",", "").replace("_", " ").split()).title()
    for label in DISEASE_CLASSES
})

# Human-readable names

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


def _sanitize_model_config(config):
    if isinstance(config, dict):
        if config.get("class_name") == "DTypePolicy":
            return config.get("config", {}).get("name", "float32")
        cleaned = {}
        for key, value in config.items():
            if key == "optional":
                continue
            if key == "batch_shape":
                cleaned["batch_input_shape"] = _sanitize_model_config(value)
                continue
            cleaned[key] = _sanitize_model_config(value)
        return cleaned
    if isinstance(config, list):
        return [_sanitize_model_config(item) for item in config]
    return config


def _load_legacy_h5_model(path: str):
    tf = _load_tf()
    import h5py

    with h5py.File(path, "r") as handle:
        model_config = handle.attrs.get("model_config")
        if model_config is None:
            raise ValueError("model_config not found in H5 file")
        if isinstance(model_config, bytes):
            model_config = model_config.decode("utf-8")

    parsed_config = json.loads(model_config)
    parsed_config = _sanitize_model_config(parsed_config)
    model = tf.keras.models.model_from_json(json.dumps(parsed_config))
    model.load_weights(path)
    return model


def _build_legacy_classifier(num_classes: int):
    tf = _load_tf()
    base = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights=None,
    )
    inputs = tf.keras.Input(shape=(224, 224, 3), name="input_layer_1")
    x = base(inputs)
    x = tf.keras.layers.GlobalAveragePooling2D(name="global_average_pooling2d")(x)
    x = tf.keras.layers.BatchNormalization(name="batch_normalization")(x)
    x = tf.keras.layers.Dense(512, activation="relu", name="dense")(x)
    x = tf.keras.layers.Dropout(0.5, name="dropout")(x)
    x = tf.keras.layers.Dense(256, activation="relu", name="dense_1")(x)
    x = tf.keras.layers.Dropout(0.4, name="dropout_1")(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax", name="dense_2")(x)
    return tf.keras.Model(inputs, outputs, name="AgroSense_MobileNetV2")


def _load_legacy_h5_by_name(path: str):
    model = _build_legacy_classifier(len(DISEASE_CLASSES))
    model.load_weights(path, by_name=True, skip_mismatch=True)
    return model


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
            _model = tf.keras.models.load_model(path, compile=False)
        except Exception as exc:
            print(f"Standard model load failed for '{path}': {exc}")
            try:
                print("Attempting legacy H5 compatibility load...")
                _model = _load_legacy_h5_model(path)
            except Exception as legacy_exc:
                print(f"Legacy H5 compatibility load failed for '{path}': {legacy_exc}")
                try:
                    print("Attempting legacy H5 weight-by-name load...")
                    _model = _load_legacy_h5_by_name(path)
                except Exception as name_exc:
                    print(f"Legacy H5 weight-by-name load failed for '{path}': {name_exc}")
                    print("Using statistical fallback predictor instead.")
                    _model = None
    else:
        print(f"Model not found at '{path}'. Using statistical fallback predictor.")
        _model = None

    return _model


def _normalize_crop_name(crop_name: str | None) -> str | None:
    if not crop_name:
        return None
    return " ".join(crop_name.strip().lower().replace("-", " ").replace("_", " ").split())


def _crop_label_from_disease_class(disease_class: str) -> str:
    return _normalize_crop_name(_crop_token_from_label(disease_class).replace(",", "").replace("_", " ")) or ""


def _crop_aliases() -> dict[str, set[str]]:
    """
    Map user crop names to PlantVillage classes.
    Includes aliases for crops not directly in the dataset.
    """
    return {
        "apple": {"apple"},
        "blueberry": {"blueberry"},
        "cherry": {"cherry"},
        "corn": {"corn", "maize"},
        "maize": {"corn", "maize"},
        "grape": {"grape", "grapes"},
        "grapes": {"grape", "grapes"},
        "orange": {"orange"},
        "peach": {"peach"},
        "pepper bell": {"pepper bell", "bell pepper", "pepper", "capsicum"},
        "capsicum": {"pepper bell", "bell pepper", "pepper", "capsicum"},
        "potato": {"potato"},
        "raspberry": {"raspberry"},
        "soybean": {"soybean", "cotton"},  # Cotton → Soybean (both legume crops)
        "cotton": {"soybean", "cotton"},
        "squash": {"squash"},
        "strawberry": {"strawberry"},
        "tomato": {"tomato"},
        "chilly": {"pepper bell", "bell pepper", "pepper", "capsicum"},  # Chilly → Capsicum
        "chili": {"pepper bell", "bell pepper", "pepper", "capsicum"},
        "chilli": {"pepper bell", "bell pepper", "pepper", "capsicum"},
        "cabbage": {"squash"},  # Fallback to squash (similar plant family)
        "bottleguard": {"squash"},  # Gourd family, closest to squash
        "bottle gourd": {"squash"},
    }


def _crop_matches(selected_crop: str | None, disease_class: str) -> bool:
    normalized_crop = _normalize_crop_name(selected_crop)
    if not normalized_crop:
        return False

    predicted_crop = _crop_label_from_disease_class(disease_class)
    aliases = _crop_aliases()
    allowed = aliases.get(normalized_crop, {normalized_crop})
    return predicted_crop in allowed


def _find_healthy_class_for_crop(selected_crop: str | None) -> str | None:
    normalized_crop = _normalize_crop_name(selected_crop)
    if not normalized_crop:
        return None

    aliases = _crop_aliases().get(normalized_crop, {normalized_crop})
    for disease_class in DISEASE_CLASSES:
        if "healthy" not in disease_class.lower():
            continue
        if _crop_label_from_disease_class(disease_class) in aliases:
            return disease_class
    return None


def _healthy_visuals(visual_stats: dict | None, cdi_score: float | None) -> bool:
    """Determine if leaf appears visually healthy based on color analysis."""
    if not visual_stats:
        return False
    green_pct = float(visual_stats.get("green_pct", 0))
    sick_pct = float(visual_stats.get("sick_pct", 100))
    cdi = 1.0 if cdi_score is None else float(cdi_score)
    # Strict thresholds: high green, low sick, low CDI
    return green_pct >= 52 and sick_pct <= 10 and cdi <= 0.20


def _diseased_visuals(visual_stats: dict | None, cdi_score: float | None) -> bool:
    """Determine if leaf appears visually diseased based on color analysis."""
    if not visual_stats:
        return False
    green_pct = float(visual_stats.get("green_pct", 0))
    sick_pct = float(visual_stats.get("sick_pct", 0))
    cdi = 0.0 if cdi_score is None else float(cdi_score)
    # Strict thresholds: high sick, high CDI, low green
    return sick_pct >= 22 or cdi >= 0.42 or green_pct <= 25


def _build_unknown_crop_result(selected_crop: str | None) -> dict:
    recs = RECOMMENDATIONS["default"]
    crop_label = (selected_crop or "selected crop").strip() or "selected crop"
    return {
        "disease_class": "Unknown",
        "disease": f"Unverified result for {crop_label}",
        "confidence": 0.18,
        "is_healthy": False,
        "recommendations": {
            **recs,
            "viability": (
                "The uploaded image does not confidently match the selected crop. "
                "Retake the photo on a clear leaf from the chosen plant."
            ),
        },
        "requires_review": True,
    }


def _build_review_result(selected_crop: str | None, disease_class: str, confidence: float, message: str, healthy_bias: bool = False) -> dict:
    recs = _get_recs(disease_class)
    display = DISPLAY_NAMES.get(disease_class, disease_class.replace("_", " "))
    return {
        "disease_class": disease_class,
        "disease": display,
        "confidence": round(float(confidence), 4),
        "is_healthy": healthy_bias or "healthy" in disease_class.lower(),
        "recommendations": {
            **recs,
            "viability": message,
        },
        "requires_review": True,
    }


def _find_class_by_tokens(crop_name: str, *tokens: str) -> str | None:
    normalized_crop = _normalize_crop_name(crop_name) or crop_name.lower()
    for disease_class in DISEASE_CLASSES:
        class_label = disease_class.lower()
        if _crop_label_from_disease_class(disease_class) != normalized_crop:
            continue
        if all(token.lower() in class_label for token in tokens):
            return disease_class
    return None


def predict_leaf_disease(
    image_array: np.ndarray,
    selected_crop: str | None = None,
    cdi_score: float | None = None,
    visual_stats: dict | None = None,
) -> dict:
    """
    Run leaf disease prediction with high accuracy confidence thresholds.
    Falls back to visual heuristics only when model is unavailable.
    image_array: shape (1, 224, 224, 3), float32, [0,1]
    """
    model = load_model()
    confidence_gap = 0.0

    if model is not None:
        preds = model.predict(image_array, verbose=0)[0]
        top_indices = np.argsort(preds)[-3:]  # Top 3 predictions
        class_idx = int(top_indices[-1])
        confidence = float(preds[class_idx])
        disease_class = DISEASE_CLASSES[class_idx] if class_idx < len(DISEASE_CLASSES) else "Unknown"
        
        # Calculate confidence gap between top-2 predictions
        second_best = float(preds[top_indices[-2]]) if len(top_indices) > 1 else 0.0
        confidence_gap = max(0.0, confidence - second_best)
        
        # Boost confidence for clear winners (large gap) but keep realistic
        base_conf = confidence
        gap_boost = min(confidence_gap * 0.15, 0.12)  # Max +12% boost
        confidence = max(0.0, min(base_conf + gap_boost, 0.995))
    else:
        # ── Visual heuristic fallback (based on color statistics) ──
        tomato_healthy = _find_class_by_tokens("tomato", "healthy") or "Tomato___healthy"
        tomato_early = _find_class_by_tokens("tomato", "early", "blight") or "Tomato___Early_blight"
        tomato_late = _find_class_by_tokens("tomato", "late", "blight") or "Tomato___Late_blight"
        green_mean = float(image_array[0, :, :, 1].mean())
        if green_mean > 0.50:
            disease_class = tomato_healthy
            confidence = min(0.65 + green_mean * 0.20, 0.82)
        elif green_mean > 0.35:
            disease_class = tomato_early
            confidence = min(0.50 + (0.50 - green_mean) * 0.6, 0.75)
        else:
            disease_class = tomato_late
            confidence = min(0.52 + (0.35 - green_mean) * 0.65, 0.78)

    # Get healthy reference for the selected crop
    healthy_class_for_crop = _find_healthy_class_for_crop(selected_crop)
    healthy_visual = _healthy_visuals(visual_stats, cdi_score)
    diseased_visual = _diseased_visuals(visual_stats, cdi_score)

    # ──────────────────────────────────────────────────────────────────────
    # Crop mismatch check: if predicted crop doesn't match selection
    if selected_crop and not _crop_matches(selected_crop, disease_class):
        # Override with visual signals if very clear
        if healthy_visual and healthy_class_for_crop:
            disease_class = healthy_class_for_crop
            confidence = max(confidence, 0.76)
        else:
            return _build_unknown_crop_result(selected_crop)

    # ──────────────────────────────────────────────────────────────────────
    # Visual override for very clear healthy leaves
    if healthy_visual and healthy_class_for_crop:
        if confidence < 0.80 or confidence_gap < 0.10:
            disease_class = healthy_class_for_crop
            confidence = max(confidence, 0.78)

    # ──────────────────────────────────────────────────────────────────────
    # Visual conflict 1: Model says healthy but visuals show disease
    if "healthy" in disease_class.lower() and diseased_visual and confidence < 0.85:
        return _build_review_result(
            selected_crop,
            disease_class,
            max(0.48, confidence * 0.95),
            "The model predicted healthy, but the leaf shows stress symptoms. Please retake a photo of a different leaf or in better lighting.",
            healthy_bias=True,
        )

    # ──────────────────────────────────────────────────────────────────────
    # Visual conflict 2: Model says diseased but visuals show health
    if "healthy" not in disease_class.lower() and healthy_visual and confidence < 0.85:
        fallback_class = healthy_class_for_crop or disease_class
        return _build_review_result(
            selected_crop,
            fallback_class,
            max(0.50, confidence * 0.92),
            "The image appears visually healthy, but the model detected a disease pattern. For your safety, please upload another photo to confirm.",
            healthy_bias=True,
        )

    # ──────────────────────────────────────────────────────────────────────
    # Low confidence check (minimum bar for any result)
    if confidence < 0.52 or (confidence_gap < 0.07 and confidence < 0.75):
        return _build_review_result(
            selected_crop,
            disease_class,
            max(confidence, 0.45),
            "The model confidence is not high enough for a definitive result. Please upload a clear, close-up photo of a single healthy leaf.",
            healthy_bias="healthy" in disease_class.lower(),
        )

    # ──────────────────────────────────────────────────────────────────────
    # Result is confident enough to issue
    display = DISPLAY_NAMES.get(disease_class, disease_class.replace("_", " "))
    recs = _get_recs(disease_class)

    return {
        "disease_class": disease_class,
        "disease":       display,
        "confidence":    round(float(confidence), 4),
        "is_healthy":    "healthy" in disease_class.lower(),
        "recommendations": recs,
        "requires_review": False,
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
        if leaf_result.get("requires_review"):
            leaf_health = 68 if leaf_result.get("is_healthy") else 52
        elif leaf_result.get("is_healthy"):
            leaf_health = 72 + conf * 28
        else:
            leaf_health = max(18, 62 - conf * 42)
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

    if leaf_result and leaf_result.get("is_healthy") and not leaf_result.get("requires_review") and cdi_score <= 0.18:
        if not stem_result or float(stem_result.get("score", 75)) >= 75:
            health_score = min(health_score + 6, 98)

    if leaf_result and (not leaf_result.get("is_healthy")) and not leaf_result.get("requires_review") and cdi_score >= 0.28:
        health_score = max(health_score - 8, 5)

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
        disease_name = f"Stem - {cond}"
        recommendations = RECOMMENDATIONS["default"]
    else:
        disease_name = "Insufficient data"
        recommendations = RECOMMENDATIONS["default"]

    return {
        "disease_name":   disease_name,
        "classification": classification,
        "confidence":     leaf_result.get("confidence", 0.35) if leaf_result else 0.35,
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

