from functools import lru_cache
from typing import List, Union

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_prefix: str = "/api/v1"
    app_name: str = "SkillGig Backend"
    secret_key: str = Field(default="change-me-super-secret-key")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours
    refresh_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    database_url: str = Field(default="sqlite:///./data/app.db")
    
    # CORS origins - ЖАҢАРТЫЛДЫ! 🔥
    cors_origins: Union[List[str], str] = Field(
        default=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://localhost:4174",
            "https://skillgigitplatform.vercel.app",  # ⭐ Production URL қосылды!
        ]
    )
    # Optional regex for additional allowed origins (useful for Vercel preview URLs)
    # Example: ^https://.*\\.vercel\\.app$
    cors_origin_regex: str | None = Field(default=None)
    environment: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="APP_",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def cors_origin_list(self) -> List[str]:
        origins = self.cors_origins
        if isinstance(origins, str):
            return [origin.strip() for origin in origins.split(",") if origin.strip()]
        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()