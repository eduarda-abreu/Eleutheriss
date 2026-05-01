from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.services.ocr_service import ocr_service
from app.services.llm_service import llm_service

router = APIRouter(prefix="/transactions", tags=["Transactions"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB in bytes


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Receives a receipt upload, extracts text via OCR
    and classifies data via LLM.

    Flow:
    1. Validates file type and size
    2. OCR extracts text from image
    3. LLM interprets and structures the data
    4. Returns the identified transaction
    """

    # Step 1: validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported format. Please upload JPG, PNG or PDF."
        )

    # Step 2: read file bytes
    file_bytes = await file.read()

    # Step 3: validate file size
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size: 10MB."
        )

    # Step 4: extract text via OCR (images only)
    if file.content_type != "application/pdf":
        text = ocr_service.extract_text(file_bytes)
    else:
        text = "PDF received — PDF processing coming soon."

    # Step 5: classify via LLM
    transaction = llm_service.classify_receipt(text)

    return {
        "message": "Receipt processed successfully!",
        "filename": file.filename,
        "transaction": transaction.model_dump()
    }