"""
Esquemas Pydantic para el Minijuego de Sensing Score & MBTI
==========================================================
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SensingCalculateRequest(BaseModel):
    hits: int = Field(..., ge=0, le=5, description="Aciertos en el juego (0 a 5)")
    errors: int = Field(..., ge=0, description="Errores cometidos")
    time_seconds: float = Field(..., ge=0.0, description="Tiempo transcurrido en segundos")
    ideal_time: float = Field(4.0, ge=1.0, description="Umbral de tiempo ideal en segundos")
    alpha: float = Field(0.5, ge=0.0, description="Penalización por error")
    beta: float = Field(0.45, ge=0.0, description="Penalización por segundo de demora")

class SensingCalculateResponse(BaseModel):
    sensing_score: float
    is_sensing_dominant: bool
    profile_label: str
    metrics: Dict[str, Any]
    summary: str

class PersonalityPredictionRequest(BaseModel):
    age: float = Field(25.0, ge=18.0, le=100.0)
    gender: str = Field("Female")
    education: int = Field(0, ge=0, le=1)
    interest: str = Field("Technology")
    introversion_score: float = Field(..., ge=0.0, le=10.0)
    sensing_score: float = Field(..., ge=0.0, le=10.0)
    thinking_score: float = Field(..., ge=0.0, le=10.0)
    judging_score: float = Field(..., ge=0.0, le=10.0)

class PersonalityPredictionResponse(BaseModel):
    predicted_personality: str
    personality_name: str
    personality_description: str
    dimensions: Dict[str, Any]
    demographics: Dict[str, Any]

class AdviceRequest(BaseModel):
    predicted_personality: str
    sensing_score: float = Field(5.0, ge=0.0, le=10.0)

class ActionableTip(BaseModel):
    domain: str
    headline: str
    recommendation: str
    evidence_basis: Optional[str] = None

class AdviceResponse(BaseModel):
    personality_type: str
    personality_title: str
    cognitive_stack: str
    system_prompt: str
    actionable_tips: List[ActionableTip]
    scientific_disclaimer: str

