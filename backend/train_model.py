"""
AgroSense AI — MobileNetV2 Training Script
==========================================
Trains a MobileNetV2-based leaf disease classifier
on the PlantVillage dataset.

Usage:
    python train_model.py --data_dir /path/to/PlantVillage --epochs 30

Dataset: https://www.kaggle.com/datasets/emmarex/plantdisease
         (or use tensorflow_datasets: plant_village)
"""

import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard
)


# ─── Config ───────────────────────────────────────────────────────────────────

IMG_SIZE    = (224, 224)
BATCH_SIZE  = 32
NUM_CLASSES = 38          # PlantVillage has 38 disease/healthy classes
EPOCHS      = 30
LEARNING_RATE = 1e-4


# ─── Data Augmentation ────────────────────────────────────────────────────────

def build_data_generators(data_dir: str):
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
        rotation_range=30,  # Increased
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,  # Added for leaf symmetry
        brightness_range=[0.7, 1.3],  # Wider range
        channel_shift_range=0.1,  # Color augmentation
        fill_mode='reflect',  # Better fill mode
    )

    val_datagen = ImageDataGenerator(
        rescale=1.0 / 255,
        validation_split=0.2,
    )

    test_datagen = ImageDataGenerator(rescale=1.0 / 255)

    train_gen = train_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True,
        seed=42,
    )

    val_gen = val_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False,
        seed=42,
    )

    # Add test generator for final evaluation
    test_gen = test_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset=None,  # Use all data for test if no test split
        shuffle=False,
        seed=42,
    )

    return train_gen, val_gen, test_gen


# ─── Model Architecture ────────────────────────────────────────────────────────

def build_model(num_classes: int) -> keras.Model:
    """
    Enhanced MobileNetV2 with custom classification head.
    Includes data augmentation layers, better regularization.
    """
    base = MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights='imagenet',
    )
    base.trainable = False   # Phase 1: frozen

    inputs  = keras.Input(shape=(*IMG_SIZE, 3))

    # Add data augmentation as layers for consistency
    x = layers.RandomRotation(0.1)(inputs)
    x = layers.RandomZoom(0.1)(x)
    x = layers.RandomFlip("horizontal")(x)

    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(512, activation='relu', kernel_regularizer=keras.regularizers.l2(0.01))(x)
    x = layers.Dropout(0.5)(x)  # Increased dropout
    x = layers.Dense(256, activation='relu', kernel_regularizer=keras.regularizers.l2(0.01))(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = keras.Model(inputs, outputs, name='AgroSense_MobileNetV2_v2')
    return model, base


# ─── Training ─────────────────────────────────────────────────────────────────

def train(data_dir: str, output_path: str, epochs: int):
    print(f"\n{'='*60}")
    print("  AgroSense AI — Enhanced MobileNetV2 Disease Classifier Training")
    print(f"{'='*60}\n")

    train_gen, val_gen, test_gen = build_data_generators(data_dir)
    num_classes = train_gen.num_classes
    print(f"✓ Classes found: {num_classes}")
    print(f"✓ Training samples: {train_gen.samples}")
    print(f"✓ Validation samples: {val_gen.samples}")
    print(f"✓ Test samples: {test_gen.samples}\n")

    model, base_model = build_model(num_classes)

    model.compile(
        optimizer=keras.optimizers.Adam(LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.TopKCategoricalAccuracy(k=3, name='top3_acc'),
            keras.metrics.Precision(name='precision'),
            keras.metrics.Recall(name='recall'),
            keras.metrics.AUC(name='auc')
        ],
    )

    model.summary()

    os.makedirs('logs', exist_ok=True)
    callbacks_phase1 = [
        ModelCheckpoint(output_path, save_best_only=True, monitor='val_accuracy', verbose=1),
        EarlyStopping(patience=8, restore_best_weights=True, monitor='val_accuracy'),
        ReduceLROnPlateau(factor=0.5, patience=4, min_lr=1e-7, verbose=1),
        TensorBoard(log_dir='logs/phase1'),
    ]

    print("\n─── Phase 1: Training classification head ───\n")
    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=min(epochs, 15),
        callbacks=callbacks_phase1,
        verbose=1,
    )

    # Phase 2: Unfreeze more layers and fine-tune
    print("\n─── Phase 2: Fine-tuning top 100 backbone layers ───\n")
    base_model.trainable = True
    for layer in base_model.layers[:-100]:  # More layers
        layer.trainable = False

    model.compile(
        optimizer=keras.optimizers.Adam(LEARNING_RATE / 10),
        loss='categorical_crossentropy',
        metrics=[
            'accuracy',
            keras.metrics.TopKCategoricalAccuracy(k=3, name='top3_acc'),
            keras.metrics.Precision(name='precision'),
            keras.metrics.Recall(name='recall'),
            keras.metrics.AUC(name='auc')
        ],
    )

    callbacks_phase2 = [
        ModelCheckpoint(output_path, save_best_only=True, monitor='val_accuracy', verbose=1),
        EarlyStopping(patience=10, restore_best_weights=True, monitor='val_accuracy'),
        ReduceLROnPlateau(factor=0.3, patience=5, min_lr=1e-8, verbose=1),
        TensorBoard(log_dir='logs/phase2'),
    ]

    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        initial_epoch=len(history1.history['loss']),
        callbacks=callbacks_phase2,
        verbose=1,
    )

    # Final evaluation on test set
    print("\n─── Final Evaluation on Test Set ───\n")
    test_results = model.evaluate(test_gen, verbose=1)
    test_metrics = dict(zip(model.metrics_names, test_results))
    print(f"Test Results: {test_metrics}")

    # Save class indices for inference
    class_indices = {v: k for k, v in train_gen.class_indices.items()}
    import json
    with open('models/class_indices.json', 'w') as f
        json.dump(class_indices, f, indent=2)

    print(f"\n✅ Model saved to: {output_path}")
    print(f"✅ Class indices saved to: models/class_indices.json")

    final_acc = max(history2.history.get('val_accuracy', [0]))
    print(f"🏆 Best validation accuracy: {final_acc:.4f} ({final_acc*100:.2f}%)")
    print(f"🏆 Test accuracy: {test_metrics.get('accuracy', 0):.4f} ({test_metrics.get('accuracy', 0)*100:.2f}%)")

    return model


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train AgroSense AI MobileNetV2 model')
    parser.add_argument('--data_dir',  default='ml/datasets/PlantVillage', help='Path to dataset root')
    parser.add_argument('--output',    default='models/leaf_disease_model.h5', help='Output model path')
    parser.add_argument('--epochs',    type=int, default=EPOCHS, help='Number of training epochs')
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    train(args.data_dir, args.output, args.epochs)
