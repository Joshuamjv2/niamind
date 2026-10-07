import pytest


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["services"]["database"] == "ok"
    assert data["services"]["redis"] == "ok"
