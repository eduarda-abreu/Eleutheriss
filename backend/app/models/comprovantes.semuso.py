import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base  # ajuste o import conforme sua estrutura


class TipoArquivo(str, enum.Enum):
    JPG = "JPG"
    PNG = "PNG"
    PDF = "PDF"


class StatusProcessamento(str, enum.Enum):
    PENDENTE = "PENDENTE"
    PROCESSANDO = "PROCESSANDO"
    CONCLUIDO = "CONCLUIDO"
    ERRO = "ERRO"


class Comprovante(Base):
    __tablename__ = "comprovantes"

    id = Column(Integer, primary_key=True, index=True)
    usuaria_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    arquivo_url = Column(String, nullable=False)
    tipo_arquivo = Column(Enum(TipoArquivo), nullable=False)  # RN1: JPG, PNG ou PDF
    valor = Column(Float, nullable=True)
    categoria = Column(String, nullable=True)
    data_registro = Column(DateTime, default=datetime.utcnow, nullable=False)
    status_processamento = Column(
        Enum(StatusProcessamento),
        default=StatusProcessamento.PENDENTE,
        nullable=False
    )

    usuaria = relationship("Usuario", back_populates="comprovantes")