import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

import phonenumbers

if TYPE_CHECKING:
    from api.services.questionaires.models import QuestionnaireSession

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from db.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class WaitlistEntry(Base):
    __tablename__ = "waitlist_entries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    email: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True,
        index=True,
    )

    name: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    # Telephone calling code, e.g. "+256".
    phone_country_code: Mapped[str | None] = mapped_column(
        String(4),
        nullable=True,
    )

    # ISO region, e.g. "UG".
    phone_region: Mapped[str | None] = mapped_column(
        String(2),
        nullable=True,
        index=True,
    )

    # National significant number, e.g. "701234567".
    phone_national: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    # Canonical E.164 number, e.g. "+256701234567".
    phone_e164: Mapped[str | None] = mapped_column(
        String(16),
        nullable=True,
        unique=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
    )

    questionnaire_sessions: Mapped[list["QuestionnaireSession"]] = relationship(
        "QuestionnaireSession",
        back_populates="waitlist_entry",
        cascade="all, delete-orphan",
    )

    @validates("phone_e164")
    def validate_and_split_phone(self, key, value):
        if value is None or not str(value).strip():
            self.phone_country_code = None
            self.phone_region = None
            self.phone_national = None

            return None

        value = str(value).strip()

        try:
            parsed_number = phonenumbers.parse(value, None)

        except phonenumbers.NumberParseException as exc:
            raise ValueError("A valid international phone number is required, including the country calling code (e.g. +256...).") from exc

        if not phonenumbers.is_valid_number(parsed_number):
            raise ValueError(f"The phone number '{value}' is not valid.")

        e164 = phonenumbers.format_number(
            parsed_number,
            phonenumbers.PhoneNumberFormat.E164,
        )

        self.phone_country_code = f"+{parsed_number.country_code}"

        self.phone_region = phonenumbers.region_code_for_number(parsed_number) or None

        self.phone_national = str(parsed_number.national_number)

        return e164
