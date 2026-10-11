from datetime import datetime
from uuid import UUID

import phonenumbers
from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


class WaitlistEntryCreate(BaseModel):
    email: EmailStr
    name: str | None = Field(default=None, max_length=255)
    phone_e164: str | None = Field(default=None, max_length=16)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return str(value).strip().lower()

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        return value or None

    @field_validator("phone_e164")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None or not value.strip():
            return None

        value = value.strip()

        if not value.startswith("+"):
            raise ValueError("Include the international country calling code.")

        try:
            parsed = phonenumbers.parse(value, None)
        except phonenumbers.NumberParseException as exc:
            raise ValueError("A valid international phone number is required.") from exc

        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("The phone number is not valid.")

        return phonenumbers.format_number(
            parsed,
            phonenumbers.PhoneNumberFormat.E164,
        )


class WaitlistEntryUpdate(BaseModel):
    email: EmailStr | None = None
    name: str | None = Field(default=None, max_length=255)
    phone_e164: str | None = Field(default=None, max_length=16)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr | None) -> str | None:
        if value is None:
            return None

        return str(value).strip().lower()

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        return value or None

    @field_validator("phone_e164")
    @classmethod
    def validate_phone(cls, value: str | None) -> str | None:
        if value is None or not value.strip():
            return None

        value = value.strip()

        if not value.startswith("+"):
            raise ValueError("Include the international country calling code.")

        try:
            parsed = phonenumbers.parse(value, None)
        except phonenumbers.NumberParseException as exc:
            raise ValueError("A valid international phone number is required.") from exc

        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("The phone number is not valid.")

        return phonenumbers.format_number(
            parsed,
            phonenumbers.PhoneNumberFormat.E164,
        )


class WaitlistEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    name: str | None
    phone_country_code: str | None
    phone_region: str | None
    phone_national: str | None
    phone_e164: str | None
    created_at: datetime
