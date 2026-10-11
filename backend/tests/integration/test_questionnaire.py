from uuid import UUID, uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.questionnaires.models import (
    Answer,
    Question,
    Questionnaire,
    QuestionnaireSession,
)

QUESTIONNAIRES_URL = "/api/questionnaires/"
MISSING_ID = "00000000-0000-0000-0000-000000000000"


async def create_questionnaire(
    client: AsyncClient,
    slug: str = "waitlist-intake",
    label: str | None = "Waitlist intake",
    version: int | None = None,
    is_active: bool | None = None,
):
    payload = {"slug": slug}

    if label is not None:
        payload["label"] = label

    if version is not None:
        payload["version"] = version

    if is_active is not None:
        payload["is_active"] = is_active

    return await client.post(QUESTIONNAIRES_URL, json=payload)


async def count_rows(db: AsyncSession, model) -> int:
    result = await db.execute(select(func.count()).select_from(model))
    return result.scalar_one()


# Rows are inserted directly because the question/session/answer routes don't
# exist yet. IDs are assigned up front so no expired attribute is read after commit.


async def add_question(
    db: AsyncSession,
    questionnaire_id: str,
    key: str = "working_on",
    order: int = 0,
) -> UUID:
    question_id = uuid4()

    db.add(
        Question(
            id=question_id,
            questionnaire_id=UUID(questionnaire_id),
            key=key,
            text=f"Question for {key}",
            order=order,
        )
    )
    await db.commit()

    return question_id


async def add_session(db: AsyncSession, questionnaire_id: str) -> UUID:
    session_id = uuid4()

    db.add(
        QuestionnaireSession(
            id=session_id,
            questionnaire_id=UUID(questionnaire_id),
        )
    )
    await db.commit()

    return session_id


async def add_answer(db: AsyncSession, session_id: UUID, question_id: UUID) -> None:
    db.add(
        Answer(
            id=uuid4(),
            session_id=session_id,
            question_id=question_id,
            answer_text="Building a platform",
        )
    )
    await db.commit()


# ------------------------------------------------------------------
# CREATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_create_questionnaire(client: AsyncClient, db: AsyncSession):
    response = await create_questionnaire(client)

    assert response.status_code == 201

    data = response.json()
    assert data["slug"] == "waitlist-intake"
    assert data["label"] == "Waitlist intake"
    assert data["version"] == 1
    assert data["is_active"] is True
    assert data["id"] is not None
    assert data["created_at"] is not None

    result = await db.execute(select(Questionnaire).where(Questionnaire.slug == "waitlist-intake"))
    questionnaire = result.scalar_one_or_none()

    assert questionnaire is not None
    assert questionnaire.label == "Waitlist intake"


@pytest.mark.asyncio
async def test_create_questionnaire_with_explicit_values(client: AsyncClient):
    response = await create_questionnaire(
        client,
        version=3,
        is_active=False,
    )

    assert response.status_code == 201

    data = response.json()
    assert data["version"] == 3
    assert data["is_active"] is False


@pytest.mark.asyncio
async def test_create_questionnaire_normalizes_slug_and_label(
    client: AsyncClient,
    db: AsyncSession,
):
    response = await create_questionnaire(
        client,
        slug="  Waitlist-Intake  ",
        label="  Waitlist intake  ",
    )

    assert response.status_code == 201
    assert response.json()["slug"] == "waitlist-intake"
    assert response.json()["label"] == "Waitlist intake"

    assert await count_rows(db, Questionnaire) == 1


@pytest.mark.parametrize("slug", ["has space", "-leading", "trailing-", "double--dash", "bad!chars"])
@pytest.mark.asyncio
async def test_create_questionnaire_rejects_invalid_slug(
    client: AsyncClient,
    slug: str,
):
    response = await create_questionnaire(client, slug=slug)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_questionnaire_rejects_missing_label(
    client: AsyncClient,
):
    response = await create_questionnaire(client, label=None)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_questionnaire_rejects_whitespace_only_label(
    client: AsyncClient,
):
    response = await create_questionnaire(client, label="   ")

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_questionnaire_rejects_invalid_version(
    client: AsyncClient,
):
    response = await create_questionnaire(client, version=0)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_questionnaire_rejects_duplicate_slug(
    client: AsyncClient,
    db: AsyncSession,
):
    first_response = await create_questionnaire(client, label="Original label")
    second_response = await create_questionnaire(client, slug="WAITLIST-INTAKE", label="Different label")

    assert first_response.status_code == 201
    assert second_response.status_code == 409
    assert "waitlist-intake" in second_response.json()["detail"]

    assert await count_rows(db, Questionnaire) == 1


