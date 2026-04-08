from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user_schema import UserCreate # O nome que demos para a UsuariaCadastro no arquivo anterior
from app.core.security import get_password_hash # A função do seu security.py

class UserService:

    def buscar_por_email(self, db: Session, email: str):
        # Vai no banco, filtra pelo email e pega o primeiro resultado
        return db.query(User).filter(User.email == email).first()

    def cadastrar(self, db: Session, dados: UserCreate):
        # 1. Verifica se a usuária já existe chamando a função de cima
        usuario_existente = self.buscar_por_email(db, dados.email)
        
        if usuario_existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, # 409 significa "Conflito" de dados
                detail="Este e-mail já está cadastrado."
            )
        
        # 2. Gera o hash da senha
        hash_senha = get_password_hash(dados.senha)
        
        # 3. Monta o modelo para o banco de dados
        nova_usuaria = User(
            nome=dados.nome,
            email=dados.email.lower(), # Garante que o e-mail fique todo minúsculo
            pwd_hash =hash_senha # Usando o nome exato da coluna que você colocou no Model
        )
        
        # 4. Salva no banco
        db.add(nova_usuaria)
        db.commit()
        db.refresh(nova_usuaria)
        
        return nova_usuaria

# Cria uma instância única do serviço para ser usada no resto do projeto
user_service = UserService()