from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.models.transaction import Transaction
from app.models.incomes import Income

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

USER_ID = "6a96d725-8495-4175-8a82-793b679fd77c"


@router.get("/resumo")
def get_resumo(db: Session = Depends(get_db)):
    """
    Retorna o resumo financeiro da usuária.
    SM-37 — cálculo de saldo e agrupamento por categoria.
    """

    transacoes = db.query(Transaction).filter(
        Transaction.user_id == USER_ID
    ).all()

    rendas = db.query(Income).filter(
        Income.user_id == USER_ID
    ).all()

    total_gastos = sum(
        float(t.value) for t in transacoes
        if t.type == "expense"
    )

    total_renda = sum(float(r.value) for r in rendas)

    saldo = total_renda - total_gastos

    categorias: dict = {}
    for t in transacoes:
        if t.type == "expense":
            cat = t.category or "Outros"
            categorias[cat] = categorias.get(cat, 0) + float(t.value)

    movimentacoes = []

    for t in transacoes[-10:]:
        movimentacoes.append({
            "date": str(t.created_at)[:10] if t.created_at else "",
            "description": t.description or "Comprovante",
            "category": t.category or "Outros",
            "amount": -float(t.value),
            "type": "Gasto"
        })

    for r in rendas[-5:]:
        movimentacoes.append({
            "date": str(r.date),
            "description": r.description or "Renda",
            "category": "Renda",
            "amount": float(r.value),
            "type": "Economia"
        })

    movimentacoes.sort(key=lambda x: x["date"], reverse=True)

    return {
        "total_gastos": round(total_gastos, 2),
        "total_renda": round(total_renda, 2),
        "saldo": round(saldo, 2),
        "categorias": categorias,
        "movimentacoes": movimentacoes[:10]
    }