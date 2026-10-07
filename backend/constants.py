from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── App ────────────────────────────────────────────────────
    APP_NAME: str
    APP_ENV: str = "development"
    DEBUG: bool = Field(default=True)
    SECRET_KEY: str
    ALLOWED_HOSTS: str
    API_VERSION: str
    CORS_ORIGINS: str

    # ── Database ───────────────────────────────────────────────
    DB_URL: str
    TEST_DB_URL: str

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    # ── Redis ──────────────────────────────────────────────────
    REDIS_URL: str
    TEST_REDIS_URL: str

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: Optional[str] = Field(default=None)

    REDIS_CACHE_DB: int
    REDIS_PUBSUB_DB: int
    REDIS_CELERY_DB: int
    REDIS_CELERY_RESULTS_DB: int
    REDIS_TEST_DB: int

    # ── Celery ─────────────────────────────────────────────────
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    CELERY_TASK_SERIALIZER: str
    CELERY_RESULT_SERIALIZER: str
    CELERY_TIMEZONE: str

    # ── Auth ───────────────────────────────────────────────────
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    ALGORITHM: str

    # ── Email ──────────────────────────────────────────────────
    EMAIL_HOST: Optional[str] = Field(default="")
    EMAIL_PORT: int = Field(default=587)
    EMAIL_USERNAME: Optional[str] = Field(default="")
    EMAIL_PASSWORD: Optional[str] = Field(default="")
    EMAIL_FROM: str
    EMAIL_TLS: bool = Field(default=True)

    # ── Kafka ──────────────────────────────────────────────────
    KAFKA_BOOTSTRAP_SERVERS: Optional[str] = Field(default="localhost:9092")
    KAFKA_ENABLED: bool = Field(default=False)

    # ── Monitoring ─────────────────────────────────────────────
    FLOWER_PORT: int = Field(default=5555)
    SENTRY_DSN: Optional[str] = Field(default="")

    # ── Pydantic Settings ─────────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
