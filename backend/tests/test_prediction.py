import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict_happy_path():
    valid_payload = {
        "location": "Baner",
        "carpet_area_sqft": 1200.0,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East"
    }
    response = client.post("/predict", json=valid_payload)
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_predict_invalid_input():
    invalid_payload = {
        "location": "Baner",
        "carpet_area_sqft": "invalid_string", 
        "floor_num": 3
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422