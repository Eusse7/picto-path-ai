export type Dir = 'U' | 'D' | 'L' | 'R';
export interface Pos { x: number; y: number }
export interface Cell extends Pos { walls: Record<Dir, boolean> }

export interface Scenario {
  id: string; name: string; emoji: string; color: string;
  story: string;        // contexto que ve la persona
  objective: string;    // objetivo propio de este laberinto
  goalEmoji: string; goalCount: number; ordered: boolean; // metas obligatorias
  bonusEmoji: string; bonusCount: number;                 // recompensas opcionales (distractores)
  timeLimit: number | null;                               // segundos
  prior: number;        // 0-1: cuánto "pesa" hacia Judging elegir este escenario
}

// Datos crudos que se envían al backend
export interface Metrics {
  scenarioId: string; scenarioPrior: number;
  planTime: number; totalTime: number;
  steps: number; optimalSteps: number; revisits: number;
  bonusCollected: number; bonusTotal: number;
  dirCounts: Record<Dir, number>; completed: boolean;
}

export interface ScoreBreakdown {
  planning: number; efficiency: number; commitment: number;
  focus: number; order: number; scenario: number;
  score: number; // 0-10
}
