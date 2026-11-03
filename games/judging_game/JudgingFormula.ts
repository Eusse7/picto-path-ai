import { Metrics, ScoreBreakdown } from './types';

/**
 * Judging Score (0-10)
 *   JS = 10 · ( 0.20·P + 0.20·E + 0.15·C + 0.15·F + 0.10·O + 0.20·S )
 *
 * P Planificación = min(t_plan / 15s, 1)
 * E Eficiencia    = pasos_óptimos / pasos_reales            (path efficiency)
 * C Compromiso    = 1 − celdas_repetidas / pasos            (decide y no se devuelve)
 * F Foco          = 1 − recompensas_opcionales / total      (no se desvía)
 * O Orden         = 1 − H / 2,  H = −Σ p·log2(p)            (entropía de Shannon de las direcciones)
 * S Escenario     = prior del escenario elegido (0-1)
 */
export const WEIGHTS = { planning: .20, efficiency: .20, commitment: .15, focus: .15, order: .10, scenario: .20 };
export const PLAN_REF_SECONDS = 15;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export function shannonEntropy(counts: Record<string, number>): number {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  return -Object.values(counts).filter(c => c > 0).reduce((s, c) => s + (c / total) * Math.log2(c / total), 0);
}

export function computeJudging(m: Metrics): ScoreBreakdown {
  const planning = clamp(m.planTime / PLAN_REF_SECONDS);
  const efficiency = m.steps > 0 ? clamp(m.optimalSteps / m.steps) : 0;
  const commitment = m.steps > 0 ? clamp(1 - m.revisits / m.steps) : 0;
  const focus = m.bonusTotal > 0 ? clamp(1 - m.bonusCollected / m.bonusTotal) : 1;
  const order = clamp(1 - shannonEntropy(m.dirCounts) / 2); // 2 bits = máximo con 4 direcciones
  const scenario = clamp(m.scenarioPrior);
  const w = WEIGHTS;
  const score = 10 * (w.planning * planning + w.efficiency * efficiency + w.commitment * commitment
    + w.focus * focus + w.order * order + w.scenario * scenario);
  return { planning, efficiency, commitment, focus, order, scenario, score: Math.round(score * 10) / 10 };
}
