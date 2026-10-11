from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from api.services.questionnaires.exceptions import (
    QuestionnaireNotFoundError,
    QuestionnaireSlugConflictError,
)
from api.services.questionnaires.models import Questionnaire
from api.services.questionnaires.schemas import (
    QuestionnaireCreate,
    QuestionnaireUpdate,
)
from api.services.questionnaires.services.questionnaire import (
    create_questionnaire,
    delete_questionnaire,
    get_questionnaire,
    get_questionnaire_by_slug,
    get_questionnaire_detail,
    get_questionnaire_detail_by_slug,
    list_questionnaires,
    update_questionnaire,
)

# Registers the WaitlistEntry mapper. Instantiating Questionnaire configures every
# mapper, and QuestionnaireSession points at WaitlistEntry by name.
from api.services.waitlist.models import WaitlistEntry  # noqa: F401


@pytest.fixture
def db() -> AsyncMock:
    session = AsyncMock(spec=AsyncSession)
    session.add = MagicMock()
    session.get = AsyncMock()
    session.scalar = AsyncMock(return_value=None)
    session.execute = AsyncMock()
    session.commit = AsyncMock()
    session.rollback = AsyncMock()
    session.refresh = AsyncMock()
    session.delete = AsyncMock()
    return session


@pytest.fixture
def questionnaire() -> Questionnaire:
    return Questionnaire(
        id=uuid4(),
        slug="waitlist-intake",
        label="Waitlist intake",
        version=1,
        is_active=True,
    )


def mock_result(scalar_one_or_none=None):
    result = MagicMock()
    result.scalar_one_or_none.return_value = scalar_one_or_none
    return result


def integrity_error() -> IntegrityError:
    return IntegrityError("INSERT ...", {}, Exception("duplicate key"))


# ------------------------------------------------------------------
# CREATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_create_questionnaire(db: AsyncMock):
    data = QuestionnaireCreate(slug="  Waitlist-Intake ", label="Waitlist intake")

    result = await create_questionnaire(db, data)

    assert isinstance(result, Questionnaire)
    assert result.slug == "waitlist-intake"
    assert result.label == "Waitlist intake"
    assert result.version == 1
    assert result.is_active is True

    db.add.assert_called_once_with(result)
    db.commit.assert_awaited_once()
    db.refresh.assert_awaited_once_with(result)


@pytest.mark.asyncio
async def test_create_raises_conflict_when_slug_exists(db: AsyncMock):
    db.scalar.return_value = uuid4()

    data = QuestionnaireCreate(slug="waitlist-intake", label="Waitlist intake")

    with pytest.raises(QuestionnaireSlugConflictError):
        await create_questionnaire(db, data)

    db.add.assert_not_called()
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_create_maps_integrity_error_to_conflict(db: AsyncMock):
    # Another request inserted the same slug between the check and the commit.
    db.commit.side_effect = integrity_error()

    data = QuestionnaireCreate(slug="waitlist-intake", label="Waitlist intake")

    with pytest.raises(QuestionnaireSlugConflictError):
        await create_questionnaire(db, data)

    db.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_create_rolls_back_on_database_error(db: AsyncMock):
    db.commit.side_effect = RuntimeError("Database failure")

    data = QuestionnaireCreate(slug="waitlist-intake", label="Waitlist intake")

    with pytest.raises(RuntimeError, match="Database failure"):
        await create_questionnaire(db, data)

    db.rollback.assert_awaited_once()


# ------------------------------------------------------------------
# RETRIEVE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_questionnaire_returns_questionnaire(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire

    result = await get_questionnaire(db, questionnaire.id)

    assert result is questionnaire
    db.get.assert_awaited_once_with(Questionnaire, questionnaire.id)


@pytest.mark.asyncio
async def test_get_questionnaire_raises_when_missing(db: AsyncMock):
    db.get.return_value = None

    with pytest.raises(QuestionnaireNotFoundError):
        await get_questionnaire(db, uuid4())


