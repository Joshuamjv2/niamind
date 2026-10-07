import uuid
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from api.services.authentication.user.models import User
    from api.services.waitlist.models import WaitlistEntry

from datetime import datetime, timezone

from sqlalchemy import (
    ARRAY,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Questionnaire(Base):
    __tablename__ = "questionnaires"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    slug: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True,
        index=True,
    )

    label: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    version: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    questions: Mapped[list["Question"]] = relationship(
        "Question",
        back_populates="questionnaire",
        order_by="Question.order",
        cascade="all, delete-orphan",
    )

    sessions: Mapped[list["QuestionnaireSession"]] = relationship(
        "QuestionnaireSession",
        back_populates="questionnaire",
    )


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    questionnaire_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "questionnaires.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Stable semantic identifier.
    # Examples: "working_on", "focus_areas".
    key: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    # Actual question displayed to the respondent.
    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    placeholder: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # text | multiselect | single_select
    type: Mapped[str] = mapped_column(
        String,
        nullable=False,
        default="text",
    )

    options: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )

    order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    questionnaire: Mapped["Questionnaire"] = relationship(
        "Questionnaire",
        back_populates="questions",
    )

    answers: Mapped[list["Answer"]] = relationship(
        "Answer",
        back_populates="question",
    )


class QuestionnaireSession(Base):
    __tablename__ = "questionnaire_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    questionnaire_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "questionnaires.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # Existing registered user.
    # NULL for anonymous or waitlist respondents.
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    # Waitlist participant.
    # NULL for anonymous or registered-user respondents.
    waitlist_entry_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "waitlist_entries.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

    completed_gate: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    questionnaire: Mapped["Questionnaire"] = relationship(
        "Questionnaire",
        back_populates="sessions",
    )

    user: Mapped["User | None"] = relationship(
        "User",
        back_populates="questionnaire_sessions",
    )

    waitlist_entry: Mapped["WaitlistEntry | None"] = relationship(
        "WaitlistEntry",
        back_populates="questionnaire_sessions",
    )

    answers: Mapped[list["Answer"]] = relationship(
        "Answer",
        back_populates="session",
        cascade="all, delete-orphan",
    )


class Answer(Base):
    __tablename__ = "answers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "questionnaire_sessions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "questions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    answer_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    answer_array: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    session: Mapped["QuestionnaireSession"] = relationship(
        "QuestionnaireSession",
        back_populates="answers",
    )

    question: Mapped["Question"] = relationship(
        "Question",
        back_populates="answers",
    )
