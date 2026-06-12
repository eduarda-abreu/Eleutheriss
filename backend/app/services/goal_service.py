from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import date

from app.models.goal import Goal
from app.models.transaction import Transaction
from app.models.incomes import Income
from app.schemas.goal_schema import GoalCreate, GoalUpdate


class GoalService:
    """SM-42/43/45/53 — CRUD de metas e cálculo de progresso.
    Single Responsibility: toda a regra de negócio de metas mora aqui."""

    # ---- helper reutilizável (DRY): total economizado da usuária ----
    def _total_economizado(self, db: Session, user_id: str) -> float:
        rendas = db.query(Income).filter(Income.user_id == user_id).all()
        transacoes = db.query(Transaction).filter(Transaction.user_id == user_id).all()

        total_renda = sum(float(r.value or 0) for r in rendas) + sum(
            float(t.value or 0) for t in transacoes if t.type == "income"
        )
        total_gastos = sum(
            float(t.value or 0) for t in transacoes if t.type == "expense"
        )
        # o "economizado" é o saldo positivo disponível
        return max(total_renda - total_gastos, 0.0)

    # ---- CRUD ----
    def create(self, db: Session, data: GoalCreate, user_id: str) -> Goal:
        goal = Goal(
            user_id=user_id,
            title=data.title,
            target_value=data.target_value,
            monthly_value=data.monthly_value,
            deadline=data.deadline,
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)
        return goal

    def get_all(self, db: Session, user_id: str):
        return db.query(Goal).filter(Goal.user_id == user_id).all()

    def get_one(self, db: Session, goal_id: str, user_id: str) -> Goal:
        goal = db.query(Goal).filter(
            Goal.id == goal_id, Goal.user_id == user_id
        ).first()
        if not goal:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Meta não encontrada.")
        return goal

    def update(self, db: Session, goal_id: str, data: GoalUpdate, user_id: str) -> Goal:
        goal = self.get_one(db, goal_id, user_id)
        if data.title is not None:
            goal.title = data.title
        if data.target_value is not None:
            goal.target_value = data.target_value
        if data.monthly_value is not None:
            goal.monthly_value = data.monthly_value
        if data.deadline is not None:
            goal.deadline = data.deadline
        db.commit()
        db.refresh(goal)
        return goal

    def delete(self, db: Session, goal_id: str, user_id: str):
        goal = self.get_one(db, goal_id, user_id)
        db.delete(goal)
        db.commit()
        return {"message": "Meta excluída com sucesso!"}

    # ---- SM-45 / SM-53: cálculo de progresso ----
    def get_progress(self, db: Session, user_id: str):
        goals = self.get_all(db, user_id)
        economizado = self._total_economizado(db, user_id)

        resultado = []
        for g in goals:
            alvo = float(g.target_value)
            # quanto dessa meta já está coberto pelo economizado
            saved = min(economizado, alvo)
            percent = round((saved / alvo) * 100, 1) if alvo > 0 else 0.0
            remaining = round(alvo - saved, 2)

            # projeção de ritmo: dá pra bater até a deadline?
            on_track = True
            status_txt = "no ritmo"
            if percent >= 100:
                status_txt = "concluída"
            elif g.deadline:
                meses_restantes = max(
                    (g.deadline.year - date.today().year) * 12
                    + (g.deadline.month - date.today().month),
                    0,
                )
                necessario_por_mes = remaining / meses_restantes if meses_restantes > 0 else remaining
                on_track = float(g.monthly_value) >= necessario_por_mes
                status_txt = "no ritmo" if on_track else "atrasada"

            resultado.append({
                "id": g.id,
                "title": g.title,
                "target_value": round(alvo, 2),
                "saved_value": round(saved, 2),
                "percent": percent,
                "remaining": remaining,
                "on_track": on_track,
                "status": status_txt,
            })
        return resultado


goal_service = GoalService()