@pytest.mark.asyncio
async def test_get_questionnaire_detail_returns_questionnaire(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.execute.return_value = mock_result(questionnaire)

    result = await get_questionnaire_detail(db, questionnaire.id)

    assert result is questionnaire
    db.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_get_questionnaire_detail_raises_when_missing(db: AsyncMock):
    db.execute.return_value = mock_result(None)

    with pytest.raises(QuestionnaireNotFoundError):
        await get_questionnaire_detail(db, uuid4())


@pytest.mark.asyncio
async def test_get_questionnaire_by_slug_normalizes_slug(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.execute.return_value = mock_result(questionnaire)

    result = await get_questionnaire_by_slug(db, "  WAITLIST-INTAKE  ")

    assert result is questionnaire

    statement = db.execute.await_args.args[0]
    assert statement.compile().params["slug_1"] == "waitlist-intake"


@pytest.mark.asyncio
async def test_get_questionnaire_by_slug_raises_when_missing(db: AsyncMock):
    db.execute.return_value = mock_result(None)

    with pytest.raises(QuestionnaireNotFoundError):
        await get_questionnaire_by_slug(db, "missing")


@pytest.mark.asyncio
async def test_get_questionnaire_detail_by_slug_normalizes_slug(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.execute.return_value = mock_result(questionnaire)

    result = await get_questionnaire_detail_by_slug(db, "  WAITLIST-INTAKE  ")

    assert result is questionnaire

    statement = db.execute.await_args.args[0]
    assert statement.compile().params["slug_1"] == "waitlist-intake"


@pytest.mark.asyncio
async def test_get_questionnaire_detail_by_slug_raises_when_missing(db: AsyncMock):
    db.execute.return_value = mock_result(None)

    with pytest.raises(QuestionnaireNotFoundError):
        await get_questionnaire_detail_by_slug(db, "missing")


# ------------------------------------------------------------------
# LIST
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_list_questionnaires(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    result_mock = MagicMock()
    result_mock.scalars.return_value.all.return_value = [questionnaire]
    db.execute.return_value = result_mock

    result = await list_questionnaires(db, limit=10, offset=0)

    assert result == [questionnaire]
    db.execute.assert_awaited_once()


@pytest.mark.asyncio
async def test_list_questionnaires_returns_empty_list(db: AsyncMock):
    result_mock = MagicMock()
    result_mock.scalars.return_value.all.return_value = []
    db.execute.return_value = result_mock

    result = await list_questionnaires(db)

    assert result == []


@pytest.mark.asyncio
async def test_list_questionnaires_without_filter_has_no_where_clause(db: AsyncMock):
    result_mock = MagicMock()
    result_mock.scalars.return_value.all.return_value = []
    db.execute.return_value = result_mock

    await list_questionnaires(db)

    statement = db.execute.await_args.args[0]
    assert "WHERE" not in str(statement)


@pytest.mark.parametrize("is_active", [True, False])
@pytest.mark.asyncio
async def test_list_questionnaires_filters_by_active_status(
    db: AsyncMock,
    is_active: bool,
):
    result_mock = MagicMock()
    result_mock.scalars.return_value.all.return_value = []
    db.execute.return_value = result_mock

    await list_questionnaires(db, is_active=is_active)

    statement = db.execute.await_args.args[0]
    assert "WHERE" in str(statement)


# ------------------------------------------------------------------
# UPDATE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_update_questionnaire_changes_label(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire

    result = await update_questionnaire(
        db,
        questionnaire.id,
        QuestionnaireUpdate(label="Updated label"),
    )

    assert result is questionnaire
    assert result.label == "Updated label"

    db.commit.assert_awaited_once()
    db.refresh.assert_awaited_once_with(questionnaire)


@pytest.mark.asyncio
async def test_update_preserves_omitted_fields(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire

    result = await update_questionnaire(
        db,
        questionnaire.id,
        QuestionnaireUpdate(label="Updated label"),
    )

    assert result.slug == "waitlist-intake"
    assert result.version == 1
    assert result.is_active is True


@pytest.mark.asyncio
async def test_update_can_deactivate_questionnaire(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    # False must not be dropped by the exclude_none filter.
    db.get.return_value = questionnaire

    result = await update_questionnaire(
        db,
        questionnaire.id,
        QuestionnaireUpdate(is_active=False),
    )

    assert result.is_active is False
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_ignores_explicit_none_values(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire

    result = await update_questionnaire(
        db,
        questionnaire.id,
        QuestionnaireUpdate(label=None, slug=None, version=None, is_active=None),
    )

    assert result is questionnaire
    assert result.label == "Waitlist intake"
    assert result.slug == "waitlist-intake"
    assert result.is_active is True

    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_raises_when_questionnaire_missing(db: AsyncMock):
    db.get.return_value = None

    with pytest.raises(QuestionnaireNotFoundError):
        await update_questionnaire(
            db,
            uuid4(),
            QuestionnaireUpdate(label="Updated label"),
        )

    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_raises_conflict_when_new_slug_in_use(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire
    db.scalar.return_value = uuid4()

    with pytest.raises(QuestionnaireSlugConflictError):
        await update_questionnaire(
            db,
            questionnaire.id,
            QuestionnaireUpdate(slug="other-slug"),
        )

    assert questionnaire.slug == "waitlist-intake"
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_update_skips_slug_check_when_slug_unchanged(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire

    await update_questionnaire(
        db,
        questionnaire.id,
        QuestionnaireUpdate(slug="waitlist-intake", label="Updated label"),
    )

    db.scalar.assert_not_awaited()
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_maps_integrity_error_to_conflict(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire
    db.commit.side_effect = integrity_error()

    with pytest.raises(QuestionnaireSlugConflictError):
        await update_questionnaire(
            db,
            questionnaire.id,
            QuestionnaireUpdate(slug="other-slug"),
        )

    db.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_update_rolls_back_on_error(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire
    db.commit.side_effect = RuntimeError("Commit failed")

    with pytest.raises(RuntimeError, match="Commit failed"):
        await update_questionnaire(
            db,
            questionnaire.id,
            QuestionnaireUpdate(label="Updated label"),
        )

    db.rollback.assert_awaited_once()


# ------------------------------------------------------------------
# DELETE
# ------------------------------------------------------------------


@pytest.mark.asyncio
async def test_delete_questionnaire(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire

    result = await delete_questionnaire(db, questionnaire.id)

    assert result is None
    db.delete.assert_awaited_once_with(questionnaire)
    db.commit.assert_awaited_once()


@pytest.mark.asyncio
async def test_delete_raises_when_questionnaire_missing(db: AsyncMock):
    db.get.return_value = None

    with pytest.raises(QuestionnaireNotFoundError):
        await delete_questionnaire(db, uuid4())

    db.delete.assert_not_awaited()
    db.commit.assert_not_awaited()


@pytest.mark.asyncio
async def test_delete_rolls_back_on_error(
    db: AsyncMock,
    questionnaire: Questionnaire,
):
    db.get.return_value = questionnaire
    db.delete.side_effect = RuntimeError("Delete failed")

    with pytest.raises(RuntimeError, match="Delete failed"):
        await delete_questionnaire(db, questionnaire.id)

    db.rollback.assert_awaited_once()
