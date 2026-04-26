from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.models.incomes import Income
from pydantic import BaseModel, condecimal
from datetime import date

router = APIRouter(prefix="/rendas", tags=["Rendas"])

class IncomeCreate(BaseModel):
    value: condecimal(ge=0.01, decimal_places=2)
    description: str
    is_recurrent: bool = False # Ajuste aqui também!
    date: date

# Endpoint POST
@router.post("/", status_code=status.HTTP_201_CREATED)
async def criar_renda(
    renda: IncomeCreate, 
    db: Session = Depends(get_db)
    # TODO: current_user = Depends(get_current_user) -> Ativaremos na integração do JWT
):
    try:
        # Pega os dados do schema e cria o objeto do banco
        db_renda = Income(
            user_id="6a96d725-8495-4175-8a82-793b679fd77c", 
            **renda.model_dump()           
        )
        
        db.add(db_renda)
        db.commit()
        db.refresh(db_renda)
        
        return db_renda
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao salvar renda: {str(e)}")