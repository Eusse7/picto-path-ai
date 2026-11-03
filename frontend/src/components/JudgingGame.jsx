import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Compass,
  Timer,
  Shield,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Calculator,
  Play,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Info,
  Flame,
  Award,
  Zap,
  Target,
  Heart
} from 'lucide-react';

/**
 * ======================================================================================
 * PICTO-PATH AI: MINIJUEGO DE JUICIO (JUDGING VS PERCEIVING)
 * LABERINTO CONDUCTUAL CON PERSONAJES Y ESTÉTICA DE PÓSTERES VISUALES
 * ======================================================================================
 */

const SIZE = 15;
const CELL = 36;
const DIRS = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0]
};
const OPP = { U: 'D', D: 'U', L: 'R', R: 'L' };
const KEYS = ['U', 'D', 'L', 'R'];

const KEYMAP = {
  ArrowUp: 'U',
  KeyW: 'U',
  w: 'U',
  W: 'U',
  ArrowDown: 'D',
  KeyS: 'D',
  s: 'D',
  S: 'D',
  ArrowLeft: 'L',
  KeyA: 'L',
  a: 'L',
  A: 'L',
  ArrowRight: 'R',
  KeyD: 'R',
  d: 'R',
  D: 'R'
};

const WEIGHTS = {
  planning: 0.20,
  efficiency: 0.20,
  commitment: 0.15,
  focus: 0.15,
  order: 0.10,
  scenario: 0.20
};
const PLAN_REF_SECONDS = 15;

const clamp = (v) => Math.max(0, Math.min(1, v));

function shannonEntropy(counts) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  return -Object.values(counts)
    .filter(c => c > 0)
    .reduce((s, c) => s + (c / total) * Math.log2(c / total), 0);
}

function computeJudgingScore(m) {
  const planning = clamp(m.planTime / PLAN_REF_SECONDS);
  const efficiency = m.steps > 0 ? clamp(m.optimalSteps / m.steps) : 0;
  const commitment = m.steps > 0 ? clamp(1 - m.revisits / m.steps) : 0;
  const focus = m.bonusTotal > 0 ? clamp(1 - m.bonusCollected / m.bonusTotal) : 1;
  const order = clamp(1 - shannonEntropy(m.dirCounts) / 2);
  const scenario = clamp(m.scenarioPrior);
  const w = WEIGHTS;
  const rawScore = 10 * (
    w.planning * planning +
    w.efficiency * efficiency +
    w.commitment * commitment +
    w.focus * focus +
    w.order * order +
    w.scenario * scenario
  );
  return {
    planning,
    efficiency,
    commitment,
    focus,
    order,
    scenario,
    score: Math.round(rawScore * 10) / 10
  };
}

// Generador de laberinto perfecto (DFS con backtracking)
function generateMaze(n) {
  const g = Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => ({
      x,
      y,
      walls: { U: true, D: true, L: true, R: true }
    }))
  );
  const seen = new Set(['0,0']);
  const stack = [g[0][0]];

  while (stack.length) {
    const c = stack[stack.length - 1];
    const opts = KEYS.filter(d => {
      const nx = c.x + DIRS[d][0];
      const ny = c.y + DIRS[d][1];
      return g[ny]?.[nx] && !seen.has(`${nx},${ny}`);
    });

    if (!opts.length) {
      stack.pop();
      continue;
    }

    const d = opts[Math.floor(Math.random() * opts.length)];
    const nb = g[c.y + DIRS[d][1]][c.x + DIRS[d][0]];
    c.walls[d] = false;
    nb.walls[OPP[d]] = false;
    seen.add(`${nb.x},${nb.y}`);
    stack.push(nb);
  }
  return g;
}

// Distancia mínima BFS
function shortestPathDistance(g, a, b) {
  const q = [[a, 0]];
  const seen = new Set([`${a.x},${a.y}`]);
  while (q.length) {
    const [p, d] = q.shift();
    if (p.x === b.x && p.y === b.y) return d;
    for (const k of KEYS) {
      if (g[p.y][p.x].walls[k]) continue;
      const n = { x: p.x + DIRS[k][0], y: p.y + DIRS[k][1] };
      const keyStr = `${n.x},${n.y}`;
      if (!seen.has(keyStr)) {
        seen.add(keyStr);
        q.push([n, d + 1]);
      }
    }
  }
  return 0;
}

