"""
Image Processing Module for AgroSense AI
Handles image loading, preprocessing, HSV analysis, CDI calculation,
and stem condition detection.
"""

import io
import numpy as np
from PIL import Image
import cv2


# ─── Constants ────────────────────────────────────────────────────────────────

TARGET_SIZE = (224, 224)

# Healthy leaf reference in HSV (approximate)
HEALTHY_HSV_MEAN = np.array([60, 120, 100])   # Hue=green, high sat, mid val

# Stem browning thresholds (HSV)
BROWN_HUE_LOW    = np.array([10,  40,  40])
BROWN_HUE_HIGH   = np.array([30, 255, 200])
YELLOW_HUE_LOW   = np.array([20,  80,  80])
YELLOW_HUE_HIGH  = np.array([35, 255, 255])


# ─── Core Functions ────────────────────────────────────────────────────────────

def load_image_from_bytes(file_bytes: bytes) -> Image.Image:
    """Load PIL image from raw bytes with explicit error reporting."""
    try:
        if not file_bytes:
            raise ValueError("Zero bytes received by image loader.")
        return Image.open(io.BytesIO(file_bytes)).convert('RGB')
    except Exception as e:
        # Re-raise with more context
        raise ValueError(f"Pillow failed to open image: {str(e)}. Bytes received: {len(file_bytes)}")


def preprocess_for_model(pil_image: Image.Image) -> np.ndarray:
    """
    Resize → normalize to [0,1] → add batch dim.
    Returns shape (1, 224, 224, 3).
    """
    img = pil_image.resize(TARGET_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def image_to_hsv(pil_image: Image.Image) -> np.ndarray:
    """Convert PIL image to OpenCV HSV array."""
    bgr = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)


def calculate_cdi(pil_image: Image.Image) -> float:
    """
    Color Deviation Index (CDI):
    Measures how far the average leaf HSV deviates from a healthy green reference.
    CDI ∈ [0, 1] — higher means more stressed.
    """
    hsv = image_to_hsv(pil_image)

    # Mask out very dark pixels (shadow / background)
    mask = hsv[:, :, 2] > 30
    if mask.sum() == 0:
        return 0.0

    mean_hsv = hsv[mask].mean(axis=0).astype(float)

    # Euclidean distance in HSV space, normalised
    diff = mean_hsv - HEALTHY_HSV_MEAN
    # Weight hue more (color shift is the main stress indicator)
    weights = np.array([2.0, 1.0, 0.5])
    distance = float(np.sqrt((diff ** 2 * weights).sum()))

    # Normalise: max possible distance ≈ 350 (empirical)
    cdi = min(distance / 350.0, 1.0)
    return round(cdi, 4)


def analyze_stem(pil_image: Image.Image) -> dict:
    """
    Stem condition analysis via HSV color segmentation.
    Returns dict with brown_ratio, yellow_ratio, condition string, and score.
    """
    hsv = image_to_hsv(pil_image)
    total = hsv.shape[0] * hsv.shape[1]

    brown_mask  = cv2.inRange(hsv, BROWN_HUE_LOW,  BROWN_HUE_HIGH)
    yellow_mask = cv2.inRange(hsv, YELLOW_HUE_LOW, YELLOW_HUE_HIGH)

    brown_ratio  = float(np.count_nonzero(brown_mask))  / total
    yellow_ratio = float(np.count_nonzero(yellow_mask)) / total
    affected     = brown_ratio + yellow_ratio

    if affected < 0.05:
        condition = "Normal"
        score     = 100
    elif affected < 0.20:
        condition = "Mild browning"
        score     = 75
    elif affected < 0.45:
        condition = "Moderate browning"
        score     = 45
    elif affected < 0.70:
        condition = "Severe browning"
        score     = 20
    else:
        condition = "Critical deterioration"
        score     = 5

    return {
        "condition":    condition,
        "brown_ratio":  round(brown_ratio,  4),
        "yellow_ratio": round(yellow_ratio, 4),
        "affected_pct": round(affected * 100, 2),
        "score":        score,
    }


def green_vs_brown_ratio(pil_image: Image.Image) -> dict:
    """Quick green vs brown/yellow pixel ratio for leaf health proxy."""
    hsv = image_to_hsv(pil_image)

    green_low  = np.array([35,  40, 40])
    green_high = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, green_low, green_high)

    sick_low  = np.array([5,  30, 30])
    sick_high = np.array([35, 255, 255])
    sick_mask = cv2.inRange(hsv, sick_low, sick_high)

    total = hsv.shape[0] * hsv.shape[1]
    green_pct = float(np.count_nonzero(green_mask)) / total
    sick_pct  = float(np.count_nonzero(sick_mask))  / total

    return {
        "green_pct": round(green_pct * 100, 2),
        "sick_pct":  round(sick_pct  * 100, 2),
    }
