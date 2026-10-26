from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_v1 import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API para el sistema de orientación vocacional Picto-Path AI",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Permitir CORS para desarrollo con el Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Bienvenido a la API de Picto-Path AI",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
