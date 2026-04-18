"""
Improved AgroSense training pipeline.

This trainer avoids test leakage, writes repeatable split artifacts, and saves
per-class metrics so model quality can be judged honestly before deployment.
"""

from __future__ import annotations

import argparse
import json
import math
import random
from collections import Counter
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.callbacks import CSVLogger, EarlyStopping, ModelCheckpoint, ReduceLROnPlateau


IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30
LEARNING_RATE = 1e-4
TRAIN_RATIO = 0.7
VAL_RATIO = 0.15
TEST_RATIO = 0.15
SEED = 42
AUTOTUNE = tf.data.AUTOTUNE
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def save_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)


def discover_dataset(data_dir: str, target_crop: str = None) -> tuple[list[str], list[str], list[str]]:
    root = Path(data_dir)
    if not root.exists():
        raise FileNotFoundError(f"Dataset directory not found: {root}")

    class_dirs = sorted(path for path in root.iterdir() if path.is_dir())
    if not class_dirs:
        raise ValueError(f"No class directories found in: {root}")

    paths: list[str] = []
    labels: list[str] = []
    class_names: list[str] = []

    for class_dir in class_dirs:
        if target_crop and not class_dir.name.lower().startswith(target_crop.lower()):
            continue

        images = sorted(
            path for path in class_dir.rglob("*")
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
        )
        if not images:
            continue

        class_names.append(class_dir.name)
        for image_path in images:
            paths.append(str(image_path))
            labels.append(class_dir.name)

    if not paths:
        raise ValueError(f"No images found in: {root}")

    return paths, labels, class_names


def stratified_split(
    paths: list[str],
    labels: list[str],
    class_names: list[str],
    train_ratio: float,
    val_ratio: float,
    seed: int,
) -> dict[str, tuple[list[str], list[int]]]:
    if not math.isclose(train_ratio + val_ratio + TEST_RATIO, 1.0, abs_tol=1e-6):
        raise ValueError("Train/validation/test ratios must add up to 1.0")

    rng = random.Random(seed)
    class_to_index = {name: index for index, name in enumerate(class_names)}
    grouped: dict[str, list[str]] = {name: [] for name in class_names}

    for path, label in zip(paths, labels):
        grouped[label].append(path)

    splits = {
        "train": ([], []),
        "val": ([], []),
        "test": ([], []),
    }

    for class_name, class_paths in grouped.items():
        shuffled = class_paths[:]
        rng.shuffle(shuffled)
        count = len(shuffled)

        train_count = max(1, int(count * train_ratio))
        val_count = max(1, int(count * val_ratio))
        test_count = count - train_count - val_count

        if test_count <= 0:
            test_count = 1
            if train_count > val_count:
                train_count -= 1
            else:
                val_count -= 1

        split_paths = {
            "train": shuffled[:train_count],
            "val": shuffled[train_count:train_count + val_count],
            "test": shuffled[train_count + val_count:],
        }

        class_index = class_to_index[class_name]
        for split_name, selected_paths in split_paths.items():
            splits[split_name][0].extend(selected_paths)
            splits[split_name][1].extend([class_index] * len(selected_paths))

    return splits


def decode_image(path: tf.Tensor, label: tf.Tensor) -> tuple[tf.Tensor, tf.Tensor]:
    image_bytes = tf.io.read_file(path)
    image = tf.io.decode_image(image_bytes, channels=3, expand_animations=False)
    image = tf.image.resize(image, IMG_SIZE)
    image = tf.cast(image, tf.float32)
    image = preprocess_input(image)
    return image, label


def build_dataset(paths: list[str], labels: list[int], training: bool) -> tf.data.Dataset:
    dataset = tf.data.Dataset.from_tensor_slices((paths, labels))
    if training:
        dataset = dataset.shuffle(len(paths), seed=SEED, reshuffle_each_iteration=True)
    dataset = dataset.map(decode_image, num_parallel_calls=AUTOTUNE)
    dataset = dataset.batch(BATCH_SIZE)
    dataset = dataset.prefetch(AUTOTUNE)
    return dataset


def build_model(num_classes: int) -> tuple[keras.Model, keras.Model]:
    base_model = MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = False

    augmentation = keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.08),
            layers.RandomZoom(0.12),
            layers.RandomContrast(0.15),
            layers.RandomBrightness(0.15),
        ],
        name="augmentation",
    )

    inputs = keras.Input(shape=(*IMG_SIZE, 3))
    x = augmentation(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.35)(x)
    x = layers.Dense(256, activation="relu", kernel_regularizer=keras.regularizers.l2(1e-4))(x)
    x = layers.Dropout(0.25)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    model = keras.Model(inputs, outputs, name="AgroSense_MobileNetV2_v3")
    return model, base_model


def compile_model(model: keras.Model, learning_rate: float) -> None:
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate),
        loss="sparse_categorical_crossentropy",
        metrics=[
            "accuracy",
            keras.metrics.SparseTopKCategoricalAccuracy(k=3, name="top3_acc"),
        ],
    )


def compute_class_weights(labels: list[int]) -> dict[int, float]:
    counts = Counter(labels)
    total = sum(counts.values())
    num_classes = len(counts)
    return {class_index: total / (num_classes * count) for class_index, count in counts.items()}


