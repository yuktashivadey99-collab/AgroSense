"""
Kaggle Credentials Setup Assistant
"""

import os
import sys
from pathlib import Path
import json

def setup_kaggle_credentials():
    """Guide user through setting up Kaggle API credentials"""
    
    print("\n" + "="*70)
    print("🔑 KAGGLE API CREDENTIALS SETUP")
    print("="*70)
    
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_json = kaggle_dir / "kaggle.json"
    
    print("\n📋 This script will help you set up Kaggle API access.\n")
    
    print("STEP 1: Get your Kaggle API Token")
    print("-" * 70)
    print("  1. Open: https://www.kaggle.com/settings/account")
    print("  2. Scroll down to 'API' section")
    print("  3. Click 'Create New API Token'")
    print("     (This downloads kaggle.json)")
    print("  4. Keep the file open or ready")
    
    print("\n\nSTEP 2: Open the kaggle.json file")
    print("-" * 70)
    print("  ✓ The downloaded file contains your API credentials")
    print("  ✓ It looks like:")
    print("    {")
    print('      "username": "your_username",')
    print('      "key": "your_api_key"')
    print("    }")
    
    print("\n\nSTEP 3: Paste the credentials")
    print("-" * 70)
    print(f"  Credentials will be saved to: {kaggle_json}")
    print("\n  Paste the ENTIRE contents of kaggle.json below")
    print("  (including the curly braces { })")
    print("  When done, press Enter twice:\n")
    
    lines = []
    while True:
        line = input()
        if line == "":
            if lines and lines[-1] == "":
                break
            lines.append("")
        else:
            lines.append(line)
    
    credentials_text = "\n".join(lines[:-1])  # Remove last empty line
    
    if not credentials_text.strip().startswith("{"):
        print("\n✗ Invalid format. Credentials must start with {")
        return False
    
    try:
        credentials = json.loads(credentials_text)
        
        if "username" not in credentials or "key" not in credentials:
            print("\n✗ Invalid credentials format. Must have 'username' and 'key'")
            return False
        
        # Create .kaggle directory if it doesn't exist
        kaggle_dir.mkdir(parents=True, exist_ok=True)
        
        # Write credentials
        with open(kaggle_json, 'w') as f:
            json.dump(credentials, f)
        
        # Set permissions (important for security)
        os.chmod(kaggle_json, 0o600)
        
        print("\n" + "="*70)
        print("✅ CREDENTIALS SAVED SUCCESSFULLY!")
        print("="*70)
        print(f"\n✓ Saved to: {kaggle_json}")
        print(f"✓ Username: {credentials['username']}")
        print("\nYou can now download the dataset!")
        
        return True
        
    except json.JSONDecodeError:
        print("\n✗ Invalid JSON format. Please try again.")
        return False
    except Exception as e:
        print(f"\n✗ Error saving credentials: {e}")
        return False

def verify_credentials():
    """Verify Kaggle credentials are working"""
    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    
    if not kaggle_json.exists():
        return False
    
    try:
        with open(kaggle_json) as f:
            creds = json.load(f)
        return "username" in creds and "key" in creds
    except:
        return False

if __name__ == "__main__":
    if verify_credentials():
        print("\n✓ Kaggle credentials already configured!")
        print("  You can now download the dataset.")
    else:
        success = setup_kaggle_credentials()
        sys.exit(0 if success else 1)
