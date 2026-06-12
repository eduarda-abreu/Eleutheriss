from pydantic import BaseModel
from decimal import Decimal


class CategorySummary(BaseModel):
    category: str
    total: Decimal


class DashboardResponse(BaseModel):
    total_receitas: Decimal
    total_despesas: Decimal
    saldo: Decimal
    categorias: list[CategorySummary]
