from typing import Generator
from app.core.database import SessionLocal # Verifique se seu arquivo de banco tem esse nome

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()