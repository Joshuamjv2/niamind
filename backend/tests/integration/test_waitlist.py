import pytest
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.waitlist.models import WaitlistEntry

WAITLIST_URL = "/api/waitlist/"


async def create_entry(
    client: AsyncClient,
    email: str = "person@example.com",
    name: str | None = "Test Person",
    phone_e164: str | None = None,
):
    payload = {"email": email}

    if name is not None:
        payload["name"] = name

    if phone_e164 is not None:
        payload["phone_e164"] = phone_e164

    return await client.post(WAITLIST_URL, json=payload)


# ------------------------------------------------------------------
# CREATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_join_waitlist(client: AsyncClient, db: AsyncSession):
    response = await client.post(
        WAITLIST_URL,
        json={
            "email": "person@example.com",
            "name": "Test Person",
            "phone_e164": "+256701234567",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["email"] == "person@example.com"
    assert data["name"] == "Test Person"
    assert data["phone_e164"] == "+256701234567"
    assert data["phone_country_code"] == "+256"
    assert data["phone_region"] == "UG"
    assert data["phone_national"] == "701234567"
    assert data["id"] is not None
    assert data["created_at"] is not None

    result = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == "person@example.com"))
    entry = result.scalar_one_or_none()

    assert entry is not None
    assert entry.name == "Test Person"


@pytest.mark.asyncio
async def test_join_waitlist_normalizes_email(
    client: AsyncClient,
    db: AsyncSession,
):
    response = await client.post(
        WAITLIST_URL,
        json={"email": "  Person@Example.com  "},
    )

    assert response.status_code == 201
    assert response.json()["email"] == "person@example.com"

    result = await db.execute(select(func.count()).select_from(WaitlistEntry))
    assert result.scalar_one() == 1


@pytest.mark.asyncio
async def test_join_waitlist_without_optional_fields(
    client: AsyncClient,
):
    response = await client.post(
        WAITLIST_URL,
        json={"email": "minimal@example.com"},
    )

    assert response.status_code == 201

    data = response.json()
    assert data["email"] == "minimal@example.com"
    assert data["name"] is None
    assert data["phone_e164"] is None
    assert data["phone_country_code"] is None
    assert data["phone_region"] is None
    assert data["phone_national"] is None


