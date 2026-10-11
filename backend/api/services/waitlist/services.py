import uuid

import phonenumbers
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.waitlist.models import WaitlistEntry
from api.services.waitlist.schemas import (
    WaitlistEntryCreate,
    WaitlistEntryUpdate,
)


async def create_waitlist_entry(
    db: AsyncSession,
    data: WaitlistEntryCreate,
) -> WaitlistEntry:
    email = str(data.email).strip().lower()

    phone_e164 = data.phone_e164
    phone_country_code = None
    phone_region = None
    phone_national = None

    # Core INSERT statements bypass SQLAlchemy ORM validators,
    # so derive the phone components explicitly here.
    if phone_e164:
        parsed_number = phonenumbers.parse(phone_e164, None)

        phone_country_code = f"+{parsed_number.country_code}"
        phone_region = phonenumbers.region_code_for_number(parsed_number) or None
        phone_national = str(parsed_number.national_number)

    statement = (
        insert(WaitlistEntry)
        .values(
            email=email,
            name=data.name,
            phone_e164=phone_e164,
            phone_country_code=phone_country_code,
            phone_region=phone_region,
            phone_national=phone_national,
        )
        .on_conflict_do_nothing(
            index_elements=[WaitlistEntry.email],
        )
        .returning(WaitlistEntry.id)
    )

    try:
        result = await db.execute(statement)
        entry_id = result.scalar_one_or_none()

        if entry_id is None:
            result = await db.execute(
                select(WaitlistEntry).where(
                    WaitlistEntry.email == email,
                )
            )
            entry = result.scalar_one()
        else:
            result = await db.execute(
                select(WaitlistEntry).where(
                    WaitlistEntry.id == entry_id,
                )
            )
            entry = result.scalar_one()

        await db.commit()
        await db.refresh(entry)

        return entry

    except Exception:
        await db.rollback()
        raise


async def get_waitlist_entry(
    db: AsyncSession,
    entry_id: uuid.UUID,
) -> WaitlistEntry | None:
    result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.id == entry_id,
        )
    )

    return result.scalar_one_or_none()


async def get_waitlist_entry_by_email(
    db: AsyncSession,
    email: str,
) -> WaitlistEntry | None:
    normalized_email = email.strip().lower()

    result = await db.execute(
        select(WaitlistEntry).where(
            WaitlistEntry.email == normalized_email,
        )
    )

    return result.scalar_one_or_none()


async def list_waitlist_entries(
    db: AsyncSession,
    limit: int = 100,
    offset: int = 0,
) -> list[WaitlistEntry]:
    statement = select(WaitlistEntry).order_by(WaitlistEntry.created_at.desc()).limit(limit).offset(offset)

    result = await db.execute(statement)

    return list(result.scalars().all())


async def update_waitlist_entry(
    db: AsyncSession,
    entry_id: uuid.UUID,
    data: WaitlistEntryUpdate,
) -> WaitlistEntry | None:
    # Exclude both omitted fields and explicitly supplied None values.
    update_data = data.model_dump(
        exclude_unset=True,
        exclude_none=True,
    )

    if not update_data:
        return await get_waitlist_entry(db, entry_id)

    try:
        result = await db.execute(
            select(WaitlistEntry).where(
                WaitlistEntry.id == entry_id,
            )
        )
        entry = result.scalar_one_or_none()

        if entry is None:
            return None

        for field, value in update_data.items():
            setattr(entry, field, value)

        await db.commit()
        await db.refresh(entry)

        return entry

    except Exception:
        await db.rollback()
        raise


async def remove_waitlist_phone(
    db: AsyncSession,
    entry_id: uuid.UUID,
) -> WaitlistEntry | None:
    try:
        result = await db.execute(
            select(WaitlistEntry).where(
                WaitlistEntry.id == entry_id,
            )
        )
        entry = result.scalar_one_or_none()

        if entry is None:
            return None

        # The ORM validator also clears country code, region and
        # national number when phone_e164 is set to None.
        entry.phone_e164 = None

        await db.commit()
        await db.refresh(entry)

        return entry

    except Exception:
        await db.rollback()
        raise


async def delete_waitlist_entry(
    db: AsyncSession,
    entry_id: uuid.UUID,
) -> bool:
    try:
        result = await db.execute(
            select(WaitlistEntry).where(
                WaitlistEntry.id == entry_id,
            )
        )
        entry = result.scalar_one_or_none()

        if entry is None:
            return False

        await db.delete(entry)
        await db.commit()

        return True

    except Exception:
        await db.rollback()
        raise
