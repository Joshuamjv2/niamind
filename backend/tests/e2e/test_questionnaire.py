import os
from uuid import uuid4

import httpx
import pytest

E2E_BASE_URL = os.getenv(
    "E2E_BASE_URL",
    "http://127.0.0.1:8000",
)
QUESTIONNAIRES_URL = f"{E2E_BASE_URL.rstrip('/')}/api/questionnaires"


def unique_slug() -> str:
    # Slugs are unique, so each test gets its own and never collides with earlier runs.
    return f"e2e-{uuid4().hex[:12]}"


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    async with httpx.AsyncClient(timeout=15.0) as http_client:
        yield http_client


@pytest.fixture
async def cleanup(client: httpx.AsyncClient):
    """Collects created questionnaire IDs and deletes them after the test."""
    questionnaire_ids: list[str] = []
    yield questionnaire_ids

    for questionnaire_id in questionnaire_ids:
        # A 404 here just means the test already deleted it.
        await client.delete(f"{QUESTIONNAIRES_URL}/{questionnaire_id}")


@pytest.mark.anyio
async def test_questionnaire_creation_and_retrieval(
    client: httpx.AsyncClient,
    cleanup: list[str],
):
    slug = unique_slug()

    # An admin creates a questionnaire.
    create_response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={
            "slug": slug,
            "label": "E2E Questionnaire",
        },
    )

    assert create_response.status_code == 201

    created = create_response.json()
    questionnaire_id = created["id"]
    cleanup.append(questionnaire_id)

    assert created["slug"] == slug
    assert created["label"] == "E2E Questionnaire"
    assert created["version"] == 1
    assert created["is_active"] is True

    # It can subsequently be retrieved by ID, with an empty question list.
    get_response = await client.get(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
    )

    assert get_response.status_code == 200
    assert get_response.json()["id"] == questionnaire_id
    assert get_response.json()["slug"] == slug
    assert get_response.json()["questions"] == []

    # It can also be retrieved by slug, regardless of case.
    slug_response = await client.get(
        f"{QUESTIONNAIRES_URL}/by-slug/{slug.upper()}",
    )

    assert slug_response.status_code == 200
    assert slug_response.json()["id"] == questionnaire_id

    # It appears in the list (newest first).
    list_response = await client.get(
        f"{QUESTIONNAIRES_URL}/",
        params={"limit": 500},
    )

    assert list_response.status_code == 200
    assert slug in [item["slug"] for item in list_response.json()]


@pytest.mark.anyio
async def test_questionnaire_update_and_deactivation(
    client: httpx.AsyncClient,
    cleanup: list[str],
):
    slug = unique_slug()

    create_response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={
            "slug": slug,
            "label": "Original Label",
        },
    )

    assert create_response.status_code == 201
    questionnaire_id = create_response.json()["id"]
    cleanup.append(questionnaire_id)

    # Update the label without changing anything else.
    update_response = await client.patch(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
        json={"label": "Updated Label"},
    )

    assert update_response.status_code == 200

    updated = update_response.json()
    assert updated["label"] == "Updated Label"
    assert updated["slug"] == slug
    assert updated["is_active"] is True

    # Explicit nulls must not clear existing values.
    null_response = await client.patch(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
        json={"label": None, "is_active": None},
    )

    assert null_response.status_code == 200
    assert null_response.json()["label"] == "Updated Label"
    assert null_response.json()["is_active"] is True

    # The slug can be changed, after which the old slug no longer resolves.
    new_slug = unique_slug()
    slug_response = await client.patch(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
        json={"slug": new_slug},
    )

    assert slug_response.status_code == 200
    assert slug_response.json()["slug"] == new_slug

    old_slug_response = await client.get(f"{QUESTIONNAIRES_URL}/by-slug/{slug}")
    assert old_slug_response.status_code == 404

    # Deactivation is a normal update.
    deactivate_response = await client.patch(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
        json={"is_active": False},
    )

    assert deactivate_response.status_code == 200
    assert deactivate_response.json()["is_active"] is False

    # The changes persist across separate HTTP requests.
    get_response = await client.get(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
    )

    assert get_response.status_code == 200
    assert get_response.json()["label"] == "Updated Label"
    assert get_response.json()["slug"] == new_slug
    assert get_response.json()["is_active"] is False

    # The active filter reflects the change.
    inactive_response = await client.get(
        f"{QUESTIONNAIRES_URL}/",
        params={"is_active": False, "limit": 500},
    )
    active_response = await client.get(
        f"{QUESTIONNAIRES_URL}/",
        params={"is_active": True, "limit": 500},
    )

    assert new_slug in [item["slug"] for item in inactive_response.json()]
    assert new_slug not in [item["slug"] for item in active_response.json()]


@pytest.mark.anyio
async def test_questionnaire_deletion(
    client: httpx.AsyncClient,
):
    slug = unique_slug()

    create_response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={"slug": slug, "label": "To Be Deleted"},
    )

    assert create_response.status_code == 201
    questionnaire_id = create_response.json()["id"]

    delete_response = await client.delete(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
    )

    assert delete_response.status_code == 204

    # Subsequent requests confirm it is gone.
    get_response = await client.get(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
    )
    assert get_response.status_code == 404

    slug_response = await client.get(
        f"{QUESTIONNAIRES_URL}/by-slug/{slug}",
    )
    assert slug_response.status_code == 404

    # Deleting again reports not found.
    repeat_response = await client.delete(
        f"{QUESTIONNAIRES_URL}/{questionnaire_id}",
    )
    assert repeat_response.status_code == 404


@pytest.mark.anyio
async def test_questionnaire_rejects_duplicate_slug(
    client: httpx.AsyncClient,
    cleanup: list[str],
):
    slug = unique_slug()

    first_response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={"slug": slug, "label": "First"},
    )

    assert first_response.status_code == 201
    first_id = first_response.json()["id"]
    cleanup.append(first_id)

    # Slugs are normalized, so a different case is still a duplicate.
    duplicate_response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={"slug": slug.upper(), "label": "Second"},
    )

    assert duplicate_response.status_code == 409

    # Renaming another questionnaire to the taken slug is rejected as well.
    other_response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={"slug": unique_slug(), "label": "Other"},
    )

    assert other_response.status_code == 201
    other_id = other_response.json()["id"]
    cleanup.append(other_id)

    rename_response = await client.patch(
        f"{QUESTIONNAIRES_URL}/{other_id}",
        json={"slug": slug},
    )

    assert rename_response.status_code == 409


@pytest.mark.anyio
async def test_questionnaire_rejects_invalid_registration(
    client: httpx.AsyncClient,
):
    response = await client.post(
        f"{QUESTIONNAIRES_URL}/",
        json={
            "slug": "not a slug",
            "label": "   ",
        },
    )

    assert response.status_code == 422