def evaluate_and_export(
    model: keras.Model,
    dataset: tf.data.Dataset,
    class_names: list[str],
    output_dir: Path,
) -> dict[str, float]:
    output_dir.mkdir(parents=True, exist_ok=True)

    metrics = dict(zip(model.metrics_names, model.evaluate(dataset, verbose=0)))
    predictions = model.predict(dataset, verbose=0)
    predicted_labels = np.argmax(predictions, axis=1)
    true_labels = np.concatenate([batch_labels.numpy() for _, batch_labels in dataset], axis=0)

    confusion = tf.math.confusion_matrix(
        true_labels,
        predicted_labels,
        num_classes=len(class_names),
    ).numpy()
    np.savetxt(output_dir / "confusion_matrix.csv", confusion.astype(int), fmt="%d", delimiter=",")

    per_class = {}
    for index, class_name in enumerate(class_names):
        tp = float(confusion[index, index])
        fp = float(confusion[:, index].sum() - tp)
        fn = float(confusion[index, :].sum() - tp)
        support = int(confusion[index, :].sum())
        precision = tp / (tp + fp) if (tp + fp) else 0.0
        recall = tp / (tp + fn) if (tp + fn) else 0.0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) else 0.0
        per_class[class_name] = {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(f1, 4),
            "support": support,
        }

    save_json(output_dir / "metrics.json", {
        "overall": {key: round(float(value), 4) for key, value in metrics.items()},
        "per_class": per_class,
    })
    return metrics


def train(data_dir: str, output_path: str, epochs: int, seed: int, target_crop: str = None) -> keras.Model:
    tf.keras.utils.set_random_seed(seed)

    print("\n============================================================")
    print(f"AgroSense AI training (Crop: {target_crop or 'All'})")
    print("============================================================\n")

    paths, labels, class_names = discover_dataset(data_dir, target_crop)
    splits = stratified_split(paths, labels, class_names, TRAIN_RATIO, VAL_RATIO, seed)

    train_paths, train_labels = splits["train"]
    val_paths, val_labels = splits["val"]
    test_paths, test_labels = splits["test"]

    print(f"Classes found: {len(class_names)}")
    print(f"Training samples: {len(train_paths)}")
    print(f"Validation samples: {len(val_paths)}")
    print(f"Test samples: {len(test_paths)}")

    train_ds = build_dataset(train_paths, train_labels, training=True)
    val_ds = build_dataset(val_paths, val_labels, training=False)
    test_ds = build_dataset(test_paths, test_labels, training=False)

    model, base_model = build_model(len(class_names))
    compile_model(model, LEARNING_RATE)

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    artifacts_dir = output.parent / "training_artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    crop_prefix = target_crop if target_crop else "all"
    indices_filename = f"{crop_prefix}_class_indices.json"
    save_json(output.parent / indices_filename, {str(index): name for index, name in enumerate(class_names)})
    save_json(artifacts_dir / "dataset_split.json", {
        "train_count": len(train_paths),
        "val_count": len(val_paths),
        "test_count": len(test_paths),
        "class_names": class_names,
    })

    callbacks = [
        ModelCheckpoint(str(output), monitor="val_accuracy", save_best_only=True, verbose=1),
        EarlyStopping(monitor="val_accuracy", patience=6, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor="val_loss", factor=0.4, patience=3, min_lr=1e-7, verbose=1),
        CSVLogger(str(artifacts_dir / "training_log.csv")),
    ]

    class_weights = compute_class_weights(train_labels)

    print("\nPhase 1: train classifier head\n")
    phase1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=min(epochs, 12),
        callbacks=callbacks,
        class_weight=class_weights,
        verbose=1,
    )

    print("\nPhase 2: fine-tune upper backbone layers\n")
    base_model.trainable = True
    for layer in base_model.layers[:-60]:
        layer.trainable = False

    compile_model(model, LEARNING_RATE / 10)
    phase2 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        initial_epoch=len(phase1.history["loss"]),
        callbacks=callbacks,
        class_weight=class_weights,
        verbose=1,
    )

    history = {}
    for source in (phase1.history, phase2.history):
        for key, values in source.items():
            history.setdefault(key, []).extend([float(value) for value in values])
    save_json(artifacts_dir / "history.json", history)

    val_metrics = evaluate_and_export(model, val_ds, class_names, artifacts_dir / "validation")
    test_metrics = evaluate_and_export(model, test_ds, class_names, artifacts_dir / "test")

    print("\nValidation metrics:", {key: round(float(value), 4) for key, value in val_metrics.items()})
    print("Test metrics:", {key: round(float(value), 4) for key, value in test_metrics.items()})
    print(f"\nModel saved to: {output}")
    print(f"Class map saved to: {output.parent / indices_filename}")
    print(f"Artifacts saved to: {artifacts_dir}")

    return model


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train AgroSense AI crop disease classifier")
    parser.add_argument("--data_dir", default="../ml/datasets/PlantVillage", help="Path to dataset root")
    parser.add_argument("--output", default="models/leaf_disease_model.h5", help="Output model path")
    parser.add_argument("--epochs", type=int, default=EPOCHS, help="Total training epochs")
    parser.add_argument("--seed", type=int, default=SEED, help="Random seed")
    parser.add_argument("--crop", type=str, default=None, help="Target crop to train a specialized model for")
    args = parser.parse_args()

    train(args.data_dir, args.output, args.epochs, args.seed, args.crop)
