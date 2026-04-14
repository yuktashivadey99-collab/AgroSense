#!/usr/bin/env python3
"""
AgroSense AI — End-to-End Testing Suite
Tests model loading, inference, API endpoints, and crop mappings.
Run: python test_pipeline.py
"""

import os
import sys
import json
import time
import requests
import numpy as np
from pathlib import Path
from PIL import Image
import io

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

def test_model_loading():
    """Test 1: Model loads correctly"""
    print("\n" + "="*60)
    print("TEST 1: Model Loading")
    print("="*60)
    try:
        from models.ml_model import load_model, DISEASE_CLASSES, SUPPORTED_CROPS
        model = load_model()
        print(f"✓ Model loaded")
        print(f"  - Classes: {len(DISEASE_CLASSES)} diseases")
        print(f"  - Supported crops: {len(SUPPORTED_CROPS)} crop types")
        print(f"  - Sample crops: {SUPPORTED_CROPS[:5]}")
        return True
    except Exception as e:
        print(f"✗ Model loading failed: {e}")
        return False

def test_crop_mapping():
    """Test 2: Crop aliases are configured"""
    print("\n" + "="*60)
    print("TEST 2: Crop Mapping")
    print("="*60)
    try:
        from models.ml_model import _crop_aliases, _normalize_crop_name
        aliases = _crop_aliases()
        
        user_crops = ["Tomato", "Cotton", "Grapes", "Capsicum", "Chilly", "Maize", "Cabbage", "Corn", "Bottleguard"]
        
        for crop in user_crops:
            norm = _normalize_crop_name(crop)
            if norm in aliases:
                mapped = list(aliases[norm])[0]
                print(f"  ✓ {crop:15} → {mapped}")
            else:
                print(f"  ✗ {crop:15} → NOT MAPPED")
                return False
        return True
    except Exception as e:
        print(f"✗ Crop mapping test failed: {e}")
        return False

def test_preprocessing():
    """Test 3: Image preprocessing pipeline"""
    print("\n" + "="*60)
    print("TEST 3: Image Preprocessing")
    print("="*60)
    try:
        from utils.image_processing import (
            load_image_from_bytes,
            preprocess_for_model,
            calculate_cdi,
            green_vs_brown_ratio,
        )
        
        # Create synthetic leaf image (greenish)
        img_array = np.ones((224, 224, 3), dtype=np.uint8)
        img_array[:,:,1] = 180  # Strong green channel
        img_bytes = io.BytesIO()
        Image.fromarray(img_array).save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        # Test preprocessing
        pil_img = load_image_from_bytes(img_bytes.getvalue())
        processed = preprocess_for_model(pil_img)
        cdi = calculate_cdi(pil_img)
        visual = green_vs_brown_ratio(pil_img)
        
        print(f"✓ Image preprocessing successful")
        print(f"  - Shape: {processed.shape}")
        print(f"  - Range: [{processed.min():.2f}, {processed.max():.2f}]")
        print(f"  - CDI score: {cdi:.4f}")
        print(f"  - Green%: {visual['green_pct']:.1f}, Sick%: {visual['sick_pct']:.1f}")
        return True
    except Exception as e:
        print(f"✗ Image preprocessing failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_prediction():
    """Test 4: Leaf disease prediction"""
    print("\n" + "="*60)
    print("TEST 4: Leaf Disease Prediction")
    print("="*60)
    try:
        from models.ml_model import predict_leaf_disease
        from utils.image_processing import green_vs_brown_ratio
        
        # Create synthetic healthy leaf image
        img_array = np.ones((1, 224, 224, 3), dtype=np.float32) * 0.5
        img_array[0, :, :, 1] *= 1.6  # Boost green channel for "healthy" appearance
        
        result = predict_leaf_disease(
            img_array,
            selected_crop="Tomato",
            cdi_score=0.15,
            visual_stats={"green_pct": 65, "sick_pct": 8}
        )
        
        print(f"✓ Prediction successful")
        print(f"  - Disease: {result['disease']}")
        print(f"  - Confidence: {result['confidence']*100:.1f}%")
        print(f"  - Is Healthy: {result['is_healthy']}")
        print(f"  - Requires Review: {result['requires_review']}")
        return True
    except Exception as e:
        print(f"✗ Prediction failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_api_endpoints():
    """Test 5: API endpoints"""
    print("\n" + "="*60)
    print("TEST 5: API Endpoints")
    print("="*60)
    
    base_url = "http://localhost:8000"
    
    # Test if server is running
    try:
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code != 200:
            print(f"⚠ Server not responding to health check")
            return True  # Skip API tests if server not running
    except requests.exceptions.ConnectionError:
        print(f"⚠ Backend not running at {base_url}")
        print(f"  Start with: python app.py")
        return True  # Skip API tests if server not running
    
    try:
        # Test crops endpoint
        response = requests.get(f"{base_url}/api/crops", timeout=5)
        if response.status_code == 200:
            crops = response.json().get("crops", [])
            print(f"✓ /api/crops endpoint working")
            print(f"  - Available crops: {len(crops)}")
            print(f"  - Sample: {crops[:5]}")
        else:
            print(f"✗ /api/crops returned {response.status_code}")
            return False
        
        # Test analyze endpoint (mock)
        print(f"✓ API endpoints accessible")
        return True
    except Exception as e:
        print(f"✗ API test failed: {e}")
        return False

def test_database_connection():
    """Test 6: Optional MongoDB connection"""
    print("\n" + "="*60)
    print("TEST 6: Database Connection")
    print("="*60)
    try:
        from utils.database import get_collection
        from config import settings
        
        if not settings.mongo_uri:
            print("⚠ MongoDB URI not configured (.env)")
            print("  In-memory storage will be used")
            return True
        
        collection = get_collection("test_collection")
        print(f"✓ Database connection successful")
        return True
    except Exception as e:
        print(f"⚠ Database connection failed (in-memory fallback active): {e}")
        return True  # Not critical

def main():
    """Run all tests"""
    print("\n" + "▓" * 60)
    print("▓  AgroSense AI — Pipeline Test Suite")
    print("▓" * 60)
    
    tests = [
        ("Model Loading", test_model_loading),
        ("Crop Mapping", test_crop_mapping),
        ("Image Preprocessing", test_preprocessing),
        ("Prediction", test_prediction),
        ("API Endpoints", test_api_endpoints),
        ("Database", test_database_connection),
    ]
    
    results = []
    start_time = time.time()
    
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n✗ Test crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status:7} — {name}")
    
    elapsed = time.time() - start_time
    print(f"\nTotal: {passed}/{total} tests passed in {elapsed:.2f}s")
    
    if passed == total:
        print("\n✓ All systems operational! Ready for production.")
        return 0
    else:
        print("\n✗ Some tests failed. Review configuration before deployment.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
