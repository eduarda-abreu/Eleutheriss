# Segue o princípio D — endpoints dependem de abstrações,não de implementações concretas.
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.income_service import IncomeService
from app.services.ocr_service import BaseOCRService, TesseractOCRService
from app.services.llm_service import BaseLLMService, OpenAILLMService

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_income_service() -> IncomeService:

    return IncomeService()

def get_ocr_service() -> BaseOCRService:

    return TesseractOCRService()

def get_llm_service() -> BaseLLMService:

    return OpenAILLMService()