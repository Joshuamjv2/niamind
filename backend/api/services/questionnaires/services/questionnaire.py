from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .questions import bulk_create_questions

from ..exceptions import (
    QuestionnaireNotFoundError,
    QuestionnaireSlugConflictError,
)
from ..models import Question, Questionnaire, QuestionnaireSession
from ..schemas import (
    QuestionnaireCreate,
    QuestionnaireUpdate,
)


async def create_questionnaire(
    db: AsyncSession,
    data: QuestionnaireCreate,
) -> Questionnaire:
    existing = await db.scalar(
        select(Questionnaire.id).where(Questionnaire.slug == data.slug)
    )
    if existing is not None:
        raise QuestionnaireSlugConflictError(
            f"A questionnaire with slug '{data.slug}' already exists."
        )

    questionnaire = Questionnaire(
        **data.model_dump(exclude={"questions"})
    )
    db.add(questionnaire)

    try:
        await db.flush()  # assigns questionnaire.id without committing
        if data.questions:
            await bulk_create_questions(
                db,
                questionnaire.id,
                [q.model_dump() for q in data.questions],
            )
        await db.commit()
        await db.refresh(questionnaire, attribute_names=["questions"])
        return questionnaire
    except IntegrityError as exc:
        await db.rollback()
        raise QuestionnaireSlugConflictError(
            f"A questionnaire with slug '{data.slug}' already exists."
        ) from exc
    except Exception:
        await db.rollback()
        raise


async def get_questionnaire(
    db: AsyncSession,
    questionnaire_id: UUID,
) -> Questionnaire:
    """Retrieve a questionnaire by ID (relationships are not loaded)."""

    questionnaire = await db.get(Questionnaire, questionnaire_id)

    if questionnaire is None:
        raise QuestionnaireNotFoundError(f"Questionnaire '{questionnaire_id}' was not found.")

    return questionnaire


async def get_questionnaire_detail(
    db: AsyncSession,
    questionnaire_id: UUID,
) -> Questionnaire:
    """Retrieve a questionnaire with its questions eagerly loaded.

    Use this for QuestionnaireDetailResponse. The questions come back in
    Question.order, as defined on the relationship.
    """

    result = await db.execute(select(Questionnaire).where(Questionnaire.id == questionnaire_id).options(selectinload(Questionnaire.questions)))
    questionnaire = result.scalar_one_or_none()

    if questionnaire is None:
        raise QuestionnaireNotFoundError(f"Questionnaire '{questionnaire_id}' was not found.")

    return questionnaire


async def get_questionnaire_detail_by_slug(
    db: AsyncSession,
    slug: str,
) -> Questionnaire:
    """Retrieve a questionnaire by slug with its questions eagerly loaded."""

    normalized_slug = slug.strip().lower()

    result = await db.execute(select(Questionnaire).where(Questionnaire.slug == normalized_slug).options(selectinload(Questionnaire.questions)))
    questionnaire = result.scalar_one_or_none()

    if questionnaire is None:
        raise QuestionnaireNotFoundError(f"Questionnaire with slug '{normalized_slug}' was not found.")

    return questionnaire


async def get_questionnaire_by_slug(
    db: AsyncSession,
    slug: str,
) -> Questionnaire:
    """Retrieve a questionnaire by slug (relationships are not loaded)."""

    normalized_slug = slug.strip().lower()

    result = await db.execute(select(Questionnaire).where(Questionnaire.slug == normalized_slug))
    questionnaire = result.scalar_one_or_none()

    if questionnaire is None:
        raise QuestionnaireNotFoundError(f"Questionnaire with slug '{normalized_slug}' was not found.")

    return questionnaire


async def list_questionnaires(
    db: AsyncSession,
    *,
    is_active: bool | None = None,
    limit: int = 100,
    offset: int = 0,
) -> list[tuple[Questionnaire, int, int]]:
    """List questionnaires with question and session counts.

    Returns (questionnaire, question_count, session_count) tuples. Counts
    are correlated subqueries, so this remains a single database round-trip.
    """

    question_count = (
        select(func.count(Question.id))
        .where(Question.questionnaire_id == Questionnaire.id)
        .correlate(Questionnaire)
        .scalar_subquery()
    )
    session_count = (
        select(func.count(QuestionnaireSession.id))
        .where(QuestionnaireSession.questionnaire_id == Questionnaire.id)
        .correlate(Questionnaire)
        .scalar_subquery()
    )

    statement = (
        select(
            Questionnaire,
            question_count.label("question_count"),
            session_count.label("session_count"),
        )
        .order_by(Questionnaire.created_at.desc())
    )

    if is_active is not None:
        statement = statement.where(Questionnaire.is_active == is_active)

    statement = statement.limit(limit).offset(offset)

    result = await db.execute(statement)
    return list(result.all())


async def update_questionnaire(
    db: AsyncSession,
    questionnaire_id: UUID,
    data: QuestionnaireUpdate,
) -> Questionnaire:
    """Update only the fields supplied by the caller."""

    questionnaire = await get_questionnaire(
        db,
        questionnaire_id,
    )

    updates = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if not updates:
        return questionnaire

    new_slug = updates.get("slug")

    if new_slug is not None and new_slug != questionnaire.slug:
        existing = await db.scalar(
            select(Questionnaire.id).where(
                Questionnaire.slug == new_slug,
                Questionnaire.id != questionnaire_id,
            )
        )

        if existing is not None:
            raise QuestionnaireSlugConflictError(f"A questionnaire with slug '{new_slug}' already exists.")

    for field, value in updates.items():
        setattr(questionnaire, field, value)

    try:
        await db.commit()
        await db.refresh(questionnaire)
        return questionnaire
    except IntegrityError as exc:
        await db.rollback()
        raise QuestionnaireSlugConflictError("The questionnaire could not be updated because the slug may already be in use.") from exc
    except Exception:
        await db.rollback()
        raise


async def delete_questionnaire(
    db: AsyncSession,
    questionnaire_id: UUID,
) -> None:
    """Delete a questionnaire.

    This cascades to its questions, sessions and answers. Prefer setting
    is_active=False for any questionnaire that has collected responses.
    """

    questionnaire = await get_questionnaire(
        db,
        questionnaire_id,
    )

    try:
        await db.delete(questionnaire)
        await db.commit()
    except Exception:
        await db.rollback()
        raise