@pytest.mark.asyncio
async def test_join_waitlist_rejects_invalid_email(
    client: AsyncClient,
):
    response = await client.post(
        WAITLIST_URL,
        json={"email": "not-an-email"},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_join_waitlist_rejects_invalid_phone(
    client: AsyncClient,
):
    response = await client.post(
        WAITLIST_URL,
        json={
            "email": "invalid-phone@example.com",
            "phone_e164": "+123",
        },
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_join_waitlist_duplicate_email_is_idempotent(
    client: AsyncClient,
    db: AsyncSession,
):
    first_response = await client.post(
        WAITLIST_URL,
        json={
            "email": "duplicate@example.com",
            "name": "Original Name",
        },
    )

    second_response = await client.post(
        WAITLIST_URL,
        json={
            "email": "DUPLICATE@example.com",
            "name": "Different Name",
        },
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 201

    first_entry = first_response.json()
    second_entry = second_response.json()

    assert first_entry["id"] == second_entry["id"]
    assert second_entry["name"] == "Original Name"

    result = await db.execute(select(func.count()).select_from(WaitlistEntry))
    assert result.scalar_one() == 1


@pytest.mark.asyncio
async def test_join_waitlist_rejects_duplicate_phone(
    client: AsyncClient,
):
    first_response = await create_entry(
        client,
        email="first@example.com",
        phone_e164="+256701234567",
    )

    second_response = await create_entry(
        client,
        email="second@example.com",
        phone_e164="+256701234567",
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409


# ------------------------------------------------------------------
# RETRIEVE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_waitlist_entry_by_id(client: AsyncClient):
    created = await create_entry(client)
    entry_id = created.json()["id"]

    response = await client.get(f"{WAITLIST_URL}{entry_id}")

    assert response.status_code == 200
    assert response.json()["id"] == entry_id
    assert response.json()["email"] == "person@example.com"


@pytest.mark.asyncio
async def test_get_waitlist_entry_not_found(client: AsyncClient):
    response = await client.get(f"{WAITLIST_URL}00000000-0000-0000-0000-000000000000")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_waitlist_entry_rejects_invalid_uuid(
    client: AsyncClient,
):
    response = await client.get(f"{WAITLIST_URL}not-a-uuid")

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_waitlist_entry_by_email(client: AsyncClient):
    await create_entry(
        client,
        email="lookup@example.com",
    )

    response = await client.get(
        f"{WAITLIST_URL}by-email",
        params={"email": "LOOKUP@example.com"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "lookup@example.com"


@pytest.mark.asyncio
async def test_get_waitlist_entry_by_email_not_found(
    client: AsyncClient,
):
    response = await client.get(
        f"{WAITLIST_URL}by-email",
        params={"email": "missing@example.com"},
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_waitlist_entries(client: AsyncClient):
    await create_entry(client, email="first@example.com")
    await create_entry(client, email="second@example.com")
    await create_entry(client, email="third@example.com")

    response = await client.get(WAITLIST_URL)

    assert response.status_code == 200
    assert len(response.json()) == 3


@pytest.mark.asyncio
async def test_list_waitlist_entries_pagination(
    client: AsyncClient,
):
    await create_entry(client, email="first@example.com")
    await create_entry(client, email="second@example.com")
    await create_entry(client, email="third@example.com")

    response = await client.get(
        WAITLIST_URL,
        params={"limit": 2, "offset": 1},
    )

    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_list_waitlist_entries_rejects_invalid_limit(
    client: AsyncClient,
):
    response = await client.get(
        WAITLIST_URL,
        params={"limit": 0},
    )

    assert response.status_code == 422


# ------------------------------------------------------------------
# UPDATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_update_waitlist_entry_name(client: AsyncClient):
    created = await create_entry(client)
    entry_id = created.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={"name": "Updated Name"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"
    assert response.json()["email"] == "person@example.com"


@pytest.mark.asyncio
async def test_update_waitlist_entry_phone(client: AsyncClient):
    created = await create_entry(client)
    entry_id = created.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={"phone_e164": "+256701234567"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["phone_e164"] == "+256701234567"
    assert data["phone_country_code"] == "+256"
    assert data["phone_region"] == "UG"
    assert data["phone_national"] == "701234567"


@pytest.mark.asyncio
async def test_update_waitlist_entry_email(client: AsyncClient):
    created = await create_entry(client)
    entry_id = created.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={"email": "updated@example.com"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "updated@example.com"


@pytest.mark.asyncio
async def test_update_null_does_not_clear_existing_values(
    client: AsyncClient,
):
    created = await create_entry(
        client,
        email="person@example.com",
        name="Original Name",
        phone_e164="+256701234567",
    )
    entry_id = created.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={
            "name": None,
            "phone_e164": None,
            "email": None,
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["name"] == "Original Name"
    assert data["email"] == "person@example.com"
    assert data["phone_e164"] == "+256701234567"


@pytest.mark.asyncio
async def test_update_omitted_fields_remain_unchanged(
    client: AsyncClient,
):
    created = await create_entry(
        client,
        email="person@example.com",
        name="Original Name",
        phone_e164="+256701234567",
    )
    entry_id = created.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={"name": "Updated Name"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["email"] == "person@example.com"
    assert data["phone_e164"] == "+256701234567"


@pytest.mark.asyncio
async def test_update_waitlist_entry_not_found(
    client: AsyncClient,
):
    response = await client.patch(
        f"{WAITLIST_URL}00000000-0000-0000-0000-000000000000",
        json={"name": "Updated Name"},
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_rejects_duplicate_email(
    client: AsyncClient,
):
    await create_entry(client, email="first@example.com")
    second = await create_entry(client, email="second@example.com")
    entry_id = second.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={"email": "first@example.com"},
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_update_rejects_duplicate_phone(
    client: AsyncClient,
):
    await create_entry(
        client,
        email="first@example.com",
        phone_e164="+256701234567",
    )
    second = await create_entry(
        client,
        email="second@example.com",
    )

    response = await client.patch(
        f"{WAITLIST_URL}{second.json()['id']}",
        json={"phone_e164": "+256701234567"},
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_update_rejects_invalid_phone(client: AsyncClient):
    created = await create_entry(client)
    entry_id = created.json()["id"]

    response = await client.patch(
        f"{WAITLIST_URL}{entry_id}",
        json={"phone_e164": "+123"},
    )

    assert response.status_code == 422


# ------------------------------------------------------------------
# REMOVE PHONE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_remove_waitlist_phone(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_entry(
        client,
        phone_e164="+256701234567",
    )
    entry_id = created.json()["id"]

    response = await client.delete(
        f"{WAITLIST_URL}{entry_id}/phone",
    )

    assert response.status_code == 200

    data = response.json()
    assert data["phone_e164"] is None
    assert data["phone_country_code"] is None
    assert data["phone_region"] is None
    assert data["phone_national"] is None

    result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.id == entry_id,
        )
    )
    entry = result.scalar_one()

    assert entry.phone_e164 is None
    assert entry.phone_country_code is None
    assert entry.phone_region is None
    assert entry.phone_national is None


@pytest.mark.asyncio
async def test_remove_phone_entry_not_found(
    client: AsyncClient,
):
    response = await client.delete(
        f"{WAITLIST_URL}00000000-0000-0000-0000-000000000000/phone",
    )

    assert response.status_code == 404


# ------------------------------------------------------------------
# DELETE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_delete_waitlist_entry(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_entry(client)
    entry_id = created.json()["id"]

    response = await client.delete(
        f"{WAITLIST_URL}{entry_id}",
    )

    assert response.status_code == 204
    assert response.content == b""

    result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.id == entry_id,
        )
    )

    assert result.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_delete_waitlist_entry_not_found(
    client: AsyncClient,
):
    response = await client.delete(
        f"{WAITLIST_URL}00000000-0000-0000-0000-000000000000",
    )

    assert response.status_code == 404
