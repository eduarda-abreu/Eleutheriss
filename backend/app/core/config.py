from pydantic_settings import BaseSettings

class Settings(BaseSettings):  
    DATABASE_URL: str        
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    OPENAI_API_KEY: str = ""   
    REDIS_URL: str = ""     

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()