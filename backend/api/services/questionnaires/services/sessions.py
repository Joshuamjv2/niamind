from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..exceptions import (
    QuestionnaireInactiveError,
    QuestionnaireNotFoundError,
    QuestionnaireSessionNotFoundError,
    RequiredQuestionUnansweredError,
)
from ..models import Answer, Question, Questionnaire, QuestionnaireSession


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


async def create_questionnaire_session(
    db: AsyncSession,
    questionnaire_id: UUID,
    name: str | None = None,
    email: str | None = None,
) -> QuestionnaireSession:
    questionnaire = await db.get(Questionnaire, questionnaire_id)

    if questionnaire is None:
        raise QuestionnaireNotFoundError(f"Questionnaire '{questionnaire_id}' was not found.")

    if not questionnaire.is_active:
        raise QuestionnaireInactiveError(f"Questionnaire '{questionnaire_id}' is not active.")

    session = QuestionnaireSession(
        questionnaire_id=questionnaire_id,
        name=name.strip() if name and name.strip() else None,
        email=email.strip().lower() if email and email.strip() else None,
    )

    try:
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session
    except Exception:
        await db.rollback()
        raise


async def get_questionnaire_session(
    db: AsyncSession,
    session_id: UUID,
) -> QuestionnaireSession:
    session = await db.get(QuestionnaireSession, session_id)

    if session is None:
        raise QuestionnaireSessionNotFoundError(f"Questionnaire session '{session_id}' was not found.")

    return session


async def complete_questionnaire_session(
    db: AsyncSession,
    session_id: UUID,
) -> QuestionnaireSession:
    session = await get_questionnaire_session(db, session_id)

    # Completing an already-completed session is idempotent.
    if session.completed_at is not None:
        return session

    required_questions = await db.scalars(
        select(Question).where(
            Question.questionnaire_id == session.questionnaire_id,
            Question.is_active.is_(True),
            Question.required.is_(True),
        )
    )
    questions = list(required_questions.all())

    answers_result = await db.scalars(select(Answer).where(Answer.session_id == session_id))
    answers_by_question = {answer.question_id: answer for answer in answers_result.all()}

    unanswered_ids: list[UUID] = []

    for question in questions:
        answer = answers_by_question.get(question.id)

        if answer is None:
            unanswered_ids.append(question.id)
            continue

        if question.type == "text":
            has_answer = bool(answer.answer_text and answer.answer_text.strip())
        else:
            has_answer = bool(answer.answer_array)

        if not has_answer:
            unanswered_ids.append(question.id)

    if unanswered_ids:
        raise RequiredQuestionUnansweredError(f"Cannot complete the questionnaire. Required questions remain unanswered: {unanswered_ids}")

    try:
        session.completed_at = utc_now()
        await db.commit()
        await db.refresh(session)
        return session
    except Exception:
        await db.rollback()
        raise
