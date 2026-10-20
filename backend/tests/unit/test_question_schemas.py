import pytest
from pydantic import ValidationError

from api.services.questionnaires.schemas import QuestionnaireCreate


def _create(questions):
    return QuestionnaireCreate(slug="test", label="Test", questions=questions)


# --- type × options matrix ---

def test_text_question_rejects_options():
    with pytest.raises(ValidationError, match="Text questions cannot have options"):
        _create([{"key": "q", "text": "Q", "type": "text", "options": ["A"]}])


@pytest.mark.parametrize("qtype", ["single_select", "multiselect"])
def test_select_question_requires_options(qtype):
    with pytest.raises(ValidationError, match="must have at least one option"):
        _create([{"key": "q", "text": "Q", "type": qtype}])


@pytest.mark.parametrize("qtype", ["single_select", "multiselect"])
def test_select_question_accepts_options(qtype):
    payload = _create([{"key": "q", "text": "Q", "type": qtype, "options": ["A", "B"]}])
    assert payload.questions[0].options == ["A", "B"]


# --- options normalization ---

def test_options_are_stripped():
    payload = _create([
        {"key": "q", "text": "Q", "type": "single_select", "options": ["  A  ", "B  "]},
    ])
    assert payload.questions[0].options == ["A", "B"]


def test_options_rejects_blank_entries():
    with pytest.raises(ValidationError, match="cannot be blank"):
        _create([{"key": "q", "text": "Q", "type": "single_select", "options": ["A", "  "]}])
    # or [""], ["A", ""], etc.


def test_options_rejects_case_insensitive_duplicates():
    with pytest.raises(ValidationError, match="must be unique"):
        _create([{"key": "q", "text": "Q", "type": "single_select", "options": ["A", "a"]}])


def test_empty_options_list_is_normalized_to_none():
    payload = _create([{"key": "q", "text": "Q", "type": "text", "options": []}])
    assert payload.questions[0].options is None


# --- required / is_active / placeholder pass through ---

def test_question_passes_through_optional_attributes():
    payload = _create([{
        "key": "q",
        "text": "Q",
        "placeholder": "Type here…",
        "required": True,
        "is_active": False,
    }])
    q = payload.questions[0]
    assert q.placeholder == "Type here…"
    assert q.required is True
    assert q.is_active is False


# --- key / text constraints ---

def test_question_rejects_empty_key():
    with pytest.raises(ValidationError):
        _create([{"key": "", "text": "Q"}])


def test_question_rejects_empty_text():
    with pytest.raises(ValidationError):
        _create([{"key": "q", "text": ""}])


def test_question_rejects_negative_order():
    with pytest.raises(ValidationError):
        _create([{"key": "q", "text": "Q", "order": -1}])


def test_question_order_defaults_to_none_when_omitted():
    # Nested questions allow order=None — the service assigns index
    payload = _create([{"key": "q", "text": "Q"}])
    assert payload.questions[0].order is None


# --- unique keys across the array ---

def test_duplicate_keys_rejected():
    with pytest.raises(ValidationError, match="unique"):
        _create([
            {"key": "dup", "text": "A"},
            {"key": "dup", "text": "B"},
        ])


def test_duplicate_keys_are_case_sensitive():
    # or case-insensitive — depends on whether you normalize keys; the
    # schema currently doesn't, so "DUP" and "dup" are different keys
    payload = _create([
        {"key": "DUP", "text": "A"},
        {"key": "dup", "text": "B"},
    ])
    assert len(payload.questions) == 2
