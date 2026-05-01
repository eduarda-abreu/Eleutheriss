# llm_service.py
# Responsável por interpretar o texto extraído pelo OCR e transformar em dados estruturados usando IA (GPT).

# O OCR extrai texto bruto, mas não sabe o que é valor, data ou categoria. O LLM (Large Language Model) interpreta esse texto e organiza os dados. 


from decimal import Decimal
from datetime import date
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.core.config import settings


class ExtractedTransaction(BaseModel):
    """
    Structured format that the LLM must return.

    Pydantic ensures the LLM response always has
    these fields with these types — no manual parsing needed.
    """
    value: Decimal          # e.g.: 47.90
    description: str        # e.g.: "Mercado Silva"
    date: date | None       # e.g.: 2025-04-10 (None if not found)
    category: str           # e.g.: "Food"
    type: str               # "income" or "expense"
    confidence: float       # 0.0 to 1.0 — model certainty


# Prompt enviado ao GPT com o texto do comprovante . As chaves {variavel} são preenchidas dinamicamente
PROMPT = ChatPromptTemplate.from_template("""
You are a financial assistant specialized in Brazilian receipts.

From the text below, automatically extracted from a receipt,
identify the financial information and return a structured JSON.

Rules:
- If it looks like a purchase or payment → type = "expense"
- If it looks like a deposit, received PIX or salary → type = "income"
- For category use only: Food, Transport, Health,
  Housing, Leisure, Education, Clothing, Investment or Others
- If you cannot identify a field → use null
- confidence should reflect how clear the text was (0.0 to 1.0)

Receipt text:
{ocr_text}
""")


class LLMService:
    """
    Classification service using LLM (Large Language Model).

    Receives raw text from OCR and returns a structured transaction.
    """

    def __init__(self):
        # Inicializa o modelo GPT temperature=0 → respostas consistentes (sem criatividade)
        # Para extração de dados queremos sempre o mesmo comportamento
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=settings.OPENAI_API_KEY
        )

         # with_structured_output força o retorno no formato TransacaoExtraida
        # O LangChain usa function calling por baixo dos panos
        self.chain = PROMPT | self.llm.with_structured_output(ExtractedTransaction)

    def classify_receipt(self, ocr_text: str) -> ExtractedTransaction:
        """
        Interprets OCR text and returns a structured transaction.

        Example:
        Input: "PIX RECEIVED\\nR$ 1,500.00\\nSender: Maria\\n06/05/2025"

        Output: ExtractedTransaction(
            value=1500.00,
            description="PIX received from Maria",
            date=date(2025, 5, 6),
            category="Others",
            type="income",
            confidence=0.95
        )

        Args:
            ocr_text: raw text extracted by OCR

        Returns:
            transaction with structured data
        """
        return self.chain.invoke({"ocr_text": ocr_text})


# Instância única compartilhada em todo o projeto
llm_service = LLMService()