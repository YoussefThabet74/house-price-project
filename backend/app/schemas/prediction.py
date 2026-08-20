from pydantic import BaseModel

class PredictionRequest(BaseModel):
    location: str
    carpet_area_sqft: float
    bathroom: int
    balcony: int
    floor_num: int
    furnishing: str     # "Furnished" | "Semi-Furnished" | "Unfurnished"
    transaction: str    # "New Property" | "Resale"
    ownership: str
    facing: str

class PredictionResponse(BaseModel):
    predicted_price: float