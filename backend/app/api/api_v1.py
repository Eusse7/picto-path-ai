from fastapi import APIRouter
from app.api.endpoints import health, test_flow, games

api_router = APIRouter()

api_router.include_router(health.router, tags=["Salud"])
api_router.include_router(test_flow.router, prefix="/test", tags=["Test Vocacional"])
api_router.include_router(games.router)
