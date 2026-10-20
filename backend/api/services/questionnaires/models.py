import uuid
from datetime import datetime, timezone

from sqlalchemy import ARRAY, Boolean, DateTime, ForeignKey, Index, Integer, String, Text
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
        cascade="all, delete-orphan",
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

    # Stable semantic identifier, e.g. "working_on", "focus_areas".
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

    # Supported types: text, multiselect, single_select.
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

    __table_args__ = (
        # Fast lookup "has this email answered this questionnaire?"
        Index("ix_questionnaire_sessions_qid_email", "questionnaire_id", "email"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
    )

    questionnaire_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("questionnaires.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Participant identity — optional at the row level so anonymous
    # sessions remain possible; the public flow can require them.
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True, index=True)

    completed_gate: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    questionnaire: Mapped["Questionnaire"] = relationship("Questionnaire", back_populates="sessions")
    answers: Mapped[list["Answer"]] = relationship(
        "Answer", back_populates="session", cascade="all, delete-orphan",
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
