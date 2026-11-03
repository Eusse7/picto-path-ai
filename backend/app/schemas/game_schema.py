from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel


GameId = Literal["introversion", "sensing", "thinking", "judging"]


class GameResultSubmission(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    game_id: GameId
    score: float = Field(..., ge=0.0, le=10.0)
    metrics: dict[str, Any] = Field(default_factory=dict)
    answers: list[dict[str, Any]] = Field(default_factory=list)


class GameResultResponse(BaseModel):
    session_id: str
    game_id: GameId
    score: float
    stored: bool = True


class AssessmentSubmission(BaseModel):
    session_id: str | None = None
    age: float = Field(..., ge=0.0, le=120.0)
    gender: str = Field(..., min_length=1, max_length=80)
    education: int = Field(..., ge=0, le=10)
    interest: str = Field(..., min_length=1, max_length=160)
    scores: dict[GameId, float] = Field(default_factory=dict)
    game_results: list[GameResultSubmission] = Field(default_factory=list)

    @field_validator("scores")
    @classmethod
    def validate_scores(cls, scores: dict[GameId, float]) -> dict[GameId, float]:
        invalid = {key: value for key, value in scores.items() if not 0 <= value <= 10}
        if invalid:
            raise ValueError(f"Los puntajes deben estar entre 0 y 10: {invalid}")
        return scores


class AssessmentResponse(BaseModel):
    session_id: str
    scores: dict[str, float]
    predicted_mbti: str
    personality_name: str
    confidence: float | None = None
    source: str


class SensingGameSubmission(BaseModel):
    hits: int = Field(..., ge=0, le=5)
    errors: int = Field(..., ge=0)
    time_seconds: float = Field(..., ge=0.0)
    ideal_time: float = Field(4.0, ge=0.0)
    alpha: float = Field(0.5, ge=0.0)
    beta: float = Field(0.45, ge=0.0)


class JudgingGameSubmission(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    scenario_id: str
    scenario_prior: float = Field(..., ge=0.0, le=1.0)
    plan_time: float = Field(..., ge=0.0)
    total_time: float = Field(..., ge=0.0)
    steps: int = Field(..., ge=0)
    optimal_steps: int = Field(..., ge=0)
    revisits: int = Field(..., ge=0)
    bonus_collected: int = Field(..., ge=0)
    bonus_total: int = Field(..., ge=0)
    dir_counts: dict[str, int] = Field(default_factory=dict)
    completed: bool
