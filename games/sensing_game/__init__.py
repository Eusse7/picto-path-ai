"""
Paquete games.sensing_game
=========================
Módulo modular de Percepción Sensorial (Sensing Score) para Picto-Path AI.
"""

from games.sensing_game.formula import calculate_sensing_score
from games.sensing_game.classifier import predict_mbti_personality
from games.sensing_game.rag_advice import generate_evidence_advice
from games.sensing_game.router import router as sensing_router

__all__ = [
    "calculate_sensing_score",
    "predict_mbti_personality",
    "generate_evidence_advice",
    "sensing_router"
]

