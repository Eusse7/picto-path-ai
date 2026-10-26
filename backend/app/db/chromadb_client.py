import chromadb
from app.core.config import settings

def get_chroma_client():
    """
    Retorna el cliente de ChromaDB conectado a la instancia remota o local
    """
    try:
        client = chromadb.HttpClient(
            host=settings.CHROMA_HOST,
            port=settings.CHROMA_PORT
        )
        return client
    except Exception as e:
        print(f"[Aviso] No se pudo conectar con ChromaDB en {settings.CHROMA_HOST}:{settings.CHROMA_PORT} - {e}")
        return None
