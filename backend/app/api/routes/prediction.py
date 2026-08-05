"""GET /health and POST /predict routes."""
import logging

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services.inference import model_service
from app.services.preprocessing import request_to_dataframe

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Liveness/readiness check. Also reports whether the model is loaded."""
    if not model_service.is_loaded:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    return HealthResponse(status="ok")


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    """Predict the price of a property from its features."""
    try:
        X = request_to_dataframe(payload)
        predicted_price = model_service.predict(X)
    except Exception as exc:  # noqa: BLE001 - surfaced as a clean 500 for the client
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    return PredictionResponse(predicted_price=round(predicted_price, 2))
