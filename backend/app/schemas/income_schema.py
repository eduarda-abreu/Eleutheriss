# income_schema.py
# Responsável APENAS pela validação dos dados de renda.
# Segue o princípio S — não mistura lógica de negócio.
from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from uuid import UUID

class IncomeCreate(BaseModel):
    value: Decimal
    description: str
    is_recurrent: bool = False
    date: date

class IncomeResponse(BaseModel):
    id: UUID
    user_id: UUID
    value: Decimal
    description: str
    is_recurrent: bool
    date: date
    model_config = {"from_attributes": True}