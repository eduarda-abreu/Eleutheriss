
# Princípio S: só recebe, valida e retorna.
# Princípio D: OCR e LLM são injetados via Depends().
# O endpoint depende de abstrações, não de implementações.
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.orm import Session
from decimal import Decimal
from pydantic import BaseModel
from app.core.dependencies import get_db, get_ocr_service, get_llm_service
from app.services.ocr_service import BaseOCRService
from app.services.llm_service import BaseLLMService
from app.models.transaction import Transaction
router = APIRouter(prefix="/transactions")
ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024 # 10MB

class TransactionSave(BaseModel):
    value: Decimal
    category: str
    description: str = ""
    type: str = "expense"

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    ocr: BaseOCRService = Depends(get_ocr_service), # D: abstração!
    llm: BaseLLMService = Depends(get_llm_service), # D: abstração!
):

# Valida tipo do arquivo (RN1 da SM-6)
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, 'Unsupported format. Use JPG, PNG or PDF.')
    
    file_bytes = await file.read()
    
    # Valida tamanho máximo
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(400, 'File too large. Maximum: 10MB.')

    # Extrai texto via OCR (usa a abstração BaseOCRService)
    if file.content_type != 'application/pdf':
        text = ocr.extract_text(file_bytes)
    else:
        text = 'PDF received.'
        # Classifica via LLM (usa a abstração BaseLLMService)
    transaction = llm.classify_receipt(text)
    return {
    'message': 'Receipt processed successfully!',
    'filename': file.filename,
    'transaction': transaction.model_dump()
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def save_transaction(
data: TransactionSave,
db: Session = Depends(get_db)
):
    '''Salva a transação confirmada pela usuária.'''
    user_id = "6a96d725-8495-4175-8a82-793b679fd77c"
    new_transaction = Transaction(
    user_id=user_id,
    value=data.value,
    category=data.category,
    description=data.description,
    type=data.type,
    status_processamento='concluido'
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return {'message': 'Transaction saved!', 'id': str(new_transaction.id)}