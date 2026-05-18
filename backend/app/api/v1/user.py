from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.dependencies import get_db
from app.schemas.user_schema import UserCreate, UserResponse, LoginData, Token
from app.services.user_service import user_service
from app.core.security import get_password_hash

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    return user_service.register(db=db, data=data)


@router.post("/login", response_model=Token)
def login_user(data: LoginData, db: Session = Depends(get_db)):
    return user_service.login(db=db, data=data)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    new_password: str
    confirm_password: str


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(data: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    SM-48 — Solicita recuperação de senha.
    Por segurança sempre retorna a mesma mensagem
    independente de o email existir ou não.
    """
    user_service.find_by_email(db, data.email)
    return {
        "message": "If this email is registered, you will receive reset instructions."
    }


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    SM-48 — Redefine a senha da usuária.
    """
    if data.new_password != data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    user = user_service.find_by_email(db, data.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    if len(data.new_password) < 12:
        raise HTTPException(400, "Password must have at least 12 characters.")
    if not any(c.isdigit() for c in data.new_password):
        raise HTTPException(400, "Password must contain at least one number.")
    if not any(c.isupper() for c in data.new_password):
        raise HTTPException(400, "Password must contain at least one uppercase letter.")
    if not any(c.islower() for c in data.new_password):
        raise HTTPException(400, "Password must contain at least one lowercase letter.")

    user.pwd_hash = get_password_hash(data.new_password)
    db.commit()

    return {"message": "Password updated successfully!"}