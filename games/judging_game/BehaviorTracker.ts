import { Dir, Metrics, Scenario } from './types';

/** Registra QUÉ hace la persona (tiempo, pasos, retrocesos, desvíos). No juzga: solo mide. */
export class BehaviorTracker {
  planTime = 0; steps = 0; revisits = 0; bonus = 0;
  dirCounts: Record<Dir, number> = { U: 0, D: 0, L: 0, R: 0 };
  private visited = new Set<string>(['0,0']);
  private tPlan = 0; private t0 = 0;

  startPlanning() { this.tPlan = performance.now(); }
  endPlanning() { this.t0 = performance.now(); this.planTime = (this.t0 - this.tPlan) / 1000; }
  recordMove(d: Dir, x: number, y: number) {
    this.steps++; this.dirCounts[d]++;
    const k = `${x},${y}`;
    if (this.visited.has(k)) this.revisits++; else this.visited.add(k);
  }
  recordBonus() { this.bonus++; }
  elapsed() { return (performance.now() - this.t0) / 1000; }

  snapshot(sc: Scenario, optimalSteps: number, completed: boolean): Metrics {
    return {
      scenarioId: sc.id, scenarioPrior: sc.prior,
      planTime: this.planTime, totalTime: this.elapsed(),
      steps: this.steps, optimalSteps, revisits: this.revisits,
      bonusCollected: this.bonus, bonusTotal: sc.bonusCount,
      dirCounts: { ...this.dirCounts }, completed,
    };
  }
}