// Definición temática de los 4 Escenarios con sus Personajes y Coleccionables
const SCENARIOS = [
  {
    id: 'rescue',
    name: 'Rescate 911',
    heroName: 'Alex el Bombero',
    heroTitle: 'Rescatista de Emergencias',
    heroAvatarColor: '#ef4444',
    badgeText: 'JUICIO ALTO',
    posterBg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    posterBanner: '#ef4444',
    posterText: '#991b1b',
    btnBg: '#ef4444',
    floorColor: '#fff7ed',
    wallColor: '#9a3412',
    goalName: '3 Sobrevivientes',
    goalBadge: '1 → 2 → 3 en orden',
    bonusName: 'Botiquines Médicos',
    shortGoal: 'Rescata a los 3 sobrevivientes en orden (1, 2, 3) y sal.',
    rewardDesc: '3 personas · Botiquines (+)',
    story: 'Hay 3 personas atrapadas en diferentes zonas del laberinto.',
    objective: 'Rescata a los sobrevivientes en estricto orden (1, 2 y 3) y llega al Helipuerto.',
    goalCount: 3,
    ordered: true,
    bonusCount: 4,
    timeLimit: null,
    prior: 0.9
  },
  {
    id: 'clock',
    name: 'Crono 75s',
    heroName: 'Agente Cyber',
    heroTitle: 'Infiltrador Tecnológico',
    heroAvatarColor: '#0284c7',
    badgeText: 'CONTRARRELOJ',
    posterBg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
    posterBanner: '#0284c7',
    posterText: '#0369a1',
    btnBg: '#0284c7',
    floorColor: '#f0f9ff',
    wallColor: '#075985',
    goalName: 'Llave Cuántica',
    goalBadge: 'Apertura de Compuerta',
    bonusName: 'Gemas de Criptón',
    shortGoal: 'Encuentra la llave maestra y sal antes de 75s.',
    rewardDesc: '1 llave · Gemas de datos',
    story: 'La compuerta del búnker se sellará automáticamente en 75 segundos.',
    objective: 'Encuentra la llave maestra dorada y alcanza el portal cuántico antes de que el cronómetro llegue a cero.',
    goalCount: 1,
    ordered: false,
    bonusCount: 4,
    timeLimit: 75,
    prior: 0.7
  },
  {
    id: 'treasure',
    name: 'Isla Corsaria',
    heroName: 'Capitán Jack',
    heroTitle: 'Pirata de los 7 Mares',
    heroAvatarColor: '#f59e0b',
    badgeText: 'EXPLORACIÓN',
    posterBg: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
    posterBanner: '#d97706',
    posterText: '#854d0e',
    btnBg: '#d97706',
    floorColor: '#fefce8',
    wallColor: '#78350f',
    goalName: '2 Cofres de Oro',
    goalBadge: 'Orden libre a tu gusto',
    bonusName: 'Monedas Antiguas',
    shortGoal: 'Encuentra los 2 cofres de oro y aborda el barco.',
    rewardDesc: '2 cofres · Monedas de oro',
    story: 'Un mapa viejo muestra dos cofres legendarios escondidos en las ruinas.',
    objective: 'Localiza los 2 cofres en el orden que decidas y aborda el barco corsario en la costa.',
    goalCount: 2,
    ordered: false,
    bonusCount: 6,
    timeLimit: null,
    prior: 0.4
  },
  {
    id: 'garden',
    name: 'Jardín Místico',
    heroName: 'Exploradora Flora',
    heroTitle: 'Botánica Naturalista',
    heroAvatarColor: '#10b981',
    badgeText: 'PERCEPCIÓN',
    posterBg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
    posterBanner: '#9333ea',
    posterText: '#6b21a8',
    btnBg: '#9333ea',
    floorColor: '#f0fdf4',
    wallColor: '#166534',
    goalName: 'Fuente Sagrada',
    goalBadge: 'Santuario de agua',
    bonusName: 'Orquídeas Silvestres',
    shortGoal: 'Llega a la fuente sagrada a tu propio ritmo.',
    rewardDesc: '1 fuente · Flores mágicas',
    story: 'Un laberinto botánico lleno de especies mágicas y aromas silvestres.',
    objective: 'Descubre la Fuente Mística. Las flores y orquídeas del camino son totalmente opcionales.',
    goalCount: 1,
    ordered: false,
    bonusCount: 8,
    timeLimit: null,
    prior: 0.2
  }
];

