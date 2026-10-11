from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.waitlist.models import WaitlistEntry
from api.services.waitlist.schemas import WaitlistEntryUpdate
from api.services.waitlist.services import (
    create_waitlist_entry,
    delete_waitlist_entry,
    get_waitlist_entry,
    get_waitlist_entry_by_email,
    list_waitlist_entries,
    remove_waitlist_phone,
    update_waitlist_entry,
)


@pytest.fixture
def db() -> AsyncMock:
    session = AsyncMock(spec=AsyncSession)
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.refresh = AsyncMock()
    session.delete = AsyncMock()
    return session


@pytest.fixture
def entry() -> WaitlistEntry:
    return WaitlistEntry(
        id=uuid4(),
        email="person@example.com",
        name="Test Person",
        phone_e164="+256701234567",
    )


def mock_result(scalar_one_or_none=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_one_or_none
    return result


# ------------------------------------------------------------------
# CREATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_create_waitlist_entry(db: AsyncMock):
    entry_id = uuid4()
    entry = WaitlistEntry(
        id=entry_id,
        email="person@example.com",
        name="Test Person",
        phone_e164="+256701234567",
    )

    insert_result = MagicMock()
    insert_result.scalar_one_or_none.return_value = entry_id

    select_result = MagicMock()
    select_result.scalar_one.return_value = entry

    db.execute.side_effect = [insert_result, select_result]

    data = SimpleNamespace(
        email="person@example.com",
        name="Test Person",
        phone_e164="+256701234567",
    )

    result = await create_waitlist_entry(db, data)

    assert result is entry
    assert result.phone_country_code == "+256"
    assert result.phone_region == "UG"
    assert result.phone_national == "701234567"

    db.commit.assert_awaited_once()
    db.refresh.assert_awaited_once_with(entry)


@pytest.mark.asyncio
async def test_create_returns_existing_entry_for_duplicate_email(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    insert_result = MagicMock()
    insert_result.scalar_one_or_none.return_value = None

    select_result = MagicMock()
    select_result.scalar_one.return_value = entry

    db.execute.side_effect = [insert_result, select_result]

    data = SimpleNamespace(
        email="PERSON@example.com",
        name="Different Name",
        phone_e164=None,
    )

    result = await create_waitlist_entry(db, data)

    assert result is entry
    assert result.name == "Test Person"

    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_create_rolls_back_on_database_error(db: AsyncMock):
    db.execute.side_effect = RuntimeError("Database failure")

    data = SimpleNamespace(
        email="person@example.com",
        name=None,
        phone_e164=None,
    )

    with pytest.raises(RuntimeError, match="Database failure"):
        await create_waitlist_entry(db, data)

    db.rollback.assert_awaited_once()


# ------------------------------------------------------------------
# RETRIEVE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_waitlist_entry_returns_entry(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)

    result = await get_waitlist_entry(db, entry.id)

    assert result is entry
    db.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_waitlist_entry_returns_none_when_missing(
    db: AsyncMock,
):
    db.execute.return_value = mock_result(None)

    result = await get_waitlist_entry(db, uuid4())

    assert result is None


@pytest.mark.asyncio
async def test_get_waitlist_entry_by_email_normalizes_email(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)

    result = await get_waitlist_entry_by_email(
        db,
        "  PERSON@EXAMPLE.COM  ",
    )

    assert result is entry

    statement = db.execute.await_args.args[0]
    assert statement.compile().params["email_1"] == "person@example.com"


@pytest.mark.asyncio
async def test_list_waitlist_entries(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    result_mock = MagicMock()
    result_mock.scalars.return_value.all.return_value = [entry]
    db.execute.return_value = result_mock

    result = await list_waitlist_entries(
        db,
        limit=10,
        offset=0,
    )

    assert result == [entry]
    db.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_list_waitlist_entries_returns_empty_list(
    db: AsyncMock,
):
    result_mock = MagicMock()
    result_mock.scalars.return_value.all.return_value = []
    db.execute.return_value = result_mock

    result = await list_waitlist_entries(db)

    assert result == []


# ------------------------------------------------------------------
# UPDATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_update_waitlist_entry_changes_name(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)

    data = WaitlistEntryUpdate(name="Updated Name")

    result = await update_waitlist_entry(db, entry.id, data)

    assert result is entry
    assert result.name == "Updated Name"

    db.commit.assert_awaited_once()
    db.refresh.assert_awaited_once_with(entry)


@pytest.mark.asyncio
async def test_update_preserves_omitted_fields(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    original_email = entry.email
    original_phone = entry.phone_e164

    db.execute.return_value = mock_result(entry)

    data = WaitlistEntryUpdate(name="Updated Name")

    result = await update_waitlist_entry(db, entry.id, data)

    assert result.name == "Updated Name"
    assert result.email == original_email
    assert result.phone_e164 == original_phone


@pytest.mark.asyncio
async def test_update_ignores_explicit_none_values(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)

    data = WaitlistEntryUpdate(
        name=None,
        email=None,
        phone_e164=None,
    )

    result = await update_waitlist_entry(db, entry.id, data)

    assert result is entry
    assert result.name == "Test Person"
    assert result.email == "person@example.com"
    assert result.phone_e164 == "+256701234567"

    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_returns_none_when_entry_missing(
    db: AsyncMock,
):
    db.execute.return_value = mock_result(None)

    result = await update_waitlist_entry(
        db,
        uuid4(),
        WaitlistEntryUpdate(name="Updated Name"),
    )

    assert result is None
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_rolls_back_on_error(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)
    db.commit.side_effect = RuntimeError("Commit failed")

    with pytest.raises(RuntimeError, match="Commit failed"):
        await update_waitlist_entry(
            db,
            entry.id,
            WaitlistEntryUpdate(name="Updated Name"),
        )

    db.rollback.assert_awaited_once()


# ------------------------------------------------------------------
# REMOVE PHONE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_remove_waitlist_phone_clears_all_phone_fields(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)

    result = await remove_waitlist_phone(db, entry.id)

    assert result is entry
    assert result.phone_e164 is None
    assert result.phone_country_code is None
    assert result.phone_region is None
    assert result.phone_national is None

    db.commit.assert_awaited_once()
    db.refresh.assert_awaited_once_with(entry)


@pytest.mark.asyncio
async def test_remove_phone_returns_none_when_entry_missing(
    db: AsyncMock,
):
    db.execute.return_value = mock_result(None)

    result = await remove_waitlist_phone(db, uuid4())

    assert result is None
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_remove_phone_rolls_back_on_error(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)
    db.commit.side_effect = RuntimeError("Commit failed")

    with pytest.raises(RuntimeError, match="Commit failed"):
        await remove_waitlist_phone(db, entry.id)

    db.rollback.assert_awaited_once()


# ------------------------------------------------------------------
# DELETE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_delete_waitlist_entry(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)

    result = await delete_waitlist_entry(db, entry.id)

    assert result is True
    db.delete.assert_awaited_once_with(entry)
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_returns_false_when_entry_missing(
    db: AsyncMock,
):
    db.execute.return_value = mock_result(None)

    result = await delete_waitlist_entry(db, uuid4())

    assert result is False
    db.delete.assert_not_awaited()
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_delete_rolls_back_on_error(
    db: AsyncMock,
    entry: WaitlistEntry,
):
    db.execute.return_value = mock_result(entry)
    db.delete.side_effect = RuntimeError("Delete failed")

    with pytest.raises(RuntimeError, match="Delete failed"):
        await delete_waitlist_entry(db, entry.id)

    db.rollback.assert_awaited_once()
