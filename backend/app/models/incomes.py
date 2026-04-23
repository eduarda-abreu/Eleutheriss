import uuid
from sqlalchemy import Boolean, Column, Date, String, Numeric, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum

class incomes(Base):
    __tablename__ = 'incomes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    value = Column(Numeric(12, 2), nullable=False)
    description = Column(String(255))
    recorrente = Column(Boolean, default=False)
    date = Column( Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())