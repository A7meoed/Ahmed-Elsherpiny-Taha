"""Application settings, loaded from environment variables / .env file."""
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Central configuration for the House Price Prediction API."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "House Price Prediction API"
    model_path: Path = BASE_DIR / "models" / "house_price.pkl"
    locations_path: Path = BASE_DIR / "models" / "locations.json"

    # Comma-separated list of allowed CORS origins.
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
