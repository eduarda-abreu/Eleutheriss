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
        errors = []
            
        if len(value) < 12:
            errors.append("at least 12 characters")
        if not any(char.isdigit() for char in value):
            errors.append("at least one number")
        if not any(char.isupper() for char in value):
            errors.append("at least one uppercase letter")
        if not any(char.islower() for char in value):
            errors.append("at least one lowercase letter")
            
        if errors:
            raise ValueError(
                "Password must contain: " + ", ".join(errors)
            ) 
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