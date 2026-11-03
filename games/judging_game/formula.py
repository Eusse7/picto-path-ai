"""Judging Score (0-10). Misma fórmula que frontend/JudgingFormula.ts

JS = 10 * (0.20*P + 0.20*E + 0.15*C + 0.15*F + 0.10*O + 0.20*S)
"""
import math
from .schemas import JudgingMetrics, JudgingResult

WEIGHTS = dict(planning=0.20, efficiency=0.20, commitment=0.15, focus=0.15, order=0.10, scenario=0.20)
PLAN_REF_SECONDS = 15


def _clamp(v: float) -> float:
    return max(0.0, min(1.0, v))


def shannon_entropy(counts: dict[str, int]) -> float:
    total = sum(counts.values())
    if not total:
        return 0.0
    return -sum((c / total) * math.log2(c / total) for c in counts.values() if c > 0)


def compute_judging(m: JudgingMetrics) -> JudgingResult:
    p = _clamp(m.plan_time / PLAN_REF_SECONDS)
    e = _clamp(m.optimal_steps / m.steps) if m.steps else 0.0
    c = _clamp(1 - m.revisits / m.steps) if m.steps else 0.0
    f = _clamp(1 - m.bonus_collected / m.bonus_total) if m.bonus_total else 1.0
    o = _clamp(1 - shannon_entropy(m.dir_counts) / 2)
    s = _clamp(m.scenario_prior)
    parts = dict(planning=p, efficiency=e, commitment=c, focus=f, order=o, scenario=s)
    score = 10 * sum(WEIGHTS[k] * v for k, v in parts.items())
    return JudgingResult(**parts, judging_score=round(score, 1))
