# Princípio S: não tem lógica de negócio.
# Princípio D: recebe dependências via Depends(), não cria.
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_income_service
from app.schemas.income_schema import IncomeCreate, IncomeResponse
from app.services.income_service import IncomeService
router = APIRouter(prefix="/incomes", tags=["Incomes"])

@router.post("/", response_model=IncomeResponse,
status_code=status.HTTP_201_CREATED)
def create_income(
    data: IncomeCreate,
    db: Session = Depends(get_db),
    service: IncomeService = Depends(get_income_service) # D aplicado!
):


    user_id = "4dea455b-8886-4d03-98b2-3268f9de9829"
    return service.create(db=db, data=data, user_id=user_id)

@router.get("/", response_model=list[IncomeResponse])
def get_incomes(
    db: Session = Depends(get_db),
    service: IncomeService = Depends(get_income_service) # D aplicado!
):
    user_id = "6a96d725-8495-4175-8a82-793b679fd77c"
    return service.get_all(db=db, user_id=user_id)