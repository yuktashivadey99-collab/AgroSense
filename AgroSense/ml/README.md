# AgroSense AI — ML Training Guide

## Dataset

Use the **PlantVillage** dataset — 87,000 images across 38 disease/healthy classes.

**Download options:**
1. **Kaggle:** https://www.kaggle.com/datasets/emmarex/plantdisease
2. **TensorFlow Datasets:** `tfds.load('plant_village')`
3. **Direct:** https://data.mendeley.com/datasets/tywbtsjrjv/1

Extract to: `ml/datasets/PlantVillage/`

---

## Training

### Google Colab (Recommended — Free GPU)
1. Open `notebooks/train_colab.py` in Colab
2. Enable GPU: Runtime → Change runtime type → GPU
3. Run cells in order

### Local Training
```bash
cd backend
python train_model.py --data_dir ../ml/datasets/PlantVillage --epochs 30
```

### Expected Results
| Metric | Target |
|--------|--------|
| Training Accuracy | >97% |
| Validation Accuracy | >95% |
| Training Time (GPU) | ~2-3 hrs |
| Model Size | ~14 MB |

---

## Model Architecture

```
Input (224×224×3)
    ↓
MobileNetV2 Backbone (ImageNet pretrained)
    ↓
GlobalAveragePooling2D
    ↓
BatchNormalization
    ↓
Dense(512, relu) + Dropout(0.4)
    ↓
Dense(256, relu) + Dropout(0.3)
    ↓
Dense(38, softmax)
```

---

## After Training

Copy the saved model to the backend:
```bash
cp leaf_disease_model.h5 ../backend/models/
cp class_indices.json ../backend/models/
```

The backend auto-detects and loads the model on startup.
