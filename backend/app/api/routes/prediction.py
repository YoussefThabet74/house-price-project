from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import json
import pandas as pd
from pathlib import Path

router = APIRouter()

# Resolve base directory to correctly locate the models folder
BASE_DIR = Path(__file__).resolve().parents[3]

# Load model globally so it loads only once at startup
MODEL_PATH = BASE_DIR / "models" / "model.pkl"
model = joblib.load(MODEL_PATH)

# Load valid locations for input validation
LOCATIONS_PATH = BASE_DIR / "models" / "locations.json"

with open(LOCATIONS_PATH, "r", encoding="utf-8") as f:
    locations_dict = json.load(f)

valid_locations = locations_dict["locations"]


# Define the request schema matching the 9 features used in training
class PredictionRequest(BaseModel):
    location: str
    carpet_area_sqft: float
    bathroom: int
    balcony: int
    floor_num: int
    furnishing: str = "Semi-Furnished"
    transaction: str = "Resale"
    ownership: str = "Freehold"
    facing: str = "North"


# Define the API response schema
class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str = "₹"


@router.post("/predict", response_model=PredictionResponse)
def predict(request_data: PredictionRequest):

    # Validate location: default to 'other' if the location is unrecognized
    loc = (
        request_data.location
        if request_data.location in valid_locations
        else "other"
    )

    # Prepare data dictionary exactly as the trained model expects
    input_data = {
        "location": loc,
        "carpet_area_sqft": request_data.carpet_area_sqft,
        "floor_num": request_data.floor_num,
        "bathroom": request_data.bathroom,
        "balcony": request_data.balcony,
        "furnishing": request_data.furnishing,
        "transaction": request_data.transaction,
        "ownership": request_data.ownership,
        "facing": request_data.facing
    }

    # Convert the single dictionary record into a pandas DataFrame
    input_df = pd.DataFrame([input_data])

    # Align input features with the exact feature order used by the model
    if hasattr(model, "feature_names_in_"):
        expected_features = model.feature_names_in_

        for col in expected_features:
            if col not in input_df.columns:
                input_df[col] = 0.0

        input_df = input_df[expected_features]

    # Generate prediction using the loaded machine learning pipeline
    predicted_price = model.predict(input_df)[0]

    return {
        "predicted_price": round(float(predicted_price), 2),
        "currency": "₹"
    }