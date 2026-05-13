# 1. Escolhemos uma versão do Python para ser a base
FROM python:3.11-slim

# 2. Instalamos as ferramentas que não são do Python (Tesseract e dependências de imagem)
# O "apt-get" é como o instalador do Linux
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-por \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean

# 3. Criamos uma pasta dentro do servidor para colocar seu código
WORKDIR /app

# 4. Copiamos o seu requirements.txt para lá e instalamos as bibliotecas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiamos o restante de todos os seus arquivos do projeto para o servidor
COPY . .

# 6. O comando que liga a sua API
# Usamos a variável $PORT que o Render fornece automaticamente
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]