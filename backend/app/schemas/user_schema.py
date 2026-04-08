from pydantic import BaseModel, EmailStr, ConfigDict, field_validator, model_validator
from uuid import UUID
from datetime import datetime


class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    confirmar_senha: str

    # Validação do Nome
    @field_validator('nome')
    @classmethod
    def validar_nome(cls, value: str):
        nome_limpo = value.strip() # Remove espaços em branco no início e no fim
        if len(nome_limpo) < 2:
            raise ValueError("O nome é muito curto. Precisa ter pelo menos 2 caracteres.")
        return nome_limpo

    # Validação da Senha
    @field_validator('senha')
    @classmethod
    def validar_senha(cls, value: str):
        if len(value) < 8:
            raise ValueError("A senha deve ter pelo menos 8 caracteres.")
        if not any(char.isdigit() for char in value):
            raise ValueError("A senha precisa conter pelo menos um número.")
        return value

    # Validação do Modelo Inteiro (Comparar as duas senhas)
    @model_validator(mode='after')
    def checar_senhas_coincidem(self):
        if self.senha != self.confirmar_senha:
            raise ValueError("As senhas não coincidem.")
        return self


class UserResponse(BaseModel):
    id: UUID
    nome: str
    email: EmailStr
    criado_em: datetime
    
    # Permite que o Pydantic leia os dados do SQLAlchemy sem dar erro
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"