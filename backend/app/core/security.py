from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from app.core.config import settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated = "auto")

#gerar hash da senha
def get_password_hash(password):
    return pwd_context.hash(password)

#verifica se a senha pura bate com o hash salvo no banco
def verify_password(plain_pwd: str, hashed_pwd: str) -> bool:
    return pwd_context.verify(plain_pwd, hashed_pwd)

#cria um token temporario para login
def create_token_access(dados):
    payload = dados.copy()
    expiration = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload.update({"exp": expiration})
    return jwt.encode(payload, settings.SECRET_KEY, settings.ALGORITHM)