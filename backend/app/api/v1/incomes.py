from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_income_service, get_ocr_service, get_llm_service
from app.schemas.income_schema import IncomeCreate, IncomeResponse
from app.services.income_service import IncomeService
from app.services.ocr_service import BaseOCRService
from app.services.llm_service import BaseLLMService
from app.models.incomes import Income

router = APIRouter(prefix="/incomes")

ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024


@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    data: IncomeCreate,
    db: Session = Depends(get_db),
    service: IncomeService = Depends(get_income_service)
):
    """Registra renda manualmente."""
    user_id = "6a96d725-8495-4175-8a82-793b679fd77c"
    return service.create(db=db, data=data, user_id=user_id)


@router.get("/", response_model=list[IncomeResponse])
def get_incomes(
    db: Session = Depends(get_db),
    service: IncomeService = Depends(get_income_service)
):
    """Retorna todas as rendas da usuária."""
    user_id = "6a96d725-8495-4175-8a82-793b679fd77c"
    return service.get_all(db=db, user_id=user_id)


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_income_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    ocr: BaseOCRService = Depends(get_ocr_service),
    llm: BaseLLMService = Depends(get_llm_service),
    service: IncomeService = Depends(get_income_service)
):
    """
    SM-34 — Registra renda via foto com OCR.
    Extrai o valor da imagem e salva como renda.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported format. Use JPG, PNG or PDF.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(400, "File too large. Maximum: 10MB.")

    # Extrai texto via OCR
    if file.content_type != "application/pdf":
        text = ocr.extract_text(file_bytes)
    else:
        text = "PDF received."

    # Classifica via LLM
    extracted = llm.classify_receipt(text)

    # Salva como renda no banco
    from datetime import date
    user_id = "6a96d725-8495-4175-8a82-793b679fd77c"

    new_income = Income(
        user_id=user_id,
        value=extracted.value if extracted.value else 0,
        description=extracted.description or file.filename,
        is_recurrent=False,
        date=extracted.date or date.today()
    )

    db.add(new_income)
    db.commit()
    db.refresh(new_income)

    return {
        "message": "Income registered successfully!",
        "filename": file.filename,
        "extracted": extracted.model_dump(),
        "income_id": str(new_income.id)
    }