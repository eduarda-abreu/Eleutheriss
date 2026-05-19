from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException, Header
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_income_service, get_ocr_service, get_llm_service
from app.core.security import get_user_id_from_token
from app.schemas.income_schema import IncomeCreate, IncomeResponse
from app.services.income_service import IncomeService
from app.services.ocr_service import BaseOCRService
from app.services.llm_service import BaseLLMService
from app.models.incomes import Income
from datetime import date

router = APIRouter(prefix="/incomes")

ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024


def get_user_id(authorization: str = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido.")
    try:
        token = authorization.replace("Bearer ", "")
        return get_user_id_from_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")


@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    data: IncomeCreate,
    db: Session = Depends(get_db),
    service: IncomeService = Depends(get_income_service),
    user_id: str = Depends(get_user_id)
):
    """Registra renda manualmente."""
    return service.create(db=db, data=data, user_id=user_id)


@router.get("/", response_model=list[IncomeResponse])
def get_incomes(
    db: Session = Depends(get_db),
    service: IncomeService = Depends(get_income_service),
    user_id: str = Depends(get_user_id)
):
    """Retorna todas as rendas da usuária."""
    return service.get_all(db=db, user_id=user_id)


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_income_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    ocr: BaseOCRService = Depends(get_ocr_service),
    llm: BaseLLMService = Depends(get_llm_service),
    service: IncomeService = Depends(get_income_service),
    user_id: str = Depends(get_user_id)
):
    """SM-34 — Registra renda via foto com OCR."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported format. Use JPG, PNG or PDF.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(400, "File too large. Maximum: 10MB.")

    if file.content_type != "application/pdf":
        text = ocr.extract_text(file_bytes)
    else:
        text = "PDF received."

    extracted = llm.classify_receipt(text)

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