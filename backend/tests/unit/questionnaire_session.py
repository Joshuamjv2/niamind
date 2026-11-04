
import pytest
from pydantic import ValidationError

from api.services.questionnaires.schemas import (
    QuestionnaireSessionCreate,
)


def test_session_accepts_valid_questionnaire_id():
    data = QuestionnaireSessionCreate(
        questionnaire_id="12345678-1234-5678-1234-567812345678",
    )

    assert str(data.questionnaire_id) == "12345678-1234-5678-1234-567812345678"
    assert data.name is None
    assert data.email is None


def test_session_accepts_optional_name_and_email():
    data = QuestionnaireSessionCreate(
        questionnaire_id="12345678-1234-5678-1234-567812345678",
        name="Alex",
        email="alex@example.com",
    )

    assert data.name == "Alex"
    assert data.email == "alex@example.com"


def test_session_rejects_invalid_questionnaire_id():
    with pytest.raises(ValidationError):
        QuestionnaireSessionCreate(
            questionnaire_id="not-a-uuid",
        )


def test_session_rejects_name_longer_than_255_characters():
    with pytest.raises(ValidationError):
        QuestionnaireSessionCreate(
            questionnaire_id="12345678-1234-5678-1234-567812345678",
            name="a" * 256,
        )


def test_session_accepts_missing_optional_fields():
    data = QuestionnaireSessionCreate(
        questionnaire_id="12345678-1234-5678-1234-567812345678",
    )

    assert data.name is None
    assert data.email is None
