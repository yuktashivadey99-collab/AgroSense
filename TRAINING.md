# 🚀 Training AgroSense AI Model

Complete guide for training the leaf disease classifier on the PlantVillage dataset.

## Prerequisites

- Python 3.9+
- NVIDIA GPU (recommended: 8GB+ VRAM, or use [Google Colab](https://colab.research.google.com) for free T4 GPU)
- 2-4 hours for full training (GPU: 2-3 hrs, CPU: 4-8 hrs)
- ~500MB disk space for dataset (~2GB after extraction)

## Quick Start

### 1. Get the Dataset

The PlantVillage dataset contains **16,000+ labeled plant disease images** across **34 classes**.

**Option A: Download from Kaggle (Recommended)**
```bash
# Install Kaggle CLI
pip install kaggle

# Setup credentials: https://www.kaggle.com/settings/account
# Click "Create New API Token" and save to ~/.kaggle/kaggle.json

# Download dataset
kaggle datasets download -d emmarex/plantdisease -p ml/datasets/
cd ml/datasets && unzip plantdisease.zip && rm plantdisease.zip
```

**Option B: Manual Download**
1. Visit: https://www.kaggle.com/datasets/emmarex/plantdisease/data
2. Click "Download"
3. Extract to: `ml/datasets/PlantVillage/`

**Option C: TensorFlow Auto-Download**
- Skip manual download; model will auto-download on first training run (slower, ~30-60 mins)

### 2. Start Training

```bash
cd backend

# Full training (30 epochs)
python train_model_v2.py \
  --data_dir ../ml/datasets/PlantVillage \
  --output models/leaf_disease_model.h5 \
  --epochs 30 \
  --seed 42
```

**Alternative - Quick Test (10 epochs)**
```bash
python train_model_v2.py --epochs 10
```

### 3. Monitor Training

Training happens in **two phases**:

- **Phase 1** (12 epochs): Train classifier head only
  - Frozen MobileNetV2 backbone
  - Learning rate: 1e-4
  - Focus: Learn disease patterns from pre-trained features

- **Phase 2** (18 epochs): Fine-tune backbone
  - Unfreeze top 60 MobileNetV2 layers
  - Learning rate: 1e-5 (10x lower)
  - Early stop if validation plateaus (patience: 6 epochs)
  - Reduce LR by 0.4x if no improvement (patience: 3 epochs)

**Expected console output:**
```
Classes found: 34
Training samples: 11200
Validation samples: 2400
Test samples: 2400

Phase 1: train classifier head
Epoch 1/12
... [training output] ...

Phase 2: fine-tune upper backbone layers
Epoch 13/30
... [training output] ...

Validation metrics: {'loss': 0.1234, 'accuracy': 0.9567, 'top3_acc': 0.9923}
Test metrics: {'loss': 0.1456, 'accuracy': 0.9412, 'top3_acc': 0.9834}

Model saved to: models/leaf_disease_model.h5
```

## Expected Performance

| Metric | Target | Typical Result |
|--------|--------|---|
| Training Accuracy | >97% | 98-99% |
| Validation Accuracy | >94% | 95-97% |
| Test Accuracy | >92% | 93-96% |
| Per-Class F1 Score | 0.85-0.95 | 0.88-0.97 |
| Training Time (GPU) | 2-3 hrs | 2-3 hrs |
| Training Time (CPU) | 4-6 hrs | 4-8 hrs |
| Model Size | ~14 MB | ~14 MB |

## Model Architecture

```
Input Layer (224×224×3)
         ↓
Augmentation (flip, rotate, zoom, contrast, brightness)
         ↓
MobileNetV2 Backbone (frozen initially)
         ↓
GlobalAveragePooling2D
         ↓
BatchNormalization → Dropout(0.35)
         ↓
Dense(256, ReLU) → Dropout(0.25)
         ↓
Dense(34, Softmax) → Output (disease classification)
```

## Output Files

After training completes, check these files:

```
backend/
├── models/
│   └── leaf_disease_model.h5              # Trained model (14 MB)
├── class_indices.json                     # Class name → index mapping
└── training_artifacts/
    ├── dataset_split.json                 # Train/val/test counts
    ├── training_log.csv                   # Per-epoch metrics
    ├── history.json                       # Loss & accuracy history graphs
    ├── validation/
    │   ├── confusion_matrix.csv
    │   └── metrics.json                   # Per-class precision/recall/F1
    └── test/
        ├── confusion_matrix.csv
        └── metrics.json
```

## Verification

After training, verify the model:

```bash
cd backend

# Test model loading
python -c "from models.ml_model import load_model; m = load_model(); print('✓ Model loaded')"

# Run test suite
python test_pipeline.py
# Should show 6 PASS tests
```

## Supported Crop Classes (34 total)

The model supports these crops and diseases:

- **Apple** (4): Black rot, Cedar apple rust, Scab, Healthy
- **Blueberry** (1): Healthy
- **Cherry** (2): Powdery mildew, Healthy
- **Corn** (4): Cercospora leaf spot, Common rust, Northern Leaf Blight, Healthy
- **Grape** (4): Black rot, Esca, Leaf blight, Healthy
- **Orange** (1): Haunglongbing (Citrus greening)
- **Peach** (2): Bacterial spot, Healthy
- **Pepper Bell** (2): Bacterial spot, Healthy
- **Potato** (3): Early blight, Late blight, Healthy
- **Raspberry** (1): Healthy
- **Soybean** (1): Healthy
- **Squash** (1): Powdery mildew
- **Strawberry** (1): Healthy
- **Tomato** (10): Bacterial spot, Early blight, Late blight, Leaf mold, Septoria leaf spot, Spider mites, Target spot, Yellow Leaf Curl Virus, Mosaic virus, Healthy

## Troubleshooting

### ❌ "No images found in dataset"
- Verify dataset structure: `ml/datasets/PlantVillage/{disease_class}/{images}`
- Check image formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`
- Confirm extraction completed successfully

### ❌ "CUDA out of memory" or "ResourceExhaustedError"
**Solution:**
1. Reduce batch size in `backend/train_model_v2.py`:
   ```python
   BATCH_SIZE = 16  # or 8
   ```
2. Close other GPU applications
3. Use CPU instead (slower but works)
4. Use Google Colab (free GPU)

### ❌ "GPU not detected" but you have NVIDIA GPU
**Solution:**
1. Install NVIDIA drivers: https://www.nvidia.com/Download/driverDetails.aspx
2. Install CUDA toolkit
3. TensorFlow will auto-detect; if not, use CPU (still works)

### ⚠️ Training is very slow
- **CPU mode**: Expected 4-8 hours (normal)
- **Solution 1**: Use Google Colab with free T4 GPU (3-5x faster)
- **Solution 2**: Install GPU support locally
- **Solution 3**: Reduce `--epochs` for quick testing

### ❌ "ModuleNotFoundError" or import errors
```bash
cd backend
pip install -r requirements.txt
```

### ❌ Training stops unexpectedly
- Check terminal for error messages
- Verify dataset path is correct
- Ensure disk space available
- Check GPU memory with: `nvidia-smi`

## Advanced Training

### Custom Hyperparameters
```bash
python train_model_v2.py \
  --data_dir /custom/dataset/path \
  --output models/my_model_v2.h5 \
  --epochs 50 \
  --seed 999
```

### Train on Google Colab (Recommended for Free GPU)

1. Open: https://colab.research.google.com/
2. Create new notebook
3. Upload `ml/notebooks/train_colab.py` or paste:
   ```python
   # Run this in Colab to train with free T4 GPU (3-5x faster)
   ```
4. Set GPU runtime: **Runtime → Change runtime type → GPU (T4)**
5. Run all cells

Expected training time on Colab: **40-60 minutes** (vs 2-3 hours locally)

## Performance Tips

1. **GPU Setup**
   - Use NVIDIA GPU if available (2-3 hrs)
   - Google Colab free T4 (40-60 mins)
   - CPU fallback supported (4-8 hrs)

2. **Data Pipeline**
   - Uses TensorFlow `tf.data` for efficient loading
   - Automatic prefetching and parallel decoding
   - RandomCrop, RandomFlip augmentation prevents overfitting

3. **Learning Strategy**
   - Two-phase training: classifier head → backbone fine-tuning
   - Adaptive learning rate reduction if plateau
   - Early stopping prevents overfitting
   - Class-weighted loss balances imbalanced data

4. **Model Optimization**
   - MobileNetV2 (lightweight: 3.5M params, 14MB model)
   - Supports CPU inference and mobile deployment
   - Top-3 accuracy metric for better reliability

## Integration with API

Once trained, the model is automatically used by the API:

```python
# backend/routes/analyze.py
from models.ml_model import predict_leaf_disease

result = predict_leaf_disease(
    image_array=preprocessed_image,
    selected_crop="Tomato",
    cdi_score=0.25,
    visual_stats={"green_pct": 65, "sick_pct": 8}
)
```

The API endpoint is ready at: `POST /api/v1/analyze`

## Support

- **Issues?** Check `backend/training_artifacts/training_log.csv` for per-epoch metrics
- **Slow training?** Use Google Colab for free GPU
- **Model not improving?** Try more epochs or Google Colab GPU
- **Questions?** Review this guide or check model training output
