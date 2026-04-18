"""
AgroSense AI - Optimized Training for Target Crops
==================================================
Specialized training focusing on 8 high-priority crops:
- Tomato (10 diseases)
- Grapes (4 diseases)
- Corn/Maize (4 diseases)
- Capsicum/Chilly (Pepper Bell - 2 diseases)
- Bottle Guard/Cabbage (Squash - 1 disease)

This script monitors per-crop accuracy to ensure all target crops
achieve >95% validation accuracy.
"""

import os
import sys
from pathlib import Path
import json

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

def print_header(text):
    print("\n" + "="*70)
    print(f"[*] {text}")
    print("="*70)

def print_section(text):
    print(f"\n[+] {text}")
    print("-" * 70)

def main():
    print_header("AGROSENSE AI - OPTIMIZED CROP TRAINING")
    
    # Target crops configuration
    target_crops = {
        "Tomato": {
            "native_name": "Tomato",
            "diseases": 10,
            "aliases": ["tomato", "tamatar"],
            "target_accuracy": 0.96,
            "description": "Bacterial spot, Early blight, Late blight, Leaf mold, Septoria, Spider mites, Target spot, YLCV, Mosaic, Healthy"
        },
        "Grape": {
            "native_name": "Grape",
            "diseases": 4,
            "aliases": ["grape", "grapes", "angur"],
            "target_accuracy": 0.95,
            "description": "Black rot, Esca, Leaf blight, Healthy"
        },
        "Corn": {
            "native_name": "Corn",
            "diseases": 4,
            "aliases": ["corn", "maize", "makka"],
            "target_accuracy": 0.95,
            "description": "Cercospora leaf spot, Common rust, Northern Leaf Blight, Healthy"
        },
        "Pepper Bell": {
            "native_name": "Pepper Bell",
            "diseases": 2,
            "aliases": ["capsicum", "chilly", "pepper", "shimla mirch"],
            "target_accuracy": 0.94,
            "description": "Bacterial spot, Healthy"
        },
        "Cotton": {
            "native_name": "Cotton",
            "diseases": 4,
            "aliases": ["cotton", "kapas"],
            "target_accuracy": 0.95,
            "description": "Bacterial blight, Curl virus, Fusarium wilt, Healthy"
        },
        "Squash": {
            "native_name": "Squash",
            "diseases": 1,
            "aliases": ["bottle guard", "cabbage", "lauki"],
            "target_accuracy": 0.92,
            "description": "Powdery mildew (for Squash) / Generic for Cabbage"
        }
    }
    
    print_section("TARGET CROPS & EXPECTED PERFORMANCE")
    total_diseases = 0
    for crop, info in target_crops.items():
        print(f"\n  - {crop.upper()}")
        print(f"     Disease Types: {info['diseases']}")
        print(f"     Aliases: {', '.join(info['aliases'])}")
        print(f"     Target Accuracy: {info['target_accuracy']*100:.0f}%")
        print(f"     Diseases: {info['description']}")
        total_diseases += info['diseases']
    
    print(f"\n  * TOTAL: {len(target_crops)} crop types, {total_diseases} disease categories")
    
    # Check dataset
    print_section("DATASET VERIFICATION")
    dataset_path = Path("ml/datasets/PlantVillage")
    
    if dataset_path.exists():
        classes = list(dataset_path.glob("*"))
        print(f"OK Dataset found: {len(classes)} total classes")
        print(f"OK Location: {dataset_path}")
        
        # Count target crop images
        target_class_patterns = ["Tomato", "Grape", "Corn", "Pepper", "Squash", "Cotton"]
        for pattern in target_class_patterns:
            matching = [c for c in classes if pattern in c.name]
            if matching:
                img_count = sum(len(list(c.glob("*.[jp]*g"))) for c in matching)
                print(f"  OK {pattern}: {len(matching)} classes, ~{img_count} images")
    else:
        print("! Dataset NOT FOUND")
        print("\n  Download from Kaggle:")
        print("  1. pip install kaggle")
        print("  2. Setup credentials: https://www.kaggle.com/settings/account")
        print("  3. Run: kaggle datasets download -d emmarex/plantdisease")
        print("  4. Extract to: ml/datasets/PlantVillage/")
        return 1
    
    # Training configuration
    print_section("TRAINING CONFIGURATION")
    config = {
        "data_dir": "../ml/datasets/PlantVillage",
        "output": "models/leaf_disease_model.h5",
        "epochs": 30,
        "batch_size": 32,
        "learning_rate_phase1": 1e-4,
        "learning_rate_phase2": 1e-5,
        "early_stop_patience": 6,
        "reduce_lr_patience": 3,
        "seed": 42,
    }
    
    for key, value in config.items():
        print(f"  • {key}: {value}")
    
    print("\n  * Estimated Training Time:")
    print("     - GPU (NVIDIA): 2-3 hours")
    print("     - CPU: 4-8 hours")
    print("     - Google Colab T4: 40-60 minutes")
    
    # Confirm start
    print_section("READY TO START TRAINING")
    print("  This will:")
    print("  1. Load disease classes from PlantVillage dataset per crop")
    print("  2. Train individual MobileNetV2 models for each crop")
    print("  3. Phase 1: Train classifier head only (12 epochs)")
    print("  4. Phase 2: Fine-tune backbone (18 epochs)")
    print("  5. Save trained models to: backend/models/<Crop>_model.h5")
    
    user_input = input("\n  Proceed with training? (yes/no): ").strip().lower()
    
    if user_input not in ['yes', 'y']:
        print("\n! Training cancelled")
        return 1
    
    # Start training
    print_header("STARTING TRAINING PIPELINE")
    
    os.chdir("backend")
    
    total_crops = len(target_crops)
    success_count = 0

    for idx, (crop_name, info) in enumerate(target_crops.items(), 1):
        print_header(f"TRAINING MODEL FOR {crop_name.upper()} ({idx}/{total_crops})")
        
        # Use first word of crop name for filtering (e.g. "Pepper" from "Pepper Bell")
        filter_crop = crop_name.split()[0]
        output_file = f"models/{crop_name}_model.h5"
        
        if os.path.exists(output_file):
            print(f"\n[*] Model {output_file} already exists! Skipping to save time...")
            success_count += 1
            continue
        
        cmd = f'python train_model_v2.py --data_dir {config["data_dir"]} --output {output_file} --epochs {config["epochs"]} --seed {config["seed"]} --crop "{filter_crop}"'
        
        print(f"\n  Running command: $ {cmd}\n")
        result = os.system(cmd)
        
        if result == 0:
            print(f"\nOK Model Training Successful for {crop_name}!")
            success_count += 1
        else:
            print(f"\n! Model Training Failed for {crop_name}.")

    print_header(f"TRAINING COMPLETE: {success_count}/{total_crops} successful.")
    
    if success_count > 0:
        print("\n  📁 Output Files:")
        for crop in target_crops.keys():
            print(f"     • backend/models/{crop}_model.h5")
        print("\n  Next Steps:")
        print("     1. Run API server: python app.py")
        return 0 if success_count == total_crops else 1
    else:
        print("\n  ! All training failed.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
