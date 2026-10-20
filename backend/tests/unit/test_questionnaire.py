import pytest
from pydantic import ValidationError

from api.services.questionnaires.schemas import QuestionnaireCreate


def test_questionnaire_rejects_duplicate_question_keys():
    with pytest.raises(ValidationError, match="unique"):
        QuestionnaireCreate(
            slug="test",
            label="Test",
            questions=[
                {"key": "q1", "text": "First"},
                {"key": "q1", "text": "Second"},
            ],
        )


def test_questionnaire_rejects_invalid_slug():
    with pytest.raises(ValidationError):
        QuestionnaireCreate(slug="not a slug", label="Test")


def test_questionnaire_rejects_blank_label():
    with pytest.raises(ValidationError):
        QuestionnaireCreate(slug="test", label="   ")