# ------------------------------------------------------------------
# RETRIEVE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_questionnaire_by_id(client: AsyncClient):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.get(f"{QUESTIONNAIRES_URL}{questionnaire_id}")

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == questionnaire_id
    assert data["slug"] == "waitlist-intake"
    assert data["questions"] == []


@pytest.mark.asyncio
async def test_get_questionnaire_includes_questions_in_order(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    # Inserted out of order to prove the response follows Question.order.
    await add_question(db, questionnaire_id, key="second", order=2)
    await add_question(db, questionnaire_id, key="first", order=1)

    response = await client.get(f"{QUESTIONNAIRES_URL}{questionnaire_id}")

    assert response.status_code == 200

    questions = response.json()["questions"]
    assert [question["key"] for question in questions] == ["first", "second"]
    assert questions[0]["questionnaire_id"] == questionnaire_id
    assert questions[0]["type"] == "text"


@pytest.mark.asyncio
async def test_get_questionnaire_not_found(client: AsyncClient):
    response = await client.get(f"{QUESTIONNAIRES_URL}{MISSING_ID}")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_questionnaire_rejects_invalid_uuid(
    client: AsyncClient,
):
    response = await client.get(f"{QUESTIONNAIRES_URL}not-a-uuid")

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_questionnaire_by_slug(client: AsyncClient):
    created = await create_questionnaire(client)

    response = await client.get(f"{QUESTIONNAIRES_URL}by-slug/Waitlist-Intake")

    assert response.status_code == 200

    data = response.json()
    assert data["id"] == created.json()["id"]
    assert data["slug"] == "waitlist-intake"
    assert data["questions"] == []


@pytest.mark.asyncio
async def test_get_questionnaire_by_slug_includes_questions(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_questionnaire(client)
    await add_question(db, created.json()["id"], key="working_on")

    response = await client.get(f"{QUESTIONNAIRES_URL}by-slug/waitlist-intake")

    assert response.status_code == 200
    assert [question["key"] for question in response.json()["questions"]] == ["working_on"]


@pytest.mark.asyncio
async def test_get_questionnaire_by_slug_not_found(
    client: AsyncClient,
):
    response = await client.get(f"{QUESTIONNAIRES_URL}by-slug/missing")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_questionnaires(client: AsyncClient):
    await create_questionnaire(client, slug="first")
    await create_questionnaire(client, slug="second")
    await create_questionnaire(client, slug="third")

    response = await client.get(QUESTIONNAIRES_URL)

    assert response.status_code == 200
    assert len(response.json()) == 3


@pytest.mark.asyncio
async def test_list_questionnaires_pagination(
    client: AsyncClient,
):
    await create_questionnaire(client, slug="first")
    await create_questionnaire(client, slug="second")
    await create_questionnaire(client, slug="third")

    response = await client.get(
        QUESTIONNAIRES_URL,
        params={"limit": 2, "offset": 1},
    )

    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_list_questionnaires_filters_by_active_status(
    client: AsyncClient,
):
    await create_questionnaire(client, slug="active-one", is_active=True)
    await create_questionnaire(client, slug="active-two", is_active=True)
    await create_questionnaire(client, slug="inactive-one", is_active=False)

    active_response = await client.get(QUESTIONNAIRES_URL, params={"is_active": True})
    inactive_response = await client.get(QUESTIONNAIRES_URL, params={"is_active": False})

    assert active_response.status_code == 200
    assert sorted(item["slug"] for item in active_response.json()) == ["active-one", "active-two"]

    assert inactive_response.status_code == 200
    assert [item["slug"] for item in inactive_response.json()] == ["inactive-one"]


@pytest.mark.asyncio
async def test_list_questionnaires_rejects_invalid_limit(
    client: AsyncClient,
):
    response = await client.get(
        QUESTIONNAIRES_URL,
        params={"limit": 0},
    )

    assert response.status_code == 422


# ------------------------------------------------------------------
# UPDATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_update_questionnaire_label(client: AsyncClient):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"label": "Updated label"},
    )

    assert response.status_code == 200
    assert response.json()["label"] == "Updated label"
    assert response.json()["slug"] == "waitlist-intake"


@pytest.mark.asyncio
async def test_update_questionnaire_slug_is_normalized(client: AsyncClient):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"slug": "  New-Slug "},
    )

    assert response.status_code == 200
    assert response.json()["slug"] == "new-slug"


