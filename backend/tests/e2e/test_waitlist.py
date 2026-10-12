import os
import random
from uuid import uuid4

import httpx
import pytest

E2E_BASE_URL = os.getenv(
    "E2E_BASE_URL",
    "http://127.0.0.1:8000",
)
WAITLIST_URL = f"{E2E_BASE_URL.rstrip('/')}/api/waitlist"


def unique_phone() -> str:
    # Ugandan mobile format (+25670XXXXXXX) with random trailing digits,
    # so each test gets its own number and never collides with earlier runs.
    return f"+25670{random.randint(0, 9_999_999):07d}"


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    async with httpx.AsyncClient(timeout=15.0) as http_client:
        yield http_client


@pytest.fixture
async def cleanup(client: httpx.AsyncClient):
    """Collects created entry IDs and deletes them after the test."""
    entry_ids: list[str] = []
    yield entry_ids

    for entry_id in entry_ids:
        # A 404 here just means the test already deleted it.
        await client.delete(f"{WAITLIST_URL}/{entry_id}")


@pytest.mark.anyio
async def test_waitlist_registration_and_retrieval(
    client: httpx.AsyncClient,
    cleanup: list[str],
):
    email = f"{uuid4().hex}@example.com"
    phone = unique_phone()

    # A visitor joins the waitlist.
    create_response = await client.post(
        f"{WAITLIST_URL}/",
        json={
            "email": email,
            "name": "E2E Test Person",
            "phone_e164": phone,
        },
    )

    assert create_response.status_code == 201

    created = create_response.json()
    entry_id = created["id"]
    cleanup.append(entry_id)

    assert created["email"] == email
    assert created["name"] == "E2E Test Person"
    assert created["phone_e164"] == phone

    # The entry can subsequently be retrieved by ID.
    get_response = await client.get(
        f"{WAITLIST_URL}/{entry_id}",
    )

    assert get_response.status_code == 200
    assert get_response.json()["id"] == entry_id
    assert get_response.json()["email"] == email

    # It can also be retrieved by email.
    email_response = await client.get(
        f"{WAITLIST_URL}/by-email",
        params={"email": email},
    )

    assert email_response.status_code == 200
    assert email_response.json()["id"] == entry_id


@pytest.mark.anyio
async def test_waitlist_update_and_phone_removal(
    client: httpx.AsyncClient,
    cleanup: list[str],
):
    email = f"{uuid4().hex}@example.com"
    phone = unique_phone()

    create_response = await client.post(
        f"{WAITLIST_URL}/",
        json={
            "email": email,
            "name": "Original Name",
            "phone_e164": phone,
        },
    )

    assert create_response.status_code == 201
    entry_id = create_response.json()["id"]
    cleanup.append(entry_id)

    # Update the name without changing the phone number.
    update_response = await client.patch(
        f"{WAITLIST_URL}/{entry_id}",
        json={"name": "Updated Name"},
    )

    assert update_response.status_code == 200

    updated = update_response.json()
    assert updated["name"] == "Updated Name"
    assert updated["phone_e164"] == phone

    # Explicit null must not clear the phone number.
    null_response = await client.patch(
        f"{WAITLIST_URL}/{entry_id}",
        json={"phone_e164": None},
    )

    assert null_response.status_code == 200
    assert null_response.json()["phone_e164"] == phone

    # Phone removal uses its dedicated endpoint.
    remove_response = await client.delete(
        f"{WAITLIST_URL}/{entry_id}/phone",
    )

    assert remove_response.status_code == 200

    removed = remove_response.json()
    assert removed["phone_e164"] is None
    assert removed["phone_country_code"] is None
    assert removed["phone_region"] is None
    assert removed["phone_national"] is None

    # The changes persist across separate HTTP requests.
    get_response = await client.get(
        f"{WAITLIST_URL}/{entry_id}",
    )

    assert get_response.status_code == 200
    assert get_response.json()["name"] == "Updated Name"
    assert get_response.json()["phone_e164"] is None


@pytest.mark.anyio
async def test_waitlist_entry_deletion(
    client: httpx.AsyncClient,
):
    email = f"{uuid4().hex}@example.com"

    create_response = await client.post(
        f"{WAITLIST_URL}/",
        json={"email": email},
    )

    assert create_response.status_code == 201
    entry_id = create_response.json()["id"]

    delete_response = await client.delete(
        f"{WAITLIST_URL}/{entry_id}",
    )

    assert delete_response.status_code == 204

    # A subsequent request confirms the entry is gone.
    get_response = await client.get(
        f"{WAITLIST_URL}/{entry_id}",
    )

    assert get_response.status_code == 404


@pytest.mark.anyio
async def test_waitlist_rejects_invalid_registration(
    client: httpx.AsyncClient,
):
    response = await client.post(
        f"{WAITLIST_URL}/",
        json={
            "email": "not-an-email",
            "phone_e164": "+123",
        },
    )

    assert response.status_code == 422
