from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.security import get_user_id_from_token
from app.models.transaction import Transaction
from app.models.incomes import Income

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/resumo")
def get_resumo(
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    """
    Retorna o resumo financeiro da usuária logada.
    SM-37 — cálculo de saldo e agrupamento por categoria.
    """

    # Pega o user_id do token JWT
    if not authorization:
        raise HTTPException(status_code=401, detail="Token não fornecido.")

    try:
        token = authorization.replace("Bearer ", "")
        user_id = get_user_id_from_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")

    transacoes = db.query(Transaction).filter(
        Transaction.user_id == user_id
    ).all()

    rendas = db.query(Income).filter(
        Income.user_id == user_id
    ).all()

    total_gastos = sum(
        float(t.value or 0) for t in transacoes
        if t.type == "expense"
    )

    total_renda = sum(float(r.value) for r in rendas) + sum(
        float(t.value or 0) for t in transacoes if t.type == "income"
    )

    saldo = total_renda - total_gastos

    categorias: dict = {}
    for t in transacoes:
        if t.type == "expense":
            cat = t.category or "Outros"
            categorias[cat] = categorias.get(cat, 0) + float(t.value or 0)

    movimentacoes = []

    for t in transacoes[-10:]:
        movimentacoes.append({
            "date": str(t.created_at)[:10] if t.created_at else "",
            "description": t.description or "Comprovante",
            "category": t.category or "Outros",
            "amount": float(t.value or 0) if t.type == "income" else -float(t.value or 0),
            "type": "Economia" if t.type == "income" else "Gasto"
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