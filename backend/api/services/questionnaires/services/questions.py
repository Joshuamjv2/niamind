from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..exceptions import QuestionNotFoundError
from ..models import Answer, Question
from ..schemas import QuestionCreate, QuestionUpdate


async def bulk_create_questions(
    db: AsyncSession,
    questionnaire_id: UUID,
    questions_data: list[dict],
) -> list[Question]:
    """Add questions to the current session — does not commit.

    The caller owns the transaction so this composes into larger flows
    (create_questionnaire, bulk import, version clone). If a commit is
    needed after this, the caller does it.
    """
    questions = [
        Question(
            questionnaire_id=questionnaire_id,
            key=q["key"],
            text=q["text"],
            type=q.get("type", "text"),
            placeholder=q.get("placeholder"),
            options=q.get("options"),
            order=q["order"] if q.get("order") is not None else idx,
            required=q.get("required", False),
            is_active=q.get("is_active", True),
        )
        for idx, q in enumerate(questions_data)
    ]
    db.add_all(questions)
    return questions


async def create_question(
    db: AsyncSession,
    data: QuestionCreate,
) -> Question:
    """Standalone create. Commits — use only for the /questions route."""
    question = Question(**data.model_dump())

    db.add(question)
    await db.commit()
    await db.refresh(question)
    return question


async def get_question(db: AsyncSession, question_id: UUID) -> Question:
    question = await db.get(Question, question_id)
    if question is None:
        raise QuestionNotFoundError(f"Question '{question_id}' was not found.")
    return question


async def list_questions_for_questionnaire(
    db: AsyncSession,
    questionnaire_id: UUID,
    *,
    include_inactive: bool = False,
) -> list[Question]:
    statement = (
        select(Question)
        .where(Question.questionnaire_id == questionnaire_id)
        .order_by(Question.order)
    )
    if not include_inactive:
        statement = statement.where(Question.is_active.is_(True))

    result = await db.execute(statement)
    return list(result.scalars().all())


async def update_question(
    db: AsyncSession,
    question_id: UUID,
    data: QuestionUpdate,
) -> Question:
    """Update only the fields supplied by the caller.

    ``type`` is not in QuestionUpdate — it is immutable after creation,
    so no need to guard against type changes here.
    """
    question = await get_question(db, question_id)

    updates = data.model_dump(exclude_unset=True, exclude_none=True)
    if not updates:
        return question

    for field, value in updates.items():
        setattr(question, field, value)

    await db.commit()
    await db.refresh(question)
    return question


async def question_has_answers(db: AsyncSession, question_id: UUID) -> bool:
    count = await db.scalar(
        select(func.count())
        .select_from(Answer)
        .where(Answer.question_id == question_id)
    )
    return (count or 0) > 0


async def delete_question(
    db: AsyncSession,
    question_id: UUID,
) -> str:
    """Delete a question, or soft-retire it if it has answers.

    Returns ``"deleted"`` for a hard delete, ``"retired"`` if the question
    was deactivated instead. Answer.question_id has ondelete=CASCADE, so a
    hard delete on an answered question would destroy respondent data —
    we refuse to do that.
    """
    question = await get_question(db, question_id)

    if await question_has_answers(db, question_id):
        question.is_active = False
        await db.commit()
        return "retired"

    await db.delete(question)
    await db.commit()
    return "deleted"
