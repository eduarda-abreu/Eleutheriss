import uuid, datetime, enum
from sqlalchemy import Column, String, Numeric, DateTime, Enum, Uuid
from app.core.database import Base
import enum

class finance_profile(enum.Enum):
        STARTER ='iniciante'
        INTERMEDIATE = 'intermediario'
        ADVANCED = 'avancado'

class User(Base):
        __tablename__ = 'users'

        # id = UUID, chave primária, gerado automaticamente
        id = Column(Uuid, primary_key=True, default=uuid.uuid4)
        
        # nome = texto, máximo 100 caracteres
        nome = Column(String(100), nullable=False)
        
        # email = texto, único, tem índice
        email = Column(String, unique=True, index=True, nullable=False)
        
        # senha_hash = texto
        senha_hash = Column(String, nullable=False)
        
        # perfil_financeiro = Enum, padrão INICIANTE
        perfil_financeiro = Column(Enum(finance_profile), default=finance_profile.STARTER)
        
        # renda_mensal = número decimal, pode ser nulo
        renda_mensal = Column(Numeric, nullable=True)
        
        # criado_em = data e hora, preenchido automaticamente
        # Usamos timezone.utc para evitar problemas de fuso horário no servidor
        criado_em = Column(DateTime, default=lambda: datetime.now(datetime.timezone.utc))
