# AgroSense AI Backend

A FastAPI-based backend service for AI-powered plant disease detection and analysis.

## Features

- **FastAPI Framework**: Modern, async Python web framework with automatic OpenAPI docs
- **AI Disease Detection**: TensorFlow-based ML model for plant disease classification
- **Image Processing**: Advanced image analysis with CDI (Color Deviation Index) calculation
- **Modular Architecture**: Clean separation of concerns with dependency injection
- **Database Support**: MongoDB with in-memory fallback
- **API Versioning**: Versioned API endpoints (v1)
- **Comprehensive Logging**: Structured logging with JSON output
- **Health Monitoring**: Built-in health checks and metrics
- **Docker Support**: Containerized deployment with Docker Compose

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd d:\agrosense-premium\backend

# Start services
docker-compose up --build
```

The API will be available at `http://localhost:8000`

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables (optional)
export MONGO_URI="mongodb://localhost:27017"
export DEBUG=true

# Run the application
python app.py
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Analysis (v1)
- `POST /api/v1/analyze` - Analyze plant images for diseases
  - Accepts `leaf_image` and/or `stem_image` as multipart form data
  - Returns comprehensive disease analysis

### History (v1)
- `GET /api/v1/history` - Get prediction history
- `DELETE /api/v1/history/{record_id}` - Delete a specific record
- `GET /api/v1/history/stats` - Get aggregated statistics

## Configuration

Configure the application using environment variables or `.env` file:

```env
# Application
DEBUG=false
HOST=0.0.0.0
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=agrosense

# ML Model
MODEL_PATH=models/leaf_disease_model.h5

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Security
SECRET_KEY=your-secret-key-here
```

## Project Structure

```
backend/
├── api/
│   └── v1/
│       ├── analyze.py      # Analysis endpoints
│       └── history.py      # History management
├── models/
│   └── ml_model.py         # ML model utilities
├── utils/
│   ├── database.py         # Database connection
│   └── image_processing.py # Image processing functions
├── config.py               # Application configuration
├── logger.py               # Logging setup
├── dependencies.py         # FastAPI dependencies
├── schemas.py              # Pydantic models
├── app.py                  # Main FastAPI application
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker image
├── docker-compose.yml      # Docker Compose setup
└── README.md              # This file
```

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest
```

### Code Quality

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

## Deployment

### Production with Gunicorn

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Production

```bash
# Build image
docker build -t agrosense-backend .

# Run container
docker run -p 8000:8000 -e MONGO_URI="your-mongo-uri" agrosense-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license here]

## Support

For support, please [add contact information or issue tracker]