from pydantic import BaseModel
from decimal import Decimal
from datetime import date
from typing import Optional
from uuid import UUID


class GoalCreate(BaseModel):
    title: str
    target_value: Decimal
    monthly_value: Decimal
    deadline: Optional[date] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_value: Optional[Decimal] = None
    monthly_value: Optional[Decimal] = None
    deadline: Optional[date] = None


class GoalResponse(BaseModel):
    id: UUID
    title: str
    target_value: Decimal
    monthly_value: Decimal
    deadline: Optional[date] = None

    class Config:
        from_attributes = True


# SM-45 / SM-53 — resposta de progresso
class GoalProgress(BaseModel):
    id: UUID
    title: str
    target_value: float
    saved_value: float        # quanto já economizou
    percent: float            # % atingido
    remaining: float          # quanto falta
    on_track: bool            # está no ritmo?
    status: str               # "no ritmo" | "atrasada" | "concluída"