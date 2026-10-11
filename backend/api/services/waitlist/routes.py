from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.waitlist.schemas import (
    WaitlistEntryCreate,
    WaitlistEntryResponse,
    WaitlistEntryUpdate,
)
from api.services.waitlist.services import (
    create_waitlist_entry,
    delete_waitlist_entry,
    get_waitlist_entry,
    get_waitlist_entry_by_email,
    list_waitlist_entries,
    remove_waitlist_phone,
    update_waitlist_entry,
)
from db.session import get_session


router = APIRouter(
    prefix="/waitlist",
    tags=["Waitlist"],
)


@router.post(
    "/",
    response_model=WaitlistEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def join_waitlist(
    data: WaitlistEntryCreate,
    db: AsyncSession = Depends(get_session),
) -> WaitlistEntryResponse:
    try:
        entry = await create_waitlist_entry(db, data)
    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An entry with this phone number already exists.",
        ) from exc

    return WaitlistEntryResponse.model_validate(entry)


@router.get(
    "/",
    response_model=list[WaitlistEntryResponse],
)
async def get_waitlist(
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_session),
) -> list[WaitlistEntryResponse]:
    entries = await list_waitlist_entries(
        db,
        limit=limit,
        offset=offset,
    )

    return [WaitlistEntryResponse.model_validate(entry) for entry in entries]


@router.get(
    "/by-email",
    response_model=WaitlistEntryResponse,
)
async def get_waitlist_entry_by_email_route(
    email: str,
    db: AsyncSession = Depends(get_session),
) -> WaitlistEntryResponse:
    entry = await get_waitlist_entry_by_email(db, email)

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waitlist entry not found.",
        )

    return WaitlistEntryResponse.model_validate(entry)


@router.get(
    "/{entry_id}",
    response_model=WaitlistEntryResponse,
)
async def get_waitlist_entry_route(
    entry_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> WaitlistEntryResponse:
    entry = await get_waitlist_entry(db, entry_id)

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waitlist entry not found.",
        )

    return WaitlistEntryResponse.model_validate(entry)


@router.patch(
    "/{entry_id}",
    response_model=WaitlistEntryResponse,
)
async def update_waitlist_entry_route(
    entry_id: UUID,
    data: WaitlistEntryUpdate,
    db: AsyncSession = Depends(get_session),
) -> WaitlistEntryResponse:
    try:
        entry = await update_waitlist_entry(db, entry_id, data)
    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The email or phone number is already in use.",
        ) from exc

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waitlist entry not found.",
        )

    return WaitlistEntryResponse.model_validate(entry)


@router.delete(
    "/{entry_id}/phone",
    response_model=WaitlistEntryResponse,
)
async def delete_waitlist_phone(
    entry_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> WaitlistEntryResponse:
    entry = await remove_waitlist_phone(db, entry_id)

    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waitlist entry not found.",
        )

    return WaitlistEntryResponse.model_validate(entry)


@router.delete(
    "/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_waitlist_entry_route(
    entry_id: UUID,
    db: AsyncSession = Depends(get_session),
) -> None:
    deleted = await delete_waitlist_entry(db, entry_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Waitlist entry not found.",
        )
