"""Turn a PredictionRequest into the one-row DataFrame the trained pipeline expects.

The exported model is a full scikit-learn Pipeline (ColumnTransformer + regressor),
so no manual scaling / one-hot encoding is needed here -- we only have to build a
DataFrame with the exact column names used during training in the notebook:

    numeric_features     = ["carpet_area_sqft", "floor_num", "bathroom_num", "balcony_num"]
    categorical_features  = ["location_grouped", "Furnishing", "Transaction", "Ownership", "facing"]
"""
import json
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

UNKNOWN_LOCATION_LABEL = "Other"


@lru_cache(maxsize=1)
def get_known_locations() -> set[str]:
    """Load the list of locations seen during training (for grouping unknowns)."""
    path: Path = settings.locations_path
    if not path.exists():
        return set()
    with open(path) as f:
        return set(json.load(f))


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    """Build the single-row DataFrame consumed by ``model.predict``."""
    known_locations = get_known_locations()
    location_grouped = payload.location if payload.location in known_locations else UNKNOWN_LOCATION_LABEL

    row = {
        "carpet_area_sqft": payload.carpet_area_sqft,
        "floor_num": payload.floor_num,
        "bathroom_num": payload.bathroom,
        "balcony_num": payload.balcony,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Ownership": payload.ownership,
        "facing": payload.facing,
    }
    return pd.DataFrame([row])
