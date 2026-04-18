"""
Direct Kaggle API Download - PlantVillage Dataset
"""

import os
import sys
from pathlib import Path
import shutil

def download_dataset():
    """Download using Kaggle API directly"""
    print("\n" + "="*70)
    print("📥 Downloading PlantVillage Dataset")
    print("="*70)
    
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        
        api = KaggleApi()
        api.authenticate()
        
        output_dir = Path("ml/datasets")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\nDownloading to: {output_dir.absolute()}")
        print("Dataset size: ~1-3 GB")
        print("Expected time: 5-30 minutes\n")
        
        # Download
        api.dataset_download_files("emmarex/plantdisease", path=str(output_dir), unzip=True)
        
        # Cleanup zip
        zip_file = output_dir / "plantdisease.zip"
        if zip_file.exists():
            zip_file.unlink()
            print("✓ Cleaned up ZIP file")
        
        # Verify
        plant_village = output_dir / "PlantVillage"
        if plant_village.exists():
            classes = list(plant_village.glob("*"))
            print(f"\n✓ Dataset extracted successfully!")
            print(f"✓ Found {len(classes)} disease classes")
            
            # Count images
            image_count = sum(1 for _ in plant_village.rglob("*.[jp]*g"))
            print(f"✓ Total images: {image_count}")
            
            print("\n" + "="*70)
            print("✅ Dataset ready! You can now train the model.")
            print("="*70)
            print("\nNext: Run this command to start training:")
            print("  $ python train_crops.py")
            
            return True
        else:
            print("✗ Extraction did not complete")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        print("\n⚠ Manual download required:")
        print("  1. Visit: https://www.kaggle.com/datasets/emmarex/plantdisease/data")
        print("  2. Click 'Download'")
        print("  3. Extract to: ml/datasets/PlantVillage/")
        return False

if __name__ == "__main__":
    success = download_dataset()
    sys.exit(0 if success else 1)
