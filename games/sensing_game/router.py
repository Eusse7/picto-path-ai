"""
Router de FastAPI para el Minijuego de Sensing Score
===================================================
Endpoints:
    GET  /game-challenge  -> Metadatos del desafío psicométrico
    POST /calculate       -> Cálculo en vivo de la fórmula de Sensing
    POST /predict-mbti    -> Clasificación de las 16 personalidades
    POST /advice          -> Recomendaciones científicas RAG
"""

from fastapi import APIRouter
from games.sensing_game.schemas import (
    SensingCalculateRequest,
    SensingCalculateResponse,
    PersonalityPredictionRequest,
    PersonalityPredictionResponse,
    AdviceRequest,
    AdviceResponse
)
from games.sensing_game.formula import calculate_sensing_score
from games.sensing_game.classifier import predict_mbti_personality
from games.sensing_game.rag_advice import generate_evidence_advice

router = APIRouter()

@router.get("/game-challenge", summary="Obtener metadatos del desafío visual de Sensing")
def get_game_challenge():
    """Retorna los parámetros de calibración psicométrica para el juego de diferencias."""
    return {
        "title": "Desafío Psicométrico: Encuentra las 5 Diferencias",
        "time_limit_seconds": 15,
        "ideal_time_seconds": 4.0,
        "alpha_error_penalty": 0.5,
        "beta_time_penalty": 0.45,
        "differences_count": 5,
        "scenarios": [
            {"id": "tech", "title": "Nivel 1: Oficina de Desarrollo"},
            {"id": "adventure", "title": "Nivel 2: Paisaje de Aventura"},
            {"id": "lab", "title": "Nivel 3: Laboratorio Científico"},
            {"id": "studio", "title": "Nivel 4: Estudio de Arte & Diseño"}
        ]
    }

@router.post("/calculate", response_model=SensingCalculateResponse, summary="Calcular Sensing Score con la fórmula psicométrica")
def api_calculate_sensing(req: SensingCalculateRequest):
    """Calcula el Sensing Score (0.0 a 10.0) aplicando penalizaciones de demora y error."""
    return calculate_sensing_score(
        hits=req.hits,
        errors=req.errors,
        time_seconds=req.time_seconds,
        ideal_time=req.ideal_time,
        alpha=req.alpha,
        beta=req.beta
    )

@router.post("/predict-mbti", response_model=PersonalityPredictionResponse, summary="Clasificar personalidad MBTI con las 4 dimensiones")
def api_predict_mbti(req: PersonalityPredictionRequest):
    """Clasifica al usuario en uno de los 16 tipos MBTI a partir de sus 4 puntajes y demográficos."""
    return predict_mbti_personality(
        age=req.age,
        gender=req.gender,
        education=req.education,
        interest=req.interest,
        introversion_score=req.introversion_score,
        sensing_score=req.sensing_score,
        thinking_score=req.thinking_score,
        judging_score=req.judging_score
    )

@router.post("/advice", response_model=AdviceResponse, summary="Generar 3 consejos psicológicos basados en evidencia (RAG)")
def api_get_advice(req: AdviceRequest):
    """Genera recomendaciones profesionales y de regulación emocional para el perfil MBTI predicho."""
    return generate_evidence_advice(
        personality_type=req.predicted_personality,
        sensing_score=req.sensing_score
    )

