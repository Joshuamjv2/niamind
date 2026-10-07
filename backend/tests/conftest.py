import asyncio

import asyncpg
import pytest
import pytest_asyncio
import redis
from httpx import ASGITransport, AsyncClient
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from api.main import app
from constants import settings
from db.base import Base
from db.session import get_session
from redis_client.client import client as app_redis_client

# ---------------------------------------------------------------------------
# Docker Compose
# ---------------------------------------------------------------------------


@pytest.fixture(scope="session")
def docker_compose_file(pytestconfig):
    return str(pytestconfig.rootdir / "docker-compose.test.yml")


@pytest.fixture(scope="session", autouse=True)
def test_services(docker_services):
    """
    Start the test PostgreSQL and Redis containers and wait until they
    are ready to accept connections.
    """

    async def check_postgres():
        url = settings.TEST_DB_URL.replace(
            "postgresql+asyncpg://",
            "postgresql://",
        )
        try:
            connection = await asyncpg.connect(url)
            await connection.close()
            return True
        except (OSError, asyncpg.PostgresError):
            return False

    def postgres_is_ready():
        return asyncio.run(check_postgres())

    docker_services.wait_until_responsive(
        timeout=60.0,
        pause=1.0,
        check=postgres_is_ready,
    )

    def redis_is_ready():
        client = redis.Redis.from_url(
            settings.TEST_REDIS_URL,
            socket_connect_timeout=2,
            socket_timeout=2,
        )

        try:
            return client.ping()
        except redis.RedisError:
            return False
        finally:
            client.close()

    docker_services.wait_until_responsive(
        timeout=60.0,
        pause=1.0,
        check=redis_is_ready,
    )

    yield


# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------


@pytest_asyncio.fixture(scope="session")
async def async_engine(test_services):
    """
    Create the SQLAlchemy async engine for the test database.
    """

    engine = create_async_engine(
        settings.TEST_DB_URL,
        pool_pre_ping=True,
        poolclass=NullPool,
    )

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture
async def db(async_engine):
    """
    Provide an isolated database transaction for each test.

    All changes made during the test are rolled back afterward.
    """

    async with async_engine.connect() as connection:
        transaction = await connection.begin()

        session = AsyncSession(
            bind=connection,
            expire_on_commit=False,
            join_transaction_mode="create_savepoint",
        )

        try:
            yield session
        finally:
            await session.close()

            if transaction.is_active:
                await transaction.rollback()


# ---------------------------------------------------------------------------
# Redis
# ---------------------------------------------------------------------------


@pytest_asyncio.fixture(autouse=True)
async def redis_client(test_services):
    """
    Redirect the application's Redis client to the test Redis instance.

    Redis is cleared before and after every test.
    """

    test_client = app_redis_client.__class__.from_url(
        settings.TEST_REDIS_URL,
        decode_responses=False,
    )

    original_pool = app_redis_client.connection_pool
    app_redis_client.connection_pool = test_client.connection_pool

    client = Redis.from_url(
        settings.TEST_REDIS_URL,
        decode_responses=True,
    )

    try:
        await client.ping()
        await client.flushdb()

        yield client
    finally:
        await client.flushdb()
        await client.aclose()

        app_redis_client.connection_pool = original_pool
        await test_client.aclose()


# ---------------------------------------------------------------------------
# FastAPI client
# ---------------------------------------------------------------------------


@pytest_asyncio.fixture
async def client(db):
    """
    Provide an async HTTP client using the test database session.
    """

    async def override_get_session():
        yield db

    app.dependency_overrides[get_session] = override_get_session

    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://localhost",
        ) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_session, None)
