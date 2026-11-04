
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.questionnaires.exceptions import (
    QuestionnaireSessionNotFoundError,
)
from api.services.questionnaires.models import (
    Answer,
    Question,
    QuestionnaireSession,
)
from api.services.questionnaires.schemas import AnswerCreate


async def _get_session(
    db: AsyncSession,
    session_id: UUID,
) -> QuestionnaireSession:
    session = await db.get(QuestionnaireSession, session_id)

    if session is None:
        raise QuestionnaireSessionNotFoundError(
            f"Questionnaire session '{session_id}' was not found."
        )

    return session


async def _validate_answer(
    db: AsyncSession,
    session: QuestionnaireSession,
    question_id: UUID,
    answer_text: str | None,
    answer_array: list[str] | None,
) -> Question:
    question = await db.get(Question, question_id)

    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Question '{question_id}' was not found.",
        )

    if question.questionnaire_id != session.questionnaire_id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The question does not belong to this questionnaire session.",
        )

    if not question.is_active:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This question is no longer active.",
        )

    if session.completed_at is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Answers cannot be changed after the session is completed.",
        )

    if question.type == "text":
        if answer_text is None or answer_array is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Text questions require answer_text only.",
            )
        return question

    if question.type == "single_select":
        if answer_array is None or answer_text is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Single-select questions require answer_array.",
            )

        if len(answer_array) != 1:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Single-select questions require exactly one option.",
            )

    elif question.type == "multiselect":
        if answer_array is None or answer_text is not None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Multiselect questions require answer_array.",
            )

        if len(answer_array) != len(set(answer_array)):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Duplicate selections are not allowed.",
            )

    else:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unsupported question type: {question.type}.",
        )

    options = question.options or []

    if not options:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This selection question has no configured options.",
        )

    invalid_options = set(answer_array) - set(options)

    if invalid_options:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "One or more selected options are invalid.",
                "invalid_options": sorted(invalid_options),
            },
        )

    return question


async def save_answer(
    db: AsyncSession,
    session_id: UUID,
    payload: AnswerCreate,
) -> Answer:
    session = await _get_session(db, session_id)

    await _validate_answer(
        db=db,
        session=session,
        question_id=payload.question_id,
        answer_text=payload.answer_text,
        answer_array=payload.answer_array,
    )

    result = await db.execute(
        select(Answer).where(
            Answer.session_id == session_id,
            Answer.question_id == payload.question_id,
        )
    )
    answer = result.scalar_one_or_none()

    if answer is None:
        answer = Answer(
            session_id=session_id,
            question_id=payload.question_id,
            answer_text=payload.answer_text,
            answer_array=payload.answer_array,
        )
        db.add(answer)
    else:
        answer.answer_text = payload.answer_text
        answer.answer_array = payload.answer_array

    try:
        await db.commit()
        await db.refresh(answer)
    except Exception:
        await db.rollback()
        raise

    return answer


async def get_answer(
    db: AsyncSession,
    answer_id: UUID,
) -> Answer:
    answer = await db.get(Answer, answer_id)

    if answer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Answer '{answer_id}' was not found.",
        )

    return answer


async def get_session_answer(
    db: AsyncSession,
    session_id: UUID,
    question_id: UUID,
) -> Answer:
    await _get_session(db, session_id)

    result = await db.execute(
        select(Answer).where(
            Answer.session_id == session_id,
            Answer.question_id == question_id,
        )
    )
    answer = result.scalar_one_or_none()

    if answer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Answer not found for this session and question.",
        )

    return answer


async def list_session_answers(
    db: AsyncSession,
    session_id: UUID,
) -> list[Answer]:
    await _get_session(db, session_id)

    result = await db.scalars(
        select(Answer)
        .where(Answer.session_id == session_id)
        .order_by(Answer.created_at, Answer.id)
    )

    return list(result.all())


async def delete_answer(
    db: AsyncSession,
    answer_id: UUID,
) -> None:
    answer = await get_answer(db, answer_id)
    session = await _get_session(db, answer.session_id)

    if session.completed_at is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Answers cannot be deleted after the session is completed.",
        )

    try:
        await db.delete(answer)
        await db.commit()
    except Exception:
        await db.rollback()
        raise


async def delete_session_answer(
    db: AsyncSession,
    session_id: UUID,
    question_id: UUID,
) -> None:
    answer = await get_session_answer(db, session_id, question_id)
    session = await _get_session(db, session_id)

    if session.completed_at is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Answers cannot be deleted after the session is completed.",
        )

    try:
        await db.delete(answer)
        await db.commit()
    except Exception:
        await db.rollback()
        raise
