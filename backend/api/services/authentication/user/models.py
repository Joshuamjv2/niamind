import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

import phonenumbers
from sqlalchemy import DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

if TYPE_CHECKING:
    from api.services.questionaires.models import QuestionnaireSession

from db.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class UserStatus(str, enum.Enum):
    PENDING = "pending"
    INACTIVE = "inactive"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    DEACTIVATED = "deactivated"
    DELETED = "deleted"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    first_name: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    last_name: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True,
        index=True,
    )

    phone_country_code: Mapped[str | None] = mapped_column(
        String(4),
        nullable=True,
    )

    phone_region: Mapped[str | None] = mapped_column(
        String(2),
        nullable=True,
        index=True,
    )

    phone_national: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    phone_e164: Mapped[str | None] = mapped_column(
        String(16),
        nullable=True,
        unique=True,
        index=True,
    )

    phone_verified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    password_hash: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus, name="user_status"),
        nullable=False,
        default=UserStatus.INACTIVE,
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

    questionnaire_sessions: Mapped[list["QuestionnaireSession"]] = relationship(
        "QuestionnaireSession",
        back_populates="user",
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
