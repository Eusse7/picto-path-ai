import math

from fastapi import APIRouter

from app.schemas.game_schema import (
    GameResultResponse,
    GameResultSubmission,
    JudgingGameSubmission,
    SensingGameSubmission,
)
from app.services.assessment_service import assessment_service

router = APIRouter(prefix="/games", tags=["Resultados de minijuegos"])


def _session(session_id: str | None) -> str:
    return session_id or assessment_service.create_session()


@router.post("/{game_id}/results", response_model=GameResultResponse)
def save_game_result(game_id: str, result: GameResultSubmission, session_id: str | None = None):
    if game_id != result.game_id:
        from fastapi import HTTPException

        raise HTTPException(status_code=422, detail="game_id de la ruta y del cuerpo no coinciden")
    target_session = _session(session_id)
    assessment_service.save_game_result(target_session, result)
    return GameResultResponse(session_id=target_session, game_id=result.game_id, score=result.score)


@router.post("/sensing/calculate")
def calculate_sensing(result: SensingGameSubmission, session_id: str | None = None):
    delay = max(0.0, result.time_seconds - result.ideal_time)
    raw_score = (min(5, result.hits) * 2.0) - (result.errors * result.alpha) - (result.beta * delay)
    score = round(max(0.0, min(10.0, raw_score)), 2)
    target_session = _session(session_id)
    assessment_service.save_game_result(
        target_session,
        GameResultSubmission(game_id="sensing", score=score, metrics=result.model_dump()),
    )
    return {"session_id": target_session, "game_id": "sensing", "score": score, "metrics": result.model_dump()}


@router.post("/judging/submit")
def submit_judging(result: JudgingGameSubmission, session_id: str | None = None):
    total_directions = sum(result.dir_counts.values())
    entropy = 0.0
    if total_directions:
        entropy = -sum(
            (count / total_directions) * math.log2(count / total_directions)
            for count in result.dir_counts.values()
            if count > 0
        )
    parts = {
        "planning": min(1.0, result.plan_time / 15.0),
        "efficiency": min(1.0, result.optimal_steps / result.steps) if result.steps else 0.0,
        "commitment": min(1.0, max(0.0, 1 - result.revisits / result.steps)) if result.steps else 0.0,
        "focus": min(1.0, max(0.0, 1 - result.bonus_collected / result.bonus_total)) if result.bonus_total else 1.0,
        "order": min(1.0, max(0.0, 1 - entropy / 2)),
        "scenario": result.scenario_prior,
    }
    score = round(10 * (0.20 * parts["planning"] + 0.20 * parts["efficiency"] + 0.15 * parts["commitment"] + 0.15 * parts["focus"] + 0.10 * parts["order"] + 0.20 * parts["scenario"]), 1)
    target_session = _session(session_id)
    assessment_service.save_game_result(target_session, GameResultSubmission(game_id="judging", score=score, metrics=result.model_dump()))
    return {"session_id": target_session, **parts, "judging_score": score}
