from pydantic import BaseModel, EmailStr, ConfigDict, field_validator, model_validator
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator('name')
    @classmethod
    def validate_name(cls, value: str):
        clean_name = value.strip()
        if len(clean_name) < 2:
            raise ValueError("Name must have at least 2 characters.")
        return clean_name

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str):
        if len(value) < 12:
            raise ValueError("Password must have at least 12 characters.")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one number.")
        return value

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginData(BaseModel):
    email: EmailStr
    password: str