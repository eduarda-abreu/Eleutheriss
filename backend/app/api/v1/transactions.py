from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends, Header
from sqlalchemy.orm import Session
from decimal import Decimal
from pydantic import BaseModel
from app.core.dependencies import get_db, get_ocr_service, get_llm_service
from app.core.security import get_user_id_from_token
from app.services.ocr_service import BaseOCRService
from app.services.llm_service import BaseLLMService
from app.models.transaction import Transaction

router = APIRouter(prefix="/transactions")

ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024


class TransactionSave(BaseModel):
    value: Decimal
    category: str
    description: str = ""
    type: str = "expense"


def get_user_id(authorization: str = Header(None)) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido.")
    try:
        token = authorization.replace("Bearer ", "")
        return get_user_id_from_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    ocr: BaseOCRService = Depends(get_ocr_service),
    llm: BaseLLMService = Depends(get_llm_service),
    user_id: str = Depends(get_user_id)
):
    """Recebe upload, extrai texto via OCR e classifica via LLM."""
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported format. Use JPG, PNG or PDF.")

    file_bytes = await file.read()

    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(400, "File too large. Maximum: 10MB.")

    if file.content_type != "application/pdf":
        text = ocr.extract_text(file_bytes)
    else:
        text = "PDF received."

    transaction = llm.classify_receipt(text)

    return {
        "message": "Receipt processed successfully!",
        "filename": file.filename,
        "transaction": transaction.model_dump()
    }


@router.post("/", status_code=status.HTTP_201_CREATED)
def save_transaction(
    data: TransactionSave,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_user_id)
):
    """Salva a transação confirmada pela usuária."""
    new_transaction = Transaction(
        user_id=user_id,
        value=data.value,
        category=data.category,
        description=data.description,
        type=data.type,
        status_processamento="concluido"
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return {"message": "Transaction saved!", "id": str(new_transaction.id)}