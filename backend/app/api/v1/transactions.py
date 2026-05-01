# transactions.py
# Responsável por receber o upload de comprovantes (JPG, PNG, PDF)
# e salvar as informações no banco de dados.

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# Tipos de arquivo aceitos conforme RN1 da SM-6
TIPOS_PERMITIDOS = {"image/jpeg", "image/png", "application/pdf"}

# Tamanho máximo: 10MB em bytes
TAMANHO_MAXIMO = 10 * 1024 * 1024


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_comprovante(
    arquivo: UploadFile = File(...),  # UploadFile é o tipo do FastAPI para arquivos
    db: Session = Depends(get_db)
):
    """
    Recebe o upload de um comprovante de gasto.

    Valida:
    - Tipo do arquivo (JPG, PNG ou PDF)
    - Tamanho máximo de 10MB

    Retorna:
    - Mensagem de sucesso e nome do arquivo recebido
    """

    # Passo 1: valida o tipo do arquivo
    # content_type é enviado pelo navegador junto com o arquivo
    # Ex: "image/jpeg", "image/png", "application/pdf"
    if arquivo.content_type not in TIPOS_PERMITIDOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Formato não suportado. Envie JPG, PNG ou PDF."
        )

    # Passo 2: lê os bytes do arquivo
    # await é necessário porque a leitura é assíncrona (não trava o servidor)
    bytes_arquivo = await arquivo.read()

    # Passo 3: valida o tamanho
    if len(bytes_arquivo) > TAMANHO_MAXIMO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Arquivo muito grande. Tamanho máximo: 10MB."
        )

    # Passo 4: retorna confirmação
    return {
        "mensagem": "Comprovante recebido com sucesso!",
        "nome_arquivo": arquivo.filename,
        "tipo": arquivo.content_type,
        "tamanho_bytes": len(bytes_arquivo)
    }