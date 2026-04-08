import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
import enum

class PerfilFinanceiro(enum.Enum):
    INICIANTE = 'iniciante'
    INTERMEDIARIO = 'intermediario'
    AVANCADO = 'avancado'

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    pwd_hash = Column(String, nullable=False)
    perfil_financeiro = Column(Enum(PerfilFinanceiro), default=PerfilFinanceiro.INICIANTE)
    renda_mensal = Column(Numeric(12, 2), nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())