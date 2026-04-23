import uuid
from sqlalchemy import Column, String, Numeric, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum

class incomes(Base):
    __tablename__ = 'incomes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userid = Column(UUID(as_uuid = True), forgein_key = true, nullable = false)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    pwd_hash = Column(String, nullable=False)
    financial_profile = Column(Enum(FinancialProfile), default=FinancialProfile.BEGINNER)
    monthly_income = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())