"""
Configuration management for AgroSense AI Backend
"""

from typing import Optional

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App settings
    app_name: str = "AgroSense AI Backend"
    version: str = "1.0.0"
    debug: bool = False

    # Server settings
    host: str = "0.0.0.0"
    port: int = 5000

    # Database
    mongo_uri: Optional[str] = None
    database_name: str = "agrosense"

    # ML Model
    model_path: str = "models/leaf_disease_model.h5"

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    # Security
    secret_key: str = "agrosense-dev-secret-2025"
    jwt_secret: str = "agrosense-jwt-secret-2025"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        protected_namespaces=("settings_",),
    )

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, bool):
            return value
        if value is None:
            return False

        normalized = str(value).strip().lower()
        if normalized in {"1", "true", "yes", "on", "debug", "development"}:
            return True
        if normalized in {"0", "false", "no", "off", "release", "production", ""}:
            return False
        return False


settings = Settings()
