import uuid
from sqlalchemy import Column, String, Numeric, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    value = Column(Numeric(12, 2), nullable=True)
    category = Column(String, nullable=True)
    description = Column(String, nullable=True)
    type = Column(String, default="expense")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status_processamento = Column(String, default="pendente")