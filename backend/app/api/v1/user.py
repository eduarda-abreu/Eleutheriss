from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserResponse, LoginData, Token
from app.services.user_service import user_service
from app.core.dependencies import get_db

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    return user_service.register(db=db, data=data)


@router.post("/login", response_model=Token)
def login_user(data: LoginData, db: Session = Depends(get_db)):
    return user_service.login(db=db, data=data)