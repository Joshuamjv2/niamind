import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from constants import settings


@pytest.mark.asyncio
async def test_sqlalchemy_async_connection(test_services):
    engine = create_async_engine(
        settings.TEST_DB_URL,
        pool_pre_ping=True,
    )

    try:
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            assert result.scalar() == 1
    finally:
        await engine.dispose()
