
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session

from ..schemas import (
    QuestionnaireSessionCreate,
    QuestionnaireSessionResponse,
)
from ..services.sessions import (
    complete_questionnaire_session,
    create_questionnaire_session,
    get_questionnaire_session,
)

router = APIRouter(
    prefix="/questionnaire-sessions",
    tags=["Questionnaire Sessions"],
)


@router.post(
    "/",
    response_model=QuestionnaireSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_questionnaire_session_route(
    data: QuestionnaireSessionCreate,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireSessionResponse:
    session = await create_questionnaire_session(
        db,
        questionnaire_id=data.questionnaire_id,
        name=data.name,
        email=data.email,
    )

    return QuestionnaireSessionResponse.model_validate(session)


@router.get(
    "/{session_id}",
    response_model=QuestionnaireSessionResponse,
)
async def get_questionnaire_session_route(
    session_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireSessionResponse:
    session = await get_questionnaire_session(db, session_id)

    return QuestionnaireSessionResponse.model_validate(session)


@router.post(
    "/{session_id}/complete",
    response_model=QuestionnaireSessionResponse,
)
async def complete_questionnaire_session_route(
    session_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireSessionResponse:
    session = await complete_questionnaire_session(db, session_id)

    return QuestionnaireSessionResponse.model_validate(session)
