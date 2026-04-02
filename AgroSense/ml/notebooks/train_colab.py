# AgroSense AI — Colab/Jupyter Training Notebook
# Run this cell-by-cell in Google Colab for free GPU training
# ============================================================

# ── Cell 1: Setup & Install ─────────────────────────────────
"""
!pip install tensorflow==2.15.0 opencv-python-headless numpy pillow matplotlib seaborn kaggle
"""

# ── Cell 2: Download Dataset ────────────────────────────────
"""
# Option A: Kaggle API
!kaggle datasets download -d emmarex/plantdisease
!unzip -q plantdisease.zip -d PlantVillage

# Option B: TensorFlow Datasets
import tensorflow_datasets as tfds
ds, info = tfds.load('plant_village', with_info=True, as_supervised=True)
"""

# ── Cell 3: Imports ─────────────────────────────────────────
import os, json, numpy as np, matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

print(f"TensorFlow: {tf.__version__}")
print(f"GPU available: {len(tf.config.list_physical_devices('GPU')) > 0}")

# ── Cell 4: Config ───────────────────────────────────────────
DATA_DIR    = 'PlantVillage/PlantVillage'   # adjust to your path
IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
EPOCHS      = 30
LR          = 1e-4
MODEL_SAVE  = 'leaf_disease_model.h5'

# ── Cell 5: Data Generators ──────────────────────────────────
train_datagen = ImageDataGenerator(
    rescale=1./255, validation_split=0.2,
    rotation_range=20, width_shift_range=0.15,
    height_shift_range=0.15, shear_range=0.1,
    zoom_range=0.15, horizontal_flip=True,
    brightness_range=[0.8, 1.2], fill_mode='nearest',
)

val_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_gen = train_datagen.flow_from_directory(
    DATA_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', subset='training', shuffle=True, seed=42,
)

val_gen = val_datagen.flow_from_directory(
    DATA_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', subset='validation', shuffle=False, seed=42,
)

NUM_CLASSES = train_gen.num_classes
print(f"Classes: {NUM_CLASSES}  |  Train: {train_gen.samples}  |  Val: {val_gen.samples}")

# Save class index map
class_map = {str(v): k for k, v in train_gen.class_indices.items()}
with open('class_indices.json', 'w') as f:
    json.dump(class_map, f, indent=2)
print("✅ class_indices.json saved")

# ── Cell 6: Build Model ──────────────────────────────────────
base = MobileNetV2(input_shape=(*IMG_SIZE, 3), include_top=False, weights='imagenet')
base.trainable = False

inputs  = keras.Input(shape=(*IMG_SIZE, 3))
x       = base(inputs, training=False)
x       = layers.GlobalAveragePooling2D()(x)
x       = layers.BatchNormalization()(x)
x       = layers.Dense(512, activation='relu')(x)
x       = layers.Dropout(0.4)(x)
x       = layers.Dense(256, activation='relu')(x)
x       = layers.Dropout(0.3)(x)
outputs = layers.Dense(NUM_CLASSES, activation='softmax')(x)

model = keras.Model(inputs, outputs, name='AgroSense_MobileNetV2')
model.compile(
    optimizer=keras.optimizers.Adam(LR),
    loss='categorical_crossentropy',
    metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3, name='top3')],
)
model.summary()

# ── Cell 7: Phase 1 Training ─────────────────────────────────
cb_p1 = [
    ModelCheckpoint(MODEL_SAVE, save_best_only=True, monitor='val_accuracy', verbose=1),
    EarlyStopping(patience=8, restore_best_weights=True),
    ReduceLROnPlateau(factor=0.5, patience=4, min_lr=1e-7, verbose=1),
]

print("\n── Phase 1: Training head only ──")
h1 = model.fit(train_gen, validation_data=val_gen, epochs=15, callbacks=cb_p1)

# ── Cell 8: Phase 2 Fine-tuning ──────────────────────────────
base.trainable = True
for layer in base.layers[:-50]:
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(LR / 10),
    loss='categorical_crossentropy',
    metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3, name='top3')],
)

cb_p2 = [
    ModelCheckpoint(MODEL_SAVE, save_best_only=True, monitor='val_accuracy', verbose=1),
    EarlyStopping(patience=10, restore_best_weights=True),
    ReduceLROnPlateau(factor=0.3, patience=5, min_lr=1e-8, verbose=1),
]

print("\n── Phase 2: Fine-tuning ──")
h2 = model.fit(
    train_gen, validation_data=val_gen,
    epochs=EPOCHS, initial_epoch=len(h1.history['loss']),
    callbacks=cb_p2,
)

# ── Cell 9: Plot Training Curves ─────────────────────────────
acc  = h1.history['accuracy']  + h2.history['accuracy']
vacc = h1.history['val_accuracy'] + h2.history['val_accuracy']
loss = h1.history['loss'] + h2.history['loss']
vloss= h1.history['val_loss'] + h2.history['val_loss']

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(acc,  label='Train Acc', color='#22c55e')
axes[0].plot(vacc, label='Val Acc',   color='#4ade80', linestyle='--')
axes[0].set_title('Accuracy'); axes[0].legend(); axes[0].set_xlabel('Epoch')

axes[1].plot(loss,  label='Train Loss', color='#ef4444')
axes[1].plot(vloss, label='Val Loss',   color='#f87171', linestyle='--')
axes[1].set_title('Loss'); axes[1].legend(); axes[1].set_xlabel('Epoch')

plt.tight_layout()
plt.savefig('training_curves.png', dpi=150)
plt.show()

best_val = max(vacc)
print(f"\n🏆 Best Validation Accuracy: {best_val:.4f} ({best_val*100:.2f}%)")
print(f"✅ Model saved to: {MODEL_SAVE}")

# ── Cell 10: Quick Inference Test ────────────────────────────
"""
from PIL import Image
import numpy as np

def predict_image(model, img_path, class_map):
    img = Image.open(img_path).convert('RGB').resize((224, 224))
    arr = np.expand_dims(np.array(img) / 255.0, 0)
    preds = model.predict(arr)[0]
    idx = np.argmax(preds)
    return class_map[str(idx)], float(preds[idx])

disease, conf = predict_image(model, 'test_leaf.jpg', class_map)
print(f"Prediction: {disease}  ({conf*100:.1f}%)")
"""
