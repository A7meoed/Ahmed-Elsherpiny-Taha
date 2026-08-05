"""Request and response models for the /predict endpoint.

These fields mirror exactly the feature set the model was trained on in
notebooks/house_price_model.ipynb (numeric_features + categorical_features).
"""
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    location: str = Field(..., description="Locality / area name, e.g. 'Whitefield'")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., description="Floor number (0 = Ground, -1 = Basement)")
    bathroom: int = Field(..., ge=0, description="Number of bathrooms")
    balcony: int = Field(..., ge=0, description="Number of balconies")
    furnishing: str = Field(..., description="'Furnished' | 'Semi-Furnished' | 'Unfurnished'")
    transaction: str = Field(..., description="'New Property' | 'Resale'")
    ownership: str = Field(..., description="e.g. 'Freehold', 'Leasehold', 'Co-operative Society'")
    facing: str = Field(..., description="Direction the property faces, e.g. 'East'")

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float


class HealthResponse(BaseModel):
    status: str = "ok"
