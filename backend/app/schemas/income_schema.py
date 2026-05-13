# income_schema.py
# Responsável APENAS pela validação dos dados de renda.
# Segue o princípio S — não mistura lógica de negócio.
from pydantic import BaseModel
from decimal import Decimal
from datetime import date

class IncomeCreate(BaseModel):
    value: Decimal # valor da renda (ex: 1500.00)
    description: str # descrição (ex: 'Salário')
    is_recurrent: bool = False # renda fixa ou variável
    date: date # data da renda

class IncomeResponse(BaseModel):
    id: str
    user_id: str
    value: Decimal
    description: str
    is_recurrent: bool
    date: date
    # Permite criar o schema a partir de objetos SQLAlchemy
    model_config = {"from_attributes": True}