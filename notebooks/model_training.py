from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import json
import pandas as pd

# 1. Initialize the FastAPI application
app = FastAPI(title="House Price Prediction API")

# 2. Load the trained machine learning model and valid locations
model = joblib.load('model.pkl')
with open('locations.json', 'r', encoding='utf-8') as f:
    locations_dict = json.load(f)
    valid_locations = locations_dict['locations']

# 3. Define the expected input data structure
class HouseInfo(BaseModel):
    location_clean: str
    Area_sqft: float
    Bathroom: float
    Balcony: float
    Floor_Num: float = 1.0

# 4. Create the prediction endpoint
@app.post("/predict")
def predict_price(house: HouseInfo):
    # Validate location or default to 'other'
    loc = house.location_clean if house.location_clean in valid_locations else 'other'

    # Prepare data dictionary
    input_data = {
        'location_clean': loc,
        'Area_sqft': house.Area_sqft,
        'Bathroom': house.Bathroom,
        'Balcony': house.Balcony,
        'Floor_Num': house.Floor_Num
    }
    input_df = pd.DataFrame([input_data])

    # Align input features with model expectations
    expected_features = model.feature_names_in_ if hasattr(model, 'feature_names_in_') else input_df.columns
    for col in expected_features:
        if col not in input_df.columns:
            input_df[col] = 0.0

    input_df = input_df[expected_features]
    predicted_price = model.predict(input_df)[0]

    return {"predicted_price": round(predicted_price, 2), "currency": "Rupees"}

# 5. Root endpoint for health check
@app.get("/")
def read_root():
    return {"message": "Welcome to the API! Go to /docs to test it."}
