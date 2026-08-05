"""Load the trained pipeline once and run predictions.

The notebook trains on the log-transformed target (``np.log1p(price)``), so a
prediction must be inverted with ``np.expm1`` before being returned to the client.
"""
import logging

import joblib
import numpy as np
import pandas as pd

from app.core.config import settings

logger = logging.getLogger(__name__)


class ModelService:
    """Thin wrapper around the pickled scikit-learn Pipeline."""

    def __init__(self) -> None:
        self._model = None

    def load(self) -> None:
        if not settings.model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at {settings.model_path}. "
                "Run the notebook (Phase 2) and copy house_price.pkl into backend/models/."
            )
        self._model = joblib.load(settings.model_path)
        logger.info("Model loaded from %s", settings.model_path)

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    def predict(self, X: pd.DataFrame) -> float:
        if self._model is None:
            raise RuntimeError("Model is not loaded. Call load() at application startup.")
        pred_log = self._model.predict(X)
        pred_price = np.expm1(pred_log)[0]
        return float(pred_price)


# Singleton instance shared across requests, populated at app startup (see main.py lifespan).
model_service = ModelService()