// Dibujo especializado de personajes temáticos en Canvas
function drawPlayer(ctx, x, y, size, scenarioId) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.36;

  ctx.save();
  if (scenarioId === 'rescue') {
    // Alex el Bombero
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.2, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
    // Casco amarillo
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.25, r * 0.85, Math.PI, 0);
    ctx.fill();
    // Borde visera
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(cx - r * 0.85, cy - r * 0.25, r * 1.7, 3);
    // Visor
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cx - r * 0.4, cy - r * 0.1, r * 0.8, r * 0.35);
  } else if (scenarioId === 'clock') {
    // Agente Cyber con visor neón
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    // Visor brillante
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.fillRect(cx - r * 0.6, cy - r * 0.2, r * 1.2, r * 0.4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - r * 0.3, cy - r * 0.05, r * 0.6, 2);
  } else if (scenarioId === 'treasure') {
    // Capitán Jack con pañuelo pirata
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.1, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.2, r * 0.85, Math.PI, 0);
    ctx.fill();
    // Parche
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy + r * 0.05, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Ojo sano
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(cx + r * 0.25, cy + r * 0.05, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Exploradora Flora
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.1, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
    // Corona de flores
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(cx - r * 0.35, cy - r * 0.45, 3, 0, Math.PI * 2);
    ctx.arc(cx, cy - r * 0.55, 3.5, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.35, cy - r * 0.45, 3, 0, Math.PI * 2);
    ctx.fill();
    // Ojos
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(cx - r * 0.25, cy + r * 0.05, 2, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.25, cy + r * 0.05, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Dibujo especializado de objetivos temáticos
function drawGoal(ctx, x, y, size, scenarioId, goalIndex) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.34;
  ctx.save();

  if (scenarioId === 'rescue') {
    // Sobreviviente numerado 1, 2, 3 en círculo esmeralda
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${goalIndex + 1}`, cx, cy + 1);
  } else if (scenarioId === 'clock') {
    // Llave Dorada
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(cx - 1, cy - 1, r * 1.1, 4);
    ctx.fillRect(cx + r * 0.7, cy + 2, 3, 4);
  } else if (scenarioId === 'treasure') {
    // Cofre pirata
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - r * 0.8, cy - r * 0.5, r * 1.6, r * 1.1);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - r * 0.8, cy - r * 0.5, r * 1.6, r * 1.1);
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.5, r * 0.8, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Fuente Sagrada de Loto
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c084fc';
    for (let a = 0; a < 4; a++) {
      const ang = (a * Math.PI) / 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * (r * 0.7), cy + Math.sin(ang) * (r * 0.7), 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

// Dibujo de bonus temáticos
function drawBonus(ctx, x, y, size, scenarioId) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.22;
  ctx.save();

  if (scenarioId === 'rescue') {
    // Botiquín
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(cx - 2, cy - 6, 4, 12);
    ctx.fillRect(cx - 6, cy - 2, 12, 4);
  } else if (scenarioId === 'clock') {
    // Rombo de Datos
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.2);
    ctx.lineTo(cx + r * 1.2, cy);
    ctx.lineTo(cx, cy + r * 1.2);
    ctx.lineTo(cx - r * 1.2, cy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (scenarioId === 'treasure') {
    // Moneda de oro
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Flor silvestre
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 2, 3, 0, Math.PI * 2);
    ctx.arc(cx + 3, cy - 2, 3, 0, Math.PI * 2);
    ctx.arc(cx - 2, cy + 3, 2.5, 0, Math.PI * 2);
    ctx.arc(cx + 2, cy + 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Dibujo de salida / meta temática
function drawExit(ctx, x, y, size, scenarioId) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.38;
  ctx.save();

  if (scenarioId === 'rescue') {
    // Helipuerto verde con 'H'
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', cx, cy);
  } else if (scenarioId === 'clock') {
    // Compuerta cuántica
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  } else if (scenarioId === 'treasure') {
    // Muelle / Ancla
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚓', cx, cy);
  } else {
    // Santuario botánico
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌸', cx, cy);
  }
  ctx.restore();
}

export default function JudgingGame({ onBack, onComplete }) {
  const [phase, setPhase] = useState('select');
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);

  // Laberinto y posiciones
  const [grid, setGrid] = useState(null);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [exitPos] = useState({ x: SIZE - 1, y: SIZE - 1 });
  const [goals, setGoals] = useState([]);
  const [doneGoals, setDoneGoals] = useState(new Set());
  const [bonusList, setBonusList] = useState([]);
  const [bonusLeft, setBonusLeft] = useState(new Set());
  const [optimalSteps, setOptimalSteps] = useState(0);

  // Telemetría conductual
  const [planStartTime, setPlanStartTime] = useState(0);
  const [planTime, setPlanTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [steps, setSteps] = useState(0);
  const [revisits, setRevisits] = useState(0);
  const [bonusCollected, setBonusCollected] = useState(0);
  const [dirCounts, setDirCounts] = useState({ U: 0, D: 0, L: 0, R: 0 });
  const visitedCellsRef = useRef(new Set(['0,0']));

  // Puntuación
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const canvasRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Iniciar misión
  const initMission = (sc) => {
    setSelectedScenario(sc);
    const newGrid = generateMaze(SIZE);
    setGrid(newGrid);

    const keyStr = (p) => `${p.x},${p.y}`;
    const allCells = newGrid
      .flat()
      .filter(c => keyStr(c) !== '0,0' && keyStr(c) !== `${SIZE - 1},${SIZE - 1}`)
      .sort(() => Math.random() - 0.5)
      .map(c => ({ x: c.x, y: c.y }));

    const missionGoals = allCells.slice(0, sc.goalCount);
    const missionBonus = allCells.slice(sc.goalCount, sc.goalCount + sc.bonusCount);

    setGoals(missionGoals);
    setDoneGoals(new Set());
    setBonusList(missionBonus);
    setBonusLeft(new Set(missionBonus.map(keyStr)));

    // Ruta óptima
    const route = [{ x: 0, y: 0 }, ...missionGoals, { x: SIZE - 1, y: SIZE - 1 }];
    let opt = 0;
    for (let i = 0; i < route.length - 1; i++) {
      opt += shortestPathDistance(newGrid, route[i], route[i + 1]);
    }
    setOptimalSteps(opt);

    setPlayer({ x: 0, y: 0 });
    visitedCellsRef.current = new Set(['0,0']);
    setSteps(0);
    setRevisits(0);
    setBonusCollected(0);
    setDirCounts({ U: 0, D: 0, L: 0, R: 0 });
    setElapsedSeconds(0);

    const now = performance.now();
    setPlanStartTime(now);
    setPhase('planning');
  };

  const handleStartPlaying = () => {
    const pTime = (performance.now() - planStartTime) / 1000;
    setPlanTime(pTime);
    setGameStartTime(performance.now());
    setPhase('playing');
  };

  const finishGame = useCallback((completed) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const totalTime = (performance.now() - gameStartTime) / 1000;
    const metrics = {
      scenarioId: selectedScenario.id,
      scenarioPrior: selectedScenario.prior,
      planTime: planTime || 0.1,
      totalTime,
      steps,
      optimalSteps,
      revisits,
      bonusCollected,
      bonusTotal: selectedScenario.bonusCount,
      dirCounts,
      completed
    };

    const breakdown = computeJudgingScore(metrics);
    setScoreBreakdown(breakdown);
    setMissionCompleted(completed);
    setPhase('results');
  }, [gameStartTime, planTime, steps, optimalSteps, revisits, bonusCollected, selectedScenario, dirCounts]);

  const move = useCallback((d) => {
    if (phase !== 'playing' || !grid) return;
    const currentCell = grid[player.y]?.[player.x];
    if (!currentCell || currentCell.walls[d]) return;

    const nx = player.x + DIRS[d][0];
    const ny = player.y + DIRS[d][1];
    const newPos = { x: nx, y: ny };
    const k = `${nx},${ny}`;

    setPlayer(newPos);
    setSteps(prev => prev + 1);
    setDirCounts(prev => ({ ...prev, [d]: prev[d] + 1 }));

    if (visitedCellsRef.current.has(k)) {
      setRevisits(prev => prev + 1);
    } else {
      visitedCellsRef.current.add(k);
    }

    if (bonusLeft.has(k)) {
      setBonusLeft(prev => {
        const next = new Set(prev);
        next.delete(k);
        return next;
      });
      setBonusCollected(prev => prev + 1);
    }

    const goalIdx = goals.findIndex((g, idx) => {
      if (doneGoals.has(idx)) return false;
      if (g.x !== nx || g.y !== ny) return false;
      if (selectedScenario.ordered && idx !== doneGoals.size) return false;
      return true;
    });

    let updatedDoneGoals = doneGoals;
    if (goalIdx >= 0) {
      updatedDoneGoals = new Set(doneGoals);
      updatedDoneGoals.add(goalIdx);
      setDoneGoals(updatedDoneGoals);
    }

    if (nx === exitPos.x && ny === exitPos.y && updatedDoneGoals.size === goals.length) {
      finishGame(true);
    }
  }, [phase, grid, player, bonusLeft, goals, doneGoals, selectedScenario, exitPos, finishGame]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const handleKeyDown = (e) => {
      const dir = KEYMAP[e.code] || KEYMAP[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, move]);

  useEffect(() => {
    if (phase !== 'playing') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((performance.now() - gameStartTime) / 1000);
      setElapsedSeconds(elapsed);
      if (selectedScenario.timeLimit && elapsed >= selectedScenario.timeLimit) {
        finishGame(false);
      }
    }, 250);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase, gameStartTime, selectedScenario, finishGame]);

  // Dibujado del laberinto con texturas y personajes
  useEffect(() => {
    if (!canvasRef.current || !grid) return;
    const canvas = canvasRef.current;
    canvas.width = SIZE * CELL;
    canvas.height = SIZE * CELL;
    const ctx = canvas.getContext('2d');

    // Fondo cálido/temático
    ctx.fillStyle = selectedScenario.floorColor;
    ctx.fillRect(0, 0, SIZE * CELL, SIZE * CELL);

    // Muros nítidos y redondeados
    ctx.strokeStyle = selectedScenario.wallColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (const cell of grid.flat()) {
      const x = cell.x * CELL;
      const y = cell.y * CELL;
      if (cell.walls.U) { ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); }
      if (cell.walls.D) { ctx.moveTo(x, y + CELL); ctx.lineTo(x + CELL, y + CELL); }
      if (cell.walls.L) { ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); }
      if (cell.walls.R) { ctx.moveTo(x + CELL, y); ctx.lineTo(x + CELL, y + CELL); }
    }
    ctx.stroke();

    // 1. Salida temática
    drawExit(ctx, exitPos.x * CELL, exitPos.y * CELL, CELL, selectedScenario.id);

    // 2. Bonus temáticos
    bonusList.forEach(p => {
      if (bonusLeft.has(`${p.x},${p.y}`)) {
        drawBonus(ctx, p.x * CELL, p.y * CELL, CELL, selectedScenario.id);
      }
    });

    // 3. Objetivos temáticos
    goals.forEach((g, i) => {
      if (!doneGoals.has(i)) {
        drawGoal(ctx, g.x * CELL, g.y * CELL, CELL, selectedScenario.id, i);
      }
    });

    // 4. Personaje del jugador
    drawPlayer(ctx, player.x * CELL, player.y * CELL, CELL, selectedScenario.id);
  }, [grid, player, exitPos, goals, doneGoals, bonusList, bonusLeft, selectedScenario]);

  const handleSaveAndReturn = () => {
    if (scoreBreakdown && onComplete) {
      onComplete(scoreBreakdown.score);
    }
    if (onBack) {
      onBack();
    }
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      fontFamily: 'var(--font-sans)',
      color: '#1e293b'
    }}>
      {/* Botón flotante Volver */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 99999,
            background: '#0284c7',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.6)',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Volver al Inicio
        </button>
      )}

      {/* Encabezado Fresco y Limpio con Fondo Blanco */}
      <header style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '22px 28px',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
        border: '1.5px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            padding: '12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
          }}>
            <Compass size={28} color="#ffffff" />
          </div>
          <div>
            <h1 className="bubble-title" style={{ fontSize: '1.65rem', margin: 0, color: '#0f172a' }}>
              Laberinto de Decisiones
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '4px 0 0' }}>
              Dimensión 4: Estilo de Vida y Toma de Caminos (Juicio J vs Percepción P)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {phase !== 'select' && (
            <button
              onClick={() => setPhase('select')}
              style={{
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <ArrowLeft size={15} /> Ver Otros Retos
            </button>
          )}

          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0369a1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={15} /> Volver al Inicio
            </button>
          )}

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '8px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#64748b'
          }}>
            Dimensión J / P
          </div>
        </div>
      </header>

      {/* =========================================================================
          PANTALLA 1: SELECCIÓN DE MISIÓN — CUADRITOS / PÓSTERES VISUALES
         ========================================================================= */}
      {phase === 'select' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '32px',
          border: '1.5px solid #e2e8f0',
          padding: '42px 32px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', letterSpacing: '1px', textTransform: 'uppercase' }}>
              PASO 1 — ELIGE TU RETO VISUAL
            </span>
            <h2 className="bubble-title" style={{ fontSize: '2.2rem', color: '#0f172a', margin: '6px 0 10px' }}>
              ¿Qué tipo de reto prefieres abordar?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.96rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.55 }}>
              Cada escenario cuenta con su propio personaje, objetivo y recompensas. Tu forma de resolver el laberinto medirá tu balance psicométrico natural.
            </p>
          </div>

          {/* Grid de 4 Cuadritos / Mini Pósteres en 1 Sola Línea Horizontal */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '14px',
            marginBottom: '30px'
          }}>
            {SCENARIOS.map(sc => (
              <div
                key={sc.id}
                onClick={() => initMission(sc)}
                style={{
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = sc.posterBanner;
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 14px 28px ${sc.posterBanner}28`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(15, 23, 42, 0.04)';
                }}
              >
                {/* Cabecera Mini Póster Compacta */}
                <div style={{
                  background: sc.posterBg,
                  padding: '16px 14px',
                  borderBottom: `2px solid ${sc.posterBanner}30`,
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: sc.posterBanner,
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.6px',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>
                    {sc.badgeText}
                  </div>

                  <h3 className="bubble-title" style={{
                    fontSize: '1.25rem',
                    color: sc.posterText,
                    margin: '0 0 3px',
                    lineHeight: 1.15
                  }}>
                    {sc.name}
                  </h3>

                  <div style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: sc.posterText,
                    opacity: 0.9
                  }}>
                    {sc.heroName}
                  </div>
                </div>

                {/* Contenido Compacto y Directo */}
                <div style={{ padding: '14px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {/* Meta Corta */}
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '10px 10px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.66rem', fontWeight: 800, color: sc.posterText, textTransform: 'uppercase', marginBottom: '3px' }}>
                        Meta:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.35 }}>
                        {sc.shortGoal}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', marginBottom: '14px' }}>
                      {sc.rewardDesc}
                    </div>
                  </div>

                  {/* Botón de Entrada */}
                  <button
                    style={{
                      width: '100%',
                      padding: '10px 8px',
                      background: sc.btnBg,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: `0 4px 12px ${sc.btnBg}35`
                    }}
                  >
                    Elegir Reto <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Caja Informativa */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.88rem',
            color: '#475569'
          }}>
            <Info size={22} color="#0284c7" />
            <span>
              <strong>Instrucciones:</strong> Primero verás el laberinto completo para planificar tu ruta con calma. Cuando estés listo, haz clic en "Empezar" y navega con el teclado (flechas o W, A, S, D) o los botones táctiles en pantalla.
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANTALLA 2 & 3: PLANIFICACIÓN Y JUEGO EN VIVO
         ========================================================================= */}
      {(phase === 'planning' || phase === 'playing') && (
        <div style={{
          background: '#ffffff',
          borderRadius: '32px',
          border: '1.5px solid #e2e8f0',
          padding: '28px 24px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)'
        }}>
          {/* Barra Superior de la Misión */}
          <div style={{
            background: selectedScenario.posterBg,
            border: `2px solid ${selectedScenario.posterBanner}40`,
            borderRadius: '20px',
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setPhase('select')}
                style={{
                  background: '#ffffff',
                  border: `1.5px solid ${selectedScenario.posterBanner}70`,
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: selectedScenario.posterText,
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <ArrowLeft size={16} /> Ver Otros Retos
              </button>

              <div>
                <div style={{ fontSize: '0.74rem', color: selectedScenario.posterText, fontWeight: 800, textTransform: 'uppercase' }}>
                  Héroe: {selectedScenario.heroName} ({selectedScenario.badgeText})
                </div>
                <h2 className="bubble-title" style={{ fontSize: '1.45rem', margin: '2px 0 4px', color: selectedScenario.posterText }}>
                  {selectedScenario.name}
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0 }}>
                  {selectedScenario.objective}
                </p>
              </div>
            </div>

            {phase === 'planning' ? (
              <button
                onClick={handleStartPlaying}
                style={{
                  background: selectedScenario.btnBg,
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${selectedScenario.btnBg}55`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Play size={18} /> Estoy Listo, Empezar
              </button>
            ) : (
              <div style={{
                display: 'flex',
                gap: '14px',
                background: '#ffffff',
                padding: '10px 18px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f0',
                fontSize: '0.88rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <span style={{ color: '#64748b' }}>Tiempo:</span>{' '}
                  <span style={{ color: '#0284c7' }}>{elapsedSeconds}s{selectedScenario.timeLimit ? ` / ${selectedScenario.timeLimit}s` : ''}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Pasos:</span>{' '}
                  <span style={{ color: '#0f172a' }}>{steps}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Metas:</span>{' '}
                  <span style={{ color: '#10b981' }}>{doneGoals.size} / {goals.length}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Bonus:</span>{' '}
                  <span style={{ color: '#d97706' }}>{bonusCollected} / {selectedScenario.bonusCount}</span>
                </div>
              </div>
            )}
          </div>

          {phase === 'planning' && (
            <div style={{
              background: '#f0f9ff',
              border: '1.5px dashed #0284c7',
              borderRadius: '16px',
              padding: '14px 20px',
              textAlign: 'center',
              fontSize: '0.92rem',
              color: '#0369a1',
              marginBottom: '20px'
            }}>
              Estudia el mapa el tiempo que quieras para trazar tu ruta mentalmente. El sistema medirá tu tiempo de planificación previa. Cuando estés listo, presiona <strong>"Estoy Listo, Empezar"</strong>.
            </div>
          )}

          {/* Área del Canvas del Laberinto */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            background: '#f8fafc',
            padding: '24px',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0'
          }}>
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: '18px',
                boxShadow: '0 14px 40px rgba(0, 0, 0, 0.1)',
                maxWidth: '100%',
                height: 'auto',
                border: `3px solid ${selectedScenario.wallColor}`
              }}
            />

            {/* Controles Táctiles */}
            {phase === 'playing' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  Controles: Usa las flechas del teclado, W/A/S/D o estos botones táctiles
                </div>
                <button
                  onClick={() => move('U')}
                  style={{
                    width: '54px',
                    height: '48px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '2px solid #cbd5e1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                  }}
                >
                  <ArrowUp size={22} />
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => move('L')}
                    style={{
                      width: '54px',
                      height: '48px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '2px solid #cbd5e1',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                    }}
                  >
                    <ArrowLeft size={22} />
                  </button>
                  <button
                    onClick={() => move('D')}
                    style={{
                      width: '54px',
                      height: '48px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '2px solid #cbd5e1',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                    }}
                  >
                    <ArrowDown size={22} />
                  </button>
                  <button
                    onClick={() => move('R')}
                    style={{
                      width: '54px',
                      height: '48px',
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '2px solid #cbd5e1',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
                    }}
                  >
                    <ArrowRight size={22} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PANTALLA 4: RESULTADOS CONDUCTUALES
         ========================================================================= */}
      {phase === 'results' && scoreBreakdown && (
        <div style={{
          background: '#ffffff',
          borderRadius: '32px',
          border: '1.5px solid #e2e8f0',
          padding: '42px 32px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.05)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0284c7', letterSpacing: '1px' }}>
              EVALUACIÓN PSICOMÉTRICA FINALIZADA
            </span>
            <h2 className="bubble-title" style={{ fontSize: '2.3rem', color: '#0f172a', margin: '6px 0 10px' }}>
              {missionCompleted ? '¡Misión Concluida con Éxito!' : 'Tiempo Límite Alcanzado'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.96rem', maxWidth: '620px', margin: '0 auto' }}>
              El sistema ha registrado tus patrones de navegación, tiempos de planificación y desvíos de ruta.
            </p>
          </div>

          {/* Puntaje Principal */}
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '2px solid #34d399',
            borderRadius: '24px',
            padding: '30px',
            textAlign: 'center',
            maxWidth: '540px',
            margin: '0 auto 34px',
            boxShadow: '0 10px 30px rgba(52, 211, 153, 0.15)'
          }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
              Judging Score Obtenido
            </div>
            <div style={{ fontSize: '3.6rem', fontWeight: 900, color: '#065f46', margin: '6px 0' }}>
              {scoreBreakdown.score.toFixed(1)}{' '}
              <span style={{ fontSize: '1.4rem', color: '#047857', fontWeight: 600 }}>/ 10.0</span>
            </div>
            <div style={{
              display: 'inline-block',
              background: scoreBreakdown.score >= 5.0 ? '#d1fae5' : '#e0f2fe',
              border: `1.5px solid ${scoreBreakdown.score >= 5.0 ? '#10b981' : '#0284c7'}`,
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: 800,
              color: scoreBreakdown.score >= 5.0 ? '#065f46' : '#0369a1',
              marginTop: '8px'
            }}>
              {scoreBreakdown.score >= 5.0 ? 'Preferencia: Juicio y Estructura (J)' : 'Preferencia: Percepción y Adaptabilidad (P)'}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.55, marginTop: '16px', marginBottom: 0 }}>
              {scoreBreakdown.score >= 5.0
                ? 'Muestras una marcada tendencia a planificar con anticipación, seguir rutas directas y mantener el foco en la meta sin distraerte en recompensas secundarias.'
                : 'Muestras una tendencia a la exploración abierta, adaptabilidad en tiempo real y curiosidad para investigar caminos alternativos.'}
            </p>
          </div>

          {/* Desglose de Factores Conductuales */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Desglose de Factores Conductuales:
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px'
            }}>
              {[
                {
                  code: 'P',
                  name: 'Planificación Previa',
                  weight: '20%',
                  value: scoreBreakdown.planning,
                  desc: `Tiempo dedicado a analizar el mapa (${planTime.toFixed(1)}s)`
                },
                {
                  code: 'E',
                  name: 'Eficiencia de Ruta',
                  weight: '20%',
                  value: scoreBreakdown.efficiency,
                  desc: `${optimalSteps} pasos óptimos vs ${steps} pasos reales`
                },
                {
                  code: 'C',
                  name: 'Compromiso de Camino',
                  weight: '15%',
                  value: scoreBreakdown.commitment,
                  desc: `Constancia sin retrocesos (${revisits} celdas repetidas)`
                },
                {
                  code: 'F',
                  name: 'Foco en el Objetivo',
                  weight: '15%',
                  value: scoreBreakdown.focus,
                  desc: `Resistencia a distracciones (${bonusCollected} bonus tomados)`
                },
                {
                  code: 'O',
                  name: 'Orden y Entropía',
                  weight: '10%',
                  value: scoreBreakdown.order,
                  desc: 'Baja dispersión direccional en el recorrido'
                },
                {
                  code: 'S',
                  name: 'Escenario Seleccionado',
                  weight: '20%',
                  value: scoreBreakdown.scenario,
                  desc: `Prior del escenario (${selectedScenario.name})`
                }
              ].map(f => (
                <div key={f.code} style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '14px 18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                      <span style={{ color: '#0284c7', marginRight: '6px' }}>[{f.code}]</span> {f.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>
                      {Math.round(f.value * 100)}% <span style={{ color: '#64748b' }}>({f.weight})</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', margin: '8px 0' }}>
                    <div style={{ width: `${Math.round(f.value * 100)}%`, height: '100%', background: '#0284c7', borderRadius: '9999px' }} />
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desplegable de Fórmula Matemática */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '18px 22px',
            marginBottom: '32px'
          }}>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#0284c7',
                fontSize: '0.9rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={16} /> Ver Fórmula Matemática del Test
              </span>
              <span>{showFormulaDetails ? 'Ocultar ▲' : 'Mostrar ▼'}</span>
            </button>

            {showFormulaDetails && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '14px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
                <code style={{ display: 'block', background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', color: '#0369a1', fontFamily: 'monospace', marginBottom: '10px', border: '1px solid #cbd5e1' }}>
                  Judging Score = 10 · (0.20·P + 0.20·E + 0.15·C + 0.15·F + 0.10·O + 0.20·S)
                </code>
                <div>
                  <strong>P:</strong> min(t_plan / 15s, 1) · <strong>E:</strong> pasos_óptimos / pasos_reales · <strong>C:</strong> 1 - celdas_repetidas / pasos · <strong>F:</strong> 1 - recompensas_opcionales / total · <strong>O:</strong> 1 - H/2 (entropía de Shannon) · <strong>S:</strong> prior de la misión elegida.
                </div>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveAndReturn}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                color: '#ffffff',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← Guardar Puntaje y Volver a los Minijuegos
            </button>

            <button
              onClick={() => setPhase('select')}
              style={{
                background: '#ffffff',
                color: '#334155',
                border: '2px solid #cbd5e1',
                padding: '16px 28px',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} /> Jugar Otra Misión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
