import numpy as np
import cv2
from PIL import Image
import pytesseract
from abc import ABC, abstractmethod

# Configuração do caminho do executável do Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract\tesseract.exe'


class BaseOCRService(ABC):
    """
    Classe base abstrata para serviços de OCR.
    Princípio L (Liskov) e I (Interface Segregation).
    Qualquer implementação pode substituir esta sem quebrar o sistema.
    """

    @abstractmethod
    def extract_text(self, image_bytes: bytes) -> str:
        """Extrai texto de uma imagem. Deve ser implementado."""
        pass


class OCRService(BaseOCRService):  # ← só adiciona o BaseOCRService aqui
    """
    Serviço de OCR usando OpenCV + Tesseract.
    Lê o texto de imagens de comprovantes.
    """

    def preprocess(self, image_bytes: bytes) -> np.ndarray:
        """
        Prepara a imagem para o OCR.
        Otimizado para prints de tela e documentos digitais limpos.
        """
        arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Zoom de 2x — Tesseract funciona melhor com letras maiores
        resized = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

        return resized

    def extract_text(self, image_bytes: bytes) -> str:
        """Extrai o texto de uma imagem de comprovante."""
        processed_img = self.preprocess(image_bytes)
        pil_img = Image.fromarray(processed_img)

        # lang="por" reconhece acentos e símbolos monetários
        text = pytesseract.image_to_string(pil_img, lang="por")

        return text.strip()


# Instância única — fácil de trocar para GoogleVisionOCRService em produção
ocr_service: BaseOCRService = OCRService()