from decimal import Decimal
from datetime import date
from abc import ABC, abstractmethod
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings


class ExtractedTransaction(BaseModel):
    """Structured format that the LLM must return."""
    value: Decimal = Field(default=Decimal("0.0"))
    description: str
    date: date | None
    category: str
    type: str
    confidence: float


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
- CRITICAL: If you cannot find the transaction value, return 0.0 as a number. Never return the string 'null' for the value field.
- confidence should reflect how clear the text was (0.0 to 1.0)

Receipt text:
{ocr_text}
""")


class BaseLLMService(ABC):
    """
    Classe base abstrata para serviços de classificação por IA.
    Princípio L (Liskov) e I (Interface Segregation).
    Permite trocar Gemini por OpenAI ou Groq sem mudar nenhum endpoint.
    """

    @abstractmethod
    def classify_receipt(self, ocr_text: str) -> ExtractedTransaction:
        """Classifica o texto do OCR em uma transação estruturada."""
        pass


class LLMService(BaseLLMService):  # ← só adiciona o BaseLLMService aqui
    """
    Classification service using Gemini.
    Receives raw text from OCR and returns a structured transaction.
    """

    def __init__(self):
        # temperature=0 → respostas consistentes (sem criatividade)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-flash-latest",
            temperature=0,
            google_api_key=settings.GEMINI_API_KEY
        )

        # with_structured_output força o retorno no formato correto
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
        """
        return self.chain.invoke({"ocr_text": ocr_text})


# Instância única — fácil de trocar para OpenAILLMService em produção
llm_service: BaseLLMService = LLMService()