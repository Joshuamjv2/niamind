from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_session

from ..schemas import (
    QuestionnaireCreate,
    QuestionnaireDetailResponse,
    QuestionnaireResponse,
    QuestionnaireUpdate,
)
from ..services.questionnaire import (
    create_questionnaire,
    delete_questionnaire,
    get_questionnaire_detail,
    get_questionnaire_detail_by_slug,
    list_questionnaires,
    update_questionnaire,
)

# Domain errors (not found -> 404, slug conflict -> 409) are mapped to HTTP
# responses by the handlers in error_handlers.py, so no try/except is needed here.

router = APIRouter(
    prefix="/questionnaires",
    tags=["Questionnaires"],
)


@router.post(
    "/",
    response_model=QuestionnaireResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_questionnaire_route(
    data: QuestionnaireCreate,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireResponse:
    questionnaire = await create_questionnaire(db, data)

    return QuestionnaireResponse.model_validate(questionnaire)


@router.get(
    "/",
    response_model=list[QuestionnaireResponse],
)
async def list_questionnaires_route(
    is_active: bool | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_session),
) -> list[QuestionnaireResponse]:
    questionnaires = await list_questionnaires(
        db,
        is_active=is_active,
        limit=limit,
        offset=offset,
    )

    return [QuestionnaireResponse.model_validate(q) for q in questionnaires]


# Declared before "/{questionnaire_id}" so the literal path is matched first.
@router.get(
    "/by-slug/{slug}",
    response_model=QuestionnaireDetailResponse,
)
async def get_questionnaire_by_slug_route(
    slug: str,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireDetailResponse:
    questionnaire = await get_questionnaire_detail_by_slug(db, slug)

    return QuestionnaireDetailResponse.model_validate(questionnaire)


@router.get(
    "/{questionnaire_id}",
    response_model=QuestionnaireDetailResponse,
)
async def get_questionnaire_route(
    questionnaire_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireDetailResponse:
    questionnaire = await get_questionnaire_detail(db, questionnaire_id)

    return QuestionnaireDetailResponse.model_validate(questionnaire)


@router.patch(
    "/{questionnaire_id}",
    response_model=QuestionnaireResponse,
)
async def update_questionnaire_route(
    questionnaire_id: UUID,
    data: QuestionnaireUpdate,
    db: AsyncSession = Depends(get_session),
) -> QuestionnaireResponse:
    questionnaire = await update_questionnaire(db, questionnaire_id, data)

    return QuestionnaireResponse.model_validate(questionnaire)


@router.delete(
    "/{questionnaire_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_questionnaire_route(
    questionnaire_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> None:
    await delete_questionnaire(db, questionnaire_id)
