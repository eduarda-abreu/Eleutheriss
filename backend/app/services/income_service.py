# income_service.py
# Responsável APENAS pelas regras de negócio de renda.
# O endpoint não faz mais lógica — delega para cá.
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.incomes import Income
from app.schemas.income_schema import IncomeCreate

class IncomeService:

    def create(self, db: Session, data: IncomeCreate, user_id: str) -> Income:

        try:
            # Cria o objeto de banco com os dados recebidos
            new_income = Income(
            user_id=user_id,
            value=data.value,
            description=data.description,
            is_recurrent=data.is_recurrent,
            date=data.date
            )
    # Adiciona, confirma e atualiza o objeto com dados do banco
            db.add(new_income)
            db.commit()
            db.refresh(new_income)
            return new_income
    

        except Exception as e:
            db.rollback() # desfaz em caso de erro
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,

                detail=f"Error saving income: {str(e)}"
            )

    def get_all(self, db: Session, user_id: str) -> list[Income]:
   
        return db.query(Income).filter(Income.user_id == user_id).all()

# Instância única — evita criar objeto a cada requisição
income_service = IncomeService()