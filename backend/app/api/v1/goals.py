from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalResponse, GoalProgress
from app.services.goal_service import goal_service

router = APIRouter(prefix="/goals")

USER_ID = "4dea455b-8886-4d03-98b2-3268f9de9829"


@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(data: GoalCreate, db: Session = Depends(get_db)):
    """SM-42 — Cria uma nova meta."""
    return goal_service.create(db=db, data=data, user_id=USER_ID)


@router.get("/", response_model=list[GoalResponse])
def list_goals(db: Session = Depends(get_db)):
    """SM-52 — Lista todas as metas da usuária."""
    return goal_service.get_all(db=db, user_id=USER_ID)


@router.get("/progress", response_model=list[GoalProgress])
def goals_progress(db: Session = Depends(get_db)):
    """SM-45 / SM-53 — Retorna o progresso de cada meta."""
    return goal_service.get_progress(db=db, user_id=USER_ID)


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, data: GoalUpdate, db: Session = Depends(get_db)):
    """SM-43 — Edita uma meta."""
    return goal_service.update(db=db, goal_id=goal_id, data=data, user_id=USER_ID)


@router.delete("/{goal_id}")
def delete_goal(goal_id: str, db: Session = Depends(get_db)):
    """SM-43 — Exclui uma meta."""
    return goal_service.delete(db=db, goal_id=goal_id, user_id=USER_ID)