import numpy as np
import cv2
import pytesseract
from PIL import Image


class OCRService:
    """
    OCR (Optical Character Recognition) Service.

    Reads text from receipt images using OpenCV for
    image preprocessing and Tesseract for text extraction.
    """

    def preprocess(self, image_bytes: bytes) -> np.ndarray:
        """
        Improves image quality before OCR processing.

        Receipt photos often have problems like:
        - Uneven lighting (shadows, reflections)
        - Colored or textured backgrounds
        - Slight blur

        This method converts the image to black and white
        using adaptive thresholding, which works well even
        with uneven lighting.

        Args:
            image_bytes: raw bytes from the uploaded image

        Returns:
            preprocessed black and white image ready for OCR
        """

        # Converte bytes → array numpy (formato que o OpenCV entende)
        arr = np.frombuffer(image_bytes, np.uint8)

        # Decodifica como imagem colorida (BGR = azul, verde, vermelho)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

        # Converte para escala de cinza, pois o OCR funciona melhor sem informação de cor
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        
        # Binarização adaptativa: transforma cada pixel em preto ou branco
        # "Adaptativa" porque analisa regiões da imagem separadamente,funcionando bem mesmo com iluminação irregular
        thresh = cv2.adaptiveThreshold(
            gray,
            255,                              # max value (white)
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,   # gaussian mean per region
            cv2.THRESH_BINARY,                # above threshold → white
            11,                               # region size (11x11 pixels)
            2                                 # fine-tuning constant
        )

        return thresh

    def extract_text(self, image_bytes: bytes) -> str:
        """
        Extracts text from a receipt image.

        Flow:
        1. Preprocesses image to improve quality
        2. Runs Tesseract OCR
        3. Returns raw extracted text

        Args:
            image_bytes: raw bytes from the uploaded image

        Returns:
            raw text extracted from the image
            e.g.: "MERCADO SILVA\\nR$ 47,90\\n10/04/2025"
        """

       
        processed_img = self.preprocess(image_bytes)

        # Converte array numpy → PIL Image (pytesseract aceita PIL Image, não numpy diretamente)
        pil_img = Image.fromarray(processed_img)

        # Extrai o texto com Tesseract lang="por" = dicionário em português (melhora ç, ã, é...)
        text = pytesseract.image_to_string(pil_img, lang="por")

        # strip() remove espaços e quebras de linha extras
        return text.strip()


 #Instância única compartilhada em todo o projeto. Evita criar um objeto novo a cada requisição
ocr_service = OCRService()