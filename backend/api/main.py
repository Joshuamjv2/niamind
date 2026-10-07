from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from constants import settings
from db.session import get_session
from redis_client.client import client as redis_client

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
)


# ============================================================
# Middleware
# ============================================================

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[host.strip() for host in settings.ALLOWED_HOSTS.split(",") if host.strip()],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Health
# ============================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
)


# ============================================================
# Middleware
# ============================================================

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[host.strip() for host in settings.ALLOWED_HOSTS.split(",") if host.strip()],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Health
# ============================================================


@app.get("/")
async def health_check(
    session: AsyncSession = Depends(get_session),
):
    health = {
        "status": "ok",
        "services": {
            "database": "unknown",
            "redis": "unknown",
        },
    }

    try:
        await session.execute(text("SELECT 1"))
        health["services"]["database"] = "ok"
    except Exception:
        health["services"]["database"] = "error"
        health["status"] = "degraded"

    try:
        await redis_client.ping()
        health["services"]["redis"] = "ok"
    except Exception:
        health["services"]["redis"] = "error"
        health["status"] = "degraded"

    return health
