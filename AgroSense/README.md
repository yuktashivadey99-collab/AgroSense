# 🌱 AgroSense AI — Intelligent Crop Health Platform

A full-stack ML-powered crop disease detection system. Upload leaf and stem images to get instant disease classification, severity estimation, Color Deviation Index (CDI), and targeted treatment recommendations.

## ✨ Features

- **Multi-Organ Analysis**: Simultaneous leaf & stem image analysis
- **MobileNetV2 CNN**: State-of-the-art CNN fine-tuned on 50,000+ crop disease images
- **Color Deviation Index**: Proprietary CDI metric for plant stress quantification
- **Adaptive Fusion**: Weighted decision fusion of leaf, stem and CDI signals
- **8-Language Support**: Full UI localization in English, Hindi, Marathi, Telugu, Tamil, Kannada, Bengali, Spanish
- **PDF Reports**: Download detailed analysis reports as PDF
- **Crop-Specific Analysis**: Select supported crops for targeted diagnosis
- **Real-Time Weather**: Integrated weather data for disease risk assessment

---

## 🗂️ Project Structure

```
agrosense-ai/
├── frontend/              # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/               # Python FastAPI API
│   ├── app.py             # FastAPI entry point
│   ├── api/v1/
│   │   ├── analyze.py     # POST /api/analyze
│   │   └── history.py     # GET/DELETE /api/history
│   ├── models/
│   │   └── ml_model.py    # MobileNetV2 predictor + fusion engine
│   ├── utils/
│   │   ├── image_processing.py   # CDI, stem analysis, preprocessing
│   │   └── database.py           # MongoDB connection
│   ├── schemas.py         # Pydantic models
│   ├── config.py          # Settings
│   ├── logger.py          # Logging setup
│   ├── train_model.py     # Enhanced training script
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account (optional — works without it using in-memory storage)

---

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your MONGO_URI (optional)

# Start the server
python app.py
```

Backend runs at: `http://localhost:5000`

---

### 3. Model Setup (Optional)

The backend includes a statistical fallback predictor that works without a trained model. For production accuracy:

**Option A — Download pre-trained model:**
1. Download `leaf_disease_model.h5` (place in `backend/models/`)
2. The model auto-loads on backend startup

**Option B — Train your own model:**
```bash
cd backend

# Download PlantVillage dataset from Kaggle:
# https://www.kaggle.com/datasets/emmarex/plantdisease
# Extract to ml/datasets/PlantVillage/

python train_model.py --data_dir ml/datasets/PlantVillage --epochs 30
```

Training takes ~2-3 hours on GPU, ~8-12 hours on CPU. Google Colab (free GPU) is recommended.

---

## 🔌 API Reference

### `POST /api/analyze`
Analyze crop images for disease detection.

**Request:** `multipart/form-data`
| Field | Type | Required |
|-------|------|----------|
| `leaf_image` | File (JPG/PNG/WebP) | At least one |
| `stem_image` | File (JPG/PNG/WebP) | At least one |

**Response:**
```json
{
  "disease_name": "Tomato – Early blight",
  "classification": "Treatable",
  "confidence": 0.873,
  "health_score": 61.4,
  "severity_score": 51.8,
  "cdi_score": 0.34,
  "leaf_result": { "disease": "...", "confidence": 0.873, "is_healthy": false },
  "stem_result": { "condition": "Mild browning", "brown_ratio": 0.18, "score": 75 },
  "prevention": ["..."],
  "treatment": ["..."],
  "fertilizer": ["..."],
  "viability": "..."
}
```

### `GET /api/history`
Fetch all past diagnoses.

### `DELETE /api/history/<id>`
Delete a diagnosis record.

### `GET /api/health`
Health check endpoint.

---

## 🧠 System Architecture

```
User Upload (Leaf + Stem)
        │
        ▼
┌─────────────────────────────────┐
│     Image Processing Module      │
│  Resize → Normalize → HSV       │
└────────────┬────────────────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌──────────┐    ┌──────────┐
│  Leaf    │    │  Stem    │
│ Pipeline │    │ Pipeline │
│ (CNN)    │    │ (Color   │
│          │    │ Analysis)│
└────┬─────┘    └────┬─────┘
     │               │
     └──────┬─────────┘
            │
     ┌──────▼──────────┐
     │  CDI Calculator  │
     │ (Color Deviation │
     │      Index)      │
     └──────┬───────────┘
            │
     ┌──────▼──────────────────┐
     │  Adaptive Fusion Module  │
     │  Leaf(0.5)+Stem(0.3)    │
     │      +CDI(0.2)           │
     └──────┬───────────────────┘
            │
     ┌──────▼───────────────────┐
     │   Classification Engine   │
     │ Healthy/Preventive/       │
     │ Treatable/Critical/Remove │
     └──────┬───────────────────┘
            │
     ┌──────▼─────────────────┐
     │  Recommendation Engine  │
     │  Prevention + Treatment  │
     │  + Fertilizer + Viability│
     └────────────────────────┘
```

---

## 🎨 Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Framer Motion |
| **Backend** | Python 3.10, Flask 3, Flask-CORS |
| **ML** | TensorFlow 2.15, Keras, MobileNetV2 (Transfer Learning) |
| **Image Processing** | OpenCV, Pillow, NumPy |
| **Database** | MongoDB (PyMongo) |
| **Dev Tools** | VS Code, Jupyter Notebook, Git |

---

## 📊 ML Model Details

- **Architecture:** MobileNetV2 + Custom Classification Head
- **Input:** 224×224 RGB images
- **Output:** 38-class softmax (PlantVillage dataset classes)
- **Training:** 2-phase transfer learning (head → fine-tune top 50 layers)
- **Augmentation:** Rotation, flip, zoom, brightness, shift
- **Target Accuracy:** >95% on PlantVillage validation set

---

## 🏥 Health Classification Tiers

| Score | Classification | Action |
|-------|---------------|--------|
| 85-100 | 🟢 Healthy | Continue current care |
| 70-84 | 🔵 Preventive | Monitor + preventive spray |
| 45-69 | 🟡 Treatable | Apply targeted treatment |
| 20-44 | 🔴 Critical | Urgent intervention required |
| 0-19 | 🟣 Remove | Quarantine and remove plant |

---

## 📝 License

MIT License — Free for educational and commercial use.

---

**AgroSense AI** — Built with ❤️ for precision agriculture
