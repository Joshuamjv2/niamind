
from uuid import UUID, uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.questionnaires.models import (
    Question,
    QuestionnaireSession,
)

QUESTIONNAIRES_URL = "/api/questionnaires/"
SESSIONS_URL = "/api/questionnaire-sessions/"
MISSING_ID = "00000000-0000-0000-0000-000000000000"


async def create_questionnaire(
    client: AsyncClient,
    *,
    slug: str = "session-test",
    is_active: bool = True,
) -> dict:
    response = await client.post(
        QUESTIONNAIRES_URL,
        json={
            "slug": slug,
            "label": "Session test",
            "is_active": is_active,
        },
    )
    assert response.status_code == 201
    return response.json()


async def add_required_question(
    db: AsyncSession,
    questionnaire_id: str,
) -> UUID:
    question_id = uuid4()

    db.add(
        Question(
            id=question_id,
            questionnaire_id=UUID(questionnaire_id),
            key="required_question",
            text="What are you working on?",
            type="text",
            required=True,
            is_active=True,
            order=1,
        )
    )
    await db.commit()

    return question_id


# ------------------------------------------------------------------
# CREATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_create_questionnaire_session(
    client: AsyncClient,
    db: AsyncSession,
):
    questionnaire = await create_questionnaire(client)

    response = await client.post(
        SESSIONS_URL,
        json={
            "questionnaire_id": questionnaire["id"],
            "name": "Alex",
            "email": "ALEX@example.com",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["questionnaire_id"] == questionnaire["id"]
    assert data["name"] == "Alex"
    assert data["email"] == "alex@example.com"
    assert data["completed_gate"] is False
    assert data["completed_at"] is None

    result = await db.execute(
        select(QuestionnaireSession).where(
            QuestionnaireSession.id == UUID(data["id"])
        )
    )
    session = result.scalar_one()

    assert session.questionnaire_id == UUID(questionnaire["id"])
    assert session.email == "alex@example.com"


@pytest.mark.asyncio
async def test_create_session_without_optional_contact_details(
    client: AsyncClient,
):
    questionnaire = await create_questionnaire(client)

    response = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": questionnaire["id"]},
    )

    assert response.status_code == 201
    assert response.json()["name"] is None
    assert response.json()["email"] is None


@pytest.mark.asyncio
async def test_create_session_rejects_missing_questionnaire(
    client: AsyncClient,
):
    response = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": MISSING_ID},
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_session_rejects_inactive_questionnaire(
    client: AsyncClient,
):
    questionnaire = await create_questionnaire(
        client,
        slug="inactive-session-test",
        is_active=False,
    )

    response = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": questionnaire["id"]},
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_create_session_rejects_invalid_questionnaire_id(
    client: AsyncClient,
):
    response = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": "not-a-uuid"},
    )

    assert response.status_code == 422


# ------------------------------------------------------------------
# RETRIEVE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_questionnaire_session(client: AsyncClient):
    questionnaire = await create_questionnaire(client)

    created = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": questionnaire["id"]},
    )
    assert created.status_code == 201

    session_id = created.json()["id"]

    response = await client.get(f"{SESSIONS_URL}{session_id}")

    assert response.status_code == 200
    assert response.json()["id"] == session_id
    assert response.json()["questionnaire_id"] == questionnaire["id"]
    assert response.json()["completed_at"] is None


@pytest.mark.asyncio
async def test_get_questionnaire_session_not_found(
    client: AsyncClient,
):
    response = await client.get(f"{SESSIONS_URL}{MISSING_ID}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_questionnaire_session_rejects_invalid_uuid(
    client: AsyncClient,
):
    response = await client.get(f"{SESSIONS_URL}not-a-uuid")

    assert response.status_code == 422


# ------------------------------------------------------------------
# COMPLETE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_complete_session_with_no_required_questions(
    client: AsyncClient,
):
    questionnaire = await create_questionnaire(client)

    created = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": questionnaire["id"]},
    )
    assert created.status_code == 201

    session_id = created.json()["id"]

    response = await client.post(
        f"{SESSIONS_URL}{session_id}/complete",
    )

    assert response.status_code == 200
    assert response.json()["completed_at"] is not None


@pytest.mark.asyncio
async def test_complete_session_rejects_unanswered_required_question(
    client: AsyncClient,
    db: AsyncSession,
):
    questionnaire = await create_questionnaire(
        client,
        slug="required-session-test",
    )
    await add_required_question(db, questionnaire["id"])

    created = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": questionnaire["id"]},
    )
    assert created.status_code == 201

    session_id = created.json()["id"]

    response = await client.post(
        f"{SESSIONS_URL}{session_id}/complete",
    )

    assert response.status_code == 422

    result = await db.execute(
        select(QuestionnaireSession.completed_at).where(
            QuestionnaireSession.id == UUID(session_id)
        )
    )
    assert result.scalar_one() is None


@pytest.mark.asyncio
async def test_complete_session_is_idempotent(
    client: AsyncClient,
):
    questionnaire = await create_questionnaire(client)

    created = await client.post(
        SESSIONS_URL,
        json={"questionnaire_id": questionnaire["id"]},
    )
    assert created.status_code == 201

    session_id = created.json()["id"]

    first = await client.post(f"{SESSIONS_URL}{session_id}/complete")
    second = await client.post(f"{SESSIONS_URL}{session_id}/complete")

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["completed_at"] == second.json()["completed_at"]


@pytest.mark.asyncio
async def test_complete_session_not_found(client: AsyncClient):
    response = await client.post(
        f"{SESSIONS_URL}{MISSING_ID}/complete",
    )

    assert response.status_code == 404
