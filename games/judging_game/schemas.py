from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class JudgingMetrics(BaseModel):
    """Datos crudos del laberinto (el frontend los envía en camelCase)."""
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    scenario_id: str
    scenario_prior: float
    plan_time: float
    total_time: float
    steps: int
    optimal_steps: int
    revisits: int
    bonus_collected: int
    bonus_total: int
    dir_counts: dict[str, int]
    completed: bool


class JudgingResult(BaseModel):
    planning: float
    efficiency: float
    commitment: float
    focus: float
    order: float
    scenario: float
    judging_score: float  # 0-10, lo que consume el modelo de ML
