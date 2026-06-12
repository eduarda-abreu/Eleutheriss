from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import extract
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_db
from app.models.incomes import Income
from app.models.transaction import Transaction
from app.schemas.dashboard_schema import CategorySummary, DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardResponse, summary="Resumo financeiro do mês corrente")
def get_dashboard(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    """
    RF4 – Visualizar Dashboard Financeiro (US4).

    Retorna para o mês corrente:
    - **total_receitas**: soma de todas as rendas (RN1)
    - **total_despesas**: soma de todos os gastos via comprovante (RN1)
    - **saldo**: total_receitas − total_despesas (RN1)
    - **categorias**: gastos agrupados por categoria (RN2)

    Requer autenticação via Bearer token.
    """
    hoje = date.today()
    mes_atual = hoje.month
    ano_atual = hoje.year

    # RN1 — receitas do mês corrente filtradas pela usuária autenticada
    rendas = (
        db.query(Income)
        .filter(
            Income.user_id == user_id,
            extract("month", Income.date) == mes_atual,
            extract("year", Income.date) == ano_atual,
        )
        .all()
    )
    total_receitas = sum(Decimal(str(r.value)) for r in rendas)

    # RN1 — despesas do mês corrente filtradas por type == "expense"
    transacoes = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "expense",
            extract("month", Transaction.created_at) == mes_atual,
            extract("year", Transaction.created_at) == ano_atual,
        )
        .all()
    )
    total_despesas = sum(
        Decimal(str(t.value)) for t in transacoes if t.value is not None
    )

    saldo = total_receitas - total_despesas

    # RN2 — gastos agrupados por categoria
    categorias_map: dict[str, Decimal] = {}
    for t in transacoes:
        if t.value is None:
            continue
        cat = t.category or "Outros"
        categorias_map[cat] = categorias_map.get(cat, Decimal("0")) + Decimal(str(t.value))

    categorias = [
        CategorySummary(category=cat, total=total)
        for cat, total in sorted(categorias_map.items())
    ]

    return DashboardResponse(
        total_receitas=total_receitas,
        total_despesas=total_despesas,
        saldo=saldo,
        categorias=categorias,
    )
