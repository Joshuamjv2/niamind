from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import (
    BaseModel,
    BeforeValidator,
    ConfigDict,
    Field,
    field_validator,
    model_validator,
)

# ---------------------------------------------------------------------------
# Shared types and helpers
# ---------------------------------------------------------------------------

QuestionType = Literal["text", "multiselect", "single_select"]

# Lowercase letters/digits separated by single "-" or "_" (e.g. "waitlist-intake").
SLUG_PATTERN = r"^[a-z0-9]+(?:[-_][a-z0-9]+)*$"


def _normalize_slug(value):
    return value.strip().lower() if isinstance(value, str) else value


Slug = Annotated[
    str,
    BeforeValidator(_normalize_slug),
    Field(min_length=1, max_length=255, pattern=SLUG_PATTERN),
]


def _normalize_options(options: list[str] | None) -> list[str] | None:
    """Strip options, reject blanks and duplicates, and treat [] as None."""

    if options is None:
        return None

    cleaned = [option.strip() for option in options]

    if not cleaned:
        return None

    if any(not option for option in cleaned):
        raise ValueError("Options cannot be blank.")

    if len({option.lower() for option in cleaned}) != len(cleaned):
        raise ValueError("Options must be unique.")

    return cleaned


class StrippedModel(BaseModel):
    """Base for request schemas: surrounding whitespace is stripped from strings."""

    model_config = ConfigDict(str_strip_whitespace=True)


# ---------------------------------------------------------------------------
# Question schemas
# ---------------------------------------------------------------------------


class QuestionCreate(StrippedModel):
    questionnaire_id: UUID
    key: str = Field(min_length=1, max_length=255)
    text: str = Field(min_length=1)
    placeholder: str | None = None
    type: QuestionType = "text"
    options: list[str] | None = None
    order: int = Field(ge=0)
    required: bool = False
    is_active: bool = True

    @field_validator("options")
    @classmethod
    def normalize_options(cls, value: list[str] | None) -> list[str] | None:
        return _normalize_options(value)

    @model_validator(mode="after")
    def validate_options(self) -> "QuestionCreate":
        if self.type == "text" and self.options:
            raise ValueError("Text questions cannot have options.")

        if self.type in ("multiselect", "single_select") and not self.options:
            raise ValueError("Selection questions must have at least one option.")

        return self


class QuestionUpdate(StrippedModel):
    """Partial update.

    Cross-field consistency (type vs options) depends on the existing row,
    so it is enforced in the question service, not here.
    """

    key: str | None = Field(default=None, min_length=1, max_length=255)
    text: str | None = Field(default=None, min_length=1)
    placeholder: str | None = None
    type: QuestionType | None = None
    options: list[str] | None = None
    order: int | None = Field(default=None, ge=0)
    required: bool | None = None
    is_active: bool | None = None

    @field_validator("options")
    @classmethod
    def normalize_options(cls, value: list[str] | None) -> list[str] | None:
        return _normalize_options(value)


class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    questionnaire_id: UUID
    key: str
    text: str
    placeholder: str | None
    type: QuestionType
    options: list[str] | None
    order: int
    required: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Questionnaire schemas
# ---------------------------------------------------------------------------


class QuestionnaireCreate(StrippedModel):
    slug: Slug
    label: str = Field(min_length=1, max_length=255)
    version: int = Field(default=1, ge=1)
    is_active: bool = True


class QuestionnaireUpdate(StrippedModel):
    slug: Slug | None = None
    label: str | None = Field(default=None, min_length=1, max_length=255)
    version: int | None = Field(default=None, ge=1)
    is_active: bool | None = None


class QuestionnaireResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    label: str
    version: int
    is_active: bool
    created_at: datetime


class QuestionnaireDetailResponse(QuestionnaireResponse):
    """Only serialize from a questionnaire loaded with its questions
    (see get_questionnaire_detail), otherwise async lazy loading will fail."""

    questions: list[QuestionResponse] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Questionnaire session schemas
# ---------------------------------------------------------------------------


class QuestionnaireSessionCreate(BaseModel):
    questionnaire_id: UUID
    waitlist_entry_id: UUID | None = None


class QuestionnaireSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    questionnaire_id: UUID
    waitlist_entry_id: UUID | None
    completed_gate: bool
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime


class QuestionnaireSessionComplete(BaseModel):
    completed_gate: bool = True


# ---------------------------------------------------------------------------
# Answer schemas
# ---------------------------------------------------------------------------


class AnswerPayload(BaseModel):
    question_id: UUID
    answer_text: str | None = None
    answer_array: list[str] | None = None

    @model_validator(mode="after")
    def validate_answer_value(self) -> "AnswerPayload":
        has_text = self.answer_text is not None
        has_array = self.answer_array is not None

        if has_text == has_array:
            raise ValueError("Provide exactly one of answer_text or answer_array.")

        return self


class AnswerCreate(AnswerPayload):
    pass


class AnswerUpdate(BaseModel):
    answer_text: str | None = None
    answer_array: list[str] | None = None

    @model_validator(mode="after")
    def validate_answer_value(self) -> "AnswerUpdate":
        has_text = self.answer_text is not None
        has_array = self.answer_array is not None

        if has_text == has_array:
            raise ValueError("Provide exactly one of answer_text or answer_array.")

        return self


class AnswerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    session_id: UUID
    question_id: UUID
    answer_text: str | None
    answer_array: list[str] | None
    created_at: datetime
    updated_at: datetime
