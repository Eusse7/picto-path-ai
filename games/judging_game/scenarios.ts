import { Scenario } from './types';

// prior alto = escenario que premia estructura/orden (Judging); bajo = exploración libre (Perceiving)
export const SCENARIOS: Scenario[] = [
  { id: 'rescue', name: 'Misión de rescate', emoji: '🚒', color: '#ffd6e0',
    story: 'Hay tres personas atrapadas en el laberinto.',
    objective: 'Rescátalas en orden (1, 2, 3) y llega a la salida.',
    goalEmoji: '🧑', goalCount: 3, ordered: true, bonusEmoji: '🪙', bonusCount: 4,
    timeLimit: null, prior: 0.9 },
  { id: 'clock', name: 'Contrarreloj', emoji: '⏱️', color: '#cfe3ff',
    story: 'La puerta se cierra en 75 segundos.',
    objective: 'Llega a la salida antes de que se acabe el tiempo.',
    goalEmoji: '🔑', goalCount: 1, ordered: false, bonusEmoji: '💎', bonusCount: 4,
    timeLimit: 75, prior: 0.7 },
  { id: 'treasure', name: 'Cazatesoros', emoji: '🏴‍☠️', color: '#d9f2e6',
    story: 'Un mapa viejo marca dos cofres escondidos.',
    objective: 'Encuentra los dos cofres (en el orden que quieras) y sal.',
    goalEmoji: '🧰', goalCount: 2, ordered: false, bonusEmoji: '💰', bonusCount: 6,
    timeLimit: null, prior: 0.4 },
  { id: 'garden', name: 'Jardín secreto', emoji: '🌸', color: '#e8dcf5',
    story: 'Un jardín infinito lleno de flores raras.',
    objective: 'Llega a la fuente. Las flores del camino son opcionales.',
    goalEmoji: '⛲', goalCount: 1, ordered: false, bonusEmoji: '🌸', bonusCount: 8,
    timeLimit: null, prior: 0.2 },
];
