"""Tests for the /health and /predict endpoints.

Run with: pytest
Requires backend/models/house_price.pkl to exist (produced by the notebook).
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app

VALID_PAYLOAD = {
    "location": "Whitefield",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 1,
    "furnishing": "Semi-Furnished",
    "transaction": "Resale",
    "ownership": "Freehold",
    "facing": "East",
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path(client):
    response = client.post("/predict", json=VALID_PAYLOAD)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], float)
    assert body["predicted_price"] > 0


def test_predict_invalid_input_returns_422(client):
    invalid_payload = dict(VALID_PAYLOAD)
    invalid_payload["carpet_area_sqft"] = -50  # must be > 0
    del invalid_payload["furnishing"]  # required field missing

    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422
