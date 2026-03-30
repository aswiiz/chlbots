import fitz # PyMuPDF
import docx
from bs4 import BeautifulSoup
import httpx
from typing import Optional

class FileService:
    @staticmethod
    async def extract_pdf_text(file_content: bytes) -> str:
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text

    @staticmethod
    async def extract_docx_text(file_content: bytes) -> str:
        import io
        f = io.BytesIO(file_content)
        doc = docx.Document(f)
        text = [para.text for para in doc.paragraphs]
        return "\n".join(text)

    @staticmethod
    async def extract_txt_text(file_content: bytes) -> str:
        return file_content.decode("utf-8")

    @staticmethod
    async def extract_url_text(url: str) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "lxml")
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            text = soup.get_text(separator="\n", strip=True)
            return text

file_service = FileService()
