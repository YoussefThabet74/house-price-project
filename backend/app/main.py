from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import joblib
from pathlib import Path

from app.api.routes.prediction import router as prediction_router
from app.core.config import settings

# Resolve base directory to locate the models folder inside backend
BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE_DIR / "models" / "model.pkl"

# Define lifespan to load the model once at startup (As required by PDF)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the machine learning model when the server starts
    app.state.model = joblib.load(MODEL_PATH)
    yield
    # Clean up memory on shutdown
    app.state.model = None

# Initialize FastAPI application with the lifespan context
app = FastAPI(title="House Price Prediction API", lifespan=lifespan)

# Configure CORS middleware using settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(prediction_router)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}