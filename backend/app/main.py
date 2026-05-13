from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import user, incomes, transactions, dashboard

# 1. Configuração da API (Aparece no Swagger/Docs)
app = FastAPI(
    title="Eleutheriss API",
    description="Plataforma de gestão e educação financeira para mulheres.",
    version="1.0.0",
    contact={
        "name": "Eduarda Abreu",
        "url": "https://github.com/eduarda-abreu",
    }
)

# 2. Configuração de CORS (O "Porteiro" da API)
# O asterisco "*" permite que a Vercel (ou qualquer outro site) consiga 
# mandar a foto do comprovante para o Render sem ser bloqueada.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Inclusão das Rotas
# O prefix="/api/v1" organiza os caminhos, e as tags deixam a sua 
# documentação (/docs) separada por "pastinhas" e bem profissional.
app.include_router(user.router, prefix="/api/v1", tags=["Autenticação & Usuárias"])
app.include_router(incomes.router, prefix="/api/v1", tags=["Rendas"])
app.include_router(transactions.router, prefix="/api/v1", tags=["Transações"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])

# 4. Endpoint Raiz (Para testar se a API está viva)
@app.get("/", tags=["Root"])
def read_root():
    return {
        "status": "online",
        "mensagem": "Bem-vinda à API do Eleutheriss, Eduarda!",
        "documentacao": "/docs"
    }