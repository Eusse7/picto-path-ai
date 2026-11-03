from fastapi import APIRouter
from .formula import compute_judging
from .schemas import JudgingMetrics, JudgingResult

router = APIRouter(prefix="/games/judging", tags=["Judging Game"])


@router.post("/submit", response_model=JudgingResult, summary="Calcular Judging Score del laberinto")
def submit_judging(metrics: JudgingMetrics) -> JudgingResult:
    return compute_judging(metrics)