@pytest.mark.asyncio
async def test_update_questionnaire_version(client: AsyncClient):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"version": 2},
    )

    assert response.status_code == 200
    assert response.json()["version"] == 2


@pytest.mark.asyncio
async def test_update_can_deactivate_questionnaire(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"is_active": False},
    )

    assert response.status_code == 200
    assert response.json()["is_active"] is False

    result = await db.execute(select(Questionnaire.is_active).where(Questionnaire.id == UUID(questionnaire_id)))
    assert result.scalar_one() is False


@pytest.mark.asyncio
async def test_update_null_does_not_clear_existing_values(
    client: AsyncClient,
):
    created = await create_questionnaire(client, label="Original label")
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={
            "label": None,
            "slug": None,
            "version": None,
            "is_active": None,
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["label"] == "Original label"
    assert data["slug"] == "waitlist-intake"
    assert data["version"] == 1
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_update_omitted_fields_remain_unchanged(
    client: AsyncClient,
):
    created = await create_questionnaire(client, label="Original label", version=2)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"label": "Updated label"},
    )

    assert response.status_code == 200

    data = response.json()
    assert data["label"] == "Updated label"
    assert data["slug"] == "waitlist-intake"
    assert data["version"] == 2
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_update_questionnaire_not_found(
    client: AsyncClient,
):
    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{MISSING_ID}",
        json={"label": "Updated label"},
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_rejects_duplicate_slug(
    client: AsyncClient,
):
    await create_questionnaire(client, slug="first")
    second = await create_questionnaire(client, slug="second")
    questionnaire_id = second.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"slug": "first"},
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_update_allows_keeping_own_slug(
    client: AsyncClient,
):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"slug": "waitlist-intake", "label": "Updated label"},
    )

    assert response.status_code == 200
    assert response.json()["label"] == "Updated label"


@pytest.mark.asyncio
async def test_update_rejects_invalid_slug(client: AsyncClient):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"slug": "not a slug"},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_rejects_invalid_version(client: AsyncClient):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.patch(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
        json={"version": 0},
    )

    assert response.status_code == 422


# ------------------------------------------------------------------
# DELETE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_delete_questionnaire(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    response = await client.delete(
        f"{QUESTIONNAIRES_URL}{questionnaire_id}",
    )

    assert response.status_code == 204
    assert response.content == b""

    result = await db.execute(
        select(Questionnaire).where(
            Questionnaire.id == UUID(questionnaire_id),
        )
    )

    assert result.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_delete_questionnaire_not_found(
    client: AsyncClient,
):
    response = await client.delete(
        f"{QUESTIONNAIRES_URL}{MISSING_ID}",
    )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_questionnaire_cascades_to_questions_and_sessions(
    client: AsyncClient,
    db: AsyncSession,
):
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    await add_question(db, questionnaire_id, key="first", order=1)
    await add_question(db, questionnaire_id, key="second", order=2)
    await add_session(db, questionnaire_id)

    response = await client.delete(f"{QUESTIONNAIRES_URL}{questionnaire_id}")

    assert response.status_code == 204
    assert await count_rows(db, Questionnaire) == 0
    assert await count_rows(db, Question) == 0
    assert await count_rows(db, QuestionnaireSession) == 0


@pytest.mark.asyncio
async def test_delete_questionnaire_cascades_to_answers(
    client: AsyncClient,
    db: AsyncSession,
):
    # Fails until Question.answers has a delete cascade (or passive_deletes) in the model.
    created = await create_questionnaire(client)
    questionnaire_id = created.json()["id"]

    question_id = await add_question(db, questionnaire_id)
    session_id = await add_session(db, questionnaire_id)
    await add_answer(db, session_id, question_id)

    response = await client.delete(f"{QUESTIONNAIRES_URL}{questionnaire_id}")

    assert response.status_code == 204
    assert await count_rows(db, Answer) == 0
    assert await count_rows(db, Question) == 0
    assert await count_rows(db, QuestionnaireSession) == 0
