import uuid
from sqlalchemy import Boolean, CheckConstraint, Column, String, Numeric, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum

class FinancialProfile(enum.Enum):
    BEGINNER = 'beginner'
    INTERMEDIATE = 'intermediate'
    ADVANCED = 'advanced'

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    pwd_hash = Column(String, nullable=False)
    
    is_active = Column(   Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Campos do Perfil Financeiro 
    financial_profile = Column(Enum(FinancialProfile), default=FinancialProfile.BEGINNER)
    monthly_income = Column(Numeric(12, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraints do Banco de Dados
    __table_args__ = (
        CheckConstraint("email LIKE '%@%'", name="user_email_check"),
    )