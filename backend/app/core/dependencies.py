# Segue o princípio D — endpoints dependem de abstrações,não de implementações concretas.
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from app.core.database import SessionLocal
from app.core.config import settings
from app.services.income_service import IncomeService
from app.services.ocr_service import BaseOCRService, OCRService
from app.services.llm_service import BaseLLMService, LLMService

http_bearer = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
) -> str:
    """Decodifica o JWT e retorna o user_id (sub) da usuária autenticada."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id

def get_income_service() -> IncomeService:

    return IncomeService()

def get_ocr_service() -> BaseOCRService:

    return OCRService()

def get_llm_service() -> BaseLLMService:

    return LLMService()