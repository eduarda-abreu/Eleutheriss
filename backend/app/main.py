from fastapi import FastAPI
from app.api.v1 import user 

app = FastAPI(
    title="Eleutheriss API",
    description="Plataforma de gestão e educação financeira para mulheres.",
    version="1.0.0"
)

app.include_router(user.router) 

@app.get("/")
def read_root():
    return {"mensagem": "Bem-vinda à API do Eleutheriss!"}