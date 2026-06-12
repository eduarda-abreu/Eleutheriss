import uuid
from sqlalchemy import Column, String, Numeric, DateTime, Date, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)                   # ex: "Reserva de emergência"
    target_value = Column(Numeric(12, 2), nullable=False)    # quanto quer juntar
    monthly_value = Column(Numeric(12, 2), nullable=False)   # quanto pretende guardar/mês
    deadline = Column(Date, nullable=True)                   # data alvo (opcional)
    created_at = Column(DateTime(timezone=True), server_default=func.now())