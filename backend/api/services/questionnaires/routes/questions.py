from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session

from ..schemas import QuestionCreate, QuestionResponse, QuestionUpdate
from ..services.questions import (
    create_question,
    delete_question,
    get_question,
    list_questions_for_questionnaire,
    update_question,
)

# Domain errors (not found -> 404) are mapped to HTTP responses by the
# handlers in error_handlers.py, so no try/except is needed here.

router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
)


@router.post(
    "/",
    response_model=QuestionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_question_route(
    data: QuestionCreate,
    db: AsyncSession = Depends(get_session),
) -> QuestionResponse:
    question = await create_question(db, data)

    return QuestionResponse.model_validate(question)


@router.get(
    "/",
    response_model=list[QuestionResponse],
)
async def list_questions_route(
    questionnaire_id: UUID,
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_session),
) -> list[QuestionResponse]:
    questions = await list_questions_for_questionnaire(
        db,
        questionnaire_id,
        include_inactive=include_inactive,
    )

    return [QuestionResponse.model_validate(q) for q in questions]


@router.get(
    "/{question_id}",
    response_model=QuestionResponse,
)
async def get_question_route(
    question_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> QuestionResponse:
    question = await get_question(db, question_id)

    return QuestionResponse.model_validate(question)


@router.patch(
    "/{question_id}",
    response_model=QuestionResponse,
)
async def update_question_route(
    question_id: UUID,
    data: QuestionUpdate,
    db: AsyncSession = Depends(get_session),
) -> QuestionResponse:
    question = await update_question(db, question_id, data)

    return QuestionResponse.model_validate(question)


@router.delete(
    "/{question_id}",
)
async def delete_question_route(
    question_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> dict:
    action = await delete_question(db, question_id)

    return {"action": action}