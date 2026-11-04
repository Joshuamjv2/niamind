from uuid import UUID

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.questionnaires.schemas import (
    AnswerCreate,
    AnswerPayload,
    AnswerResponse,
)
from api.services.questionnaires.services.answers import (
    delete_session_answer,
    get_session_answer,
    list_session_answers,
    save_answer,
)
from db.session import get_session

router = APIRouter(
    prefix="/questionnaire-sessions/{session_id}/answers",
    tags=["Questionnaire Answers"],
)


@router.put(
    "/{question_id}",
    response_model=AnswerResponse,
    status_code=status.HTTP_200_OK,
)
async def upsert_answer(
    session_id: UUID,
    question_id: UUID,
    payload: AnswerPayload,
    db: AsyncSession = Depends(get_session),
):
    answer_payload = AnswerCreate(
        question_id=question_id,
        answer_text=payload.answer_text,
        answer_array=payload.answer_array,
    )
    return await save_answer(db, session_id, answer_payload)


@router.get(
    "/",
    response_model=list[AnswerResponse],
)
async def get_session_answers(
    session_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    return await list_session_answers(db, session_id)


@router.get(
    "/{question_id}",
    response_model=AnswerResponse,
)
async def get_answer_for_question(
    session_id: UUID,
    question_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    return await get_session_answer(db, session_id, question_id)


@router.delete(
    "/{question_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_answer(
    session_id: UUID,
    question_id: UUID,
    db: AsyncSession = Depends(get_session),
):
    await delete_session_answer(db, session_id, question_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
