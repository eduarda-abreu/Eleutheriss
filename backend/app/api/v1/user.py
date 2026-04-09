from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.schemas.user_schema import UserCreate, UserResponse
from app.services.user_service import user_service
from app.core.dependencies import get_db

router = APIRouter(prefix="/auth", tags=["autenticação"])

@router.post("/cadastro", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_usuaria(user_in: UserCreate, db: Session = Depends(get_db)):
    new_user = user_service.cadastrar(db=db, dados=user_in)
    return new_user