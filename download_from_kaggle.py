"""
Kaggle Dataset Download Helper
================================
Automated script to download PlantVillage dataset from Kaggle
"""

import os
import sys
import subprocess
from pathlib import Path

def install_kaggle():
    """Install Kaggle CLI if not present"""
    print("\n" + "="*70)
    print("📦 Installing Kaggle CLI...")
    print("="*70)
    try:
        import kaggle
        print("✓ Kaggle already installed")
        return True
    except ImportError:
        print("Installing kaggle package...")
        result = subprocess.run([sys.executable, "-m", "pip", "install", "kaggle", "--quiet"])
        if result.returncode == 0:
            print("✓ Kaggle installed successfully")
            return True
        else:
            print("✗ Failed to install kaggle")
            return False

def setup_kaggle_credentials():
    """Guide user through Kaggle credential setup"""
    print("\n" + "="*70)
    print("🔑 Kaggle API Credentials Setup")
    print("="*70)
    
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_json = kaggle_dir / "kaggle.json"
    
    if kaggle_json.exists():
        print("✓ Kaggle credentials found at: ~/.kaggle/kaggle.json")
        return True
    
    print("\n⚠ Kaggle credentials NOT found")
    print("\nFollow these steps:")
    print("  1. Go to: https://www.kaggle.com/settings/account")
    print("  2. Scroll to 'API' section")
    print("  3. Click 'Create New API Token'")
    print("  4. This downloads 'kaggle.json'")
    print("  5. Save it to: ~/.kaggle/kaggle.json")
    print("\nFor Windows users (~/.kaggle = C:\\Users\\{username}\\.kaggle)")
    
    input("\nPress Enter after you've saved kaggle.json...")
    
    if kaggle_json.exists():
        print("✓ Credentials found!")
        return True
    else:
        print("✗ Credentials still not found. Please save kaggle.json manually.")
        return False

def download_dataset():
    """Download PlantVillage dataset"""
    print("\n" + "="*70)
    print("📥 Downloading PlantVillage Dataset")
    print("="*70)
    
    output_dir = Path("ml/datasets")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\nDownloading to: {output_dir.absolute()}")
    print("Dataset size: ~1-3 GB (depends on connection)")
    print("Expected time: 5-30 minutes\n")
    
    try:
        # Download
        print("Starting download... (this may take several minutes)\n")
        result = subprocess.run([
            sys.executable, "-m", "kaggle", 
            "datasets", "download", 
            "-d", "abdallahalbin/plantvillage-dataset",
            "-p", str(output_dir),
            "--unzip"
        ])
        
        if result.returncode != 0:
            print("✗ Download failed")
            return False
        
        # Cleanup zip
        zip_file = output_dir / "plantdisease.zip"
        if zip_file.exists():
            zip_file.unlink()
            print("✓ Cleaned up ZIP file")
        
        # Verify extraction
        plant_village = output_dir / "PlantVillage"
        if plant_village.exists():
            classes = list(plant_village.glob("*"))
            print(f"\n✓ Dataset extracted successfully!")
            print(f"✓ Found {len(classes)} disease classes")
            
            # Count images
            image_count = sum(1 for _ in plant_village.rglob("*.[jp]*g"))
            print(f"✓ Total images: {image_count}")
            
            return True
        else:
            print("✗ Extraction did not complete properly")
            return False
            
    except Exception as e:
        print(f"✗ Error during download: {e}")
        return False

def verify_dataset():
    """Verify dataset structure"""
    print("\n" + "="*70)
    print("✓ Verifying Dataset")
    print("="*70)
    
    plant_village = Path("ml/datasets/PlantVillage")
    
    if not plant_village.exists():
        print("\n✗ Dataset not found at: ml/datasets/PlantVillage/")
        return False
    
    classes = list(plant_village.glob("*"))
    
    print(f"\n✓ Dataset found with {len(classes)} classes:")
    
    # Show target crops
    target_patterns = ["Tomato", "Grape", "Corn", "Pepper", "Squash"]
    
    for pattern in target_patterns:
        matching = [c for c in classes if pattern in c.name]
        if matching:
            total_imgs = sum(len(list(c.glob("*.[jp]*g"))) for c in matching)
            print(f"\n  🌱 {pattern}:")
            for cls in sorted(matching):
                img_count = len(list(cls.glob("*.[jp]*g")))
                print(f"     • {cls.name}: {img_count} images")
    
    return True

def main():
    print("\n" + "="*70)
    print("🌾 AgroSense PlantVillage Dataset Downloader")
    print("="*70)
    
    # Check if already downloaded
    if (Path("ml/datasets/PlantVillage").exists() and 
        list(Path("ml/datasets/PlantVillage").glob("*"))):
        print("\n✓ Dataset already downloaded!")
        verify_dataset()
        return 0
    
    # Install Kaggle
    if not install_kaggle():
        print("\n✗ Could not install Kaggle. Install manually:")
        print("  $ pip install kaggle")
        return 1
    
    # Setup credentials
    if not setup_kaggle_credentials():
        print("\n✗ Kaggle credentials required. See setup instructions.")
        return 1
    
    # Download
    if not download_dataset():
        print("\n✗ Download failed. Try manually:")
        print("  1. Visit: https://www.kaggle.com/datasets/abdallahalbin/plantvillage-dataset")
        print("  2. Click Download")
        print("  3. Extract to: ml/datasets/PlantVillage/")
        return 1
    
    # Verify
    if verify_dataset():
        print("\n" + "="*70)
        print("✅ Dataset ready! You can now train the model.")
        print("="*70)
        print("\nNext: Run this command to start training:")
        print("  $ python train_crops.py")
        return 0
    else:
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
