import './style.css';
import { SCENARIOS } from './scenarios';
import { MazeGame } from './MazeGame';
import { UI } from './UI';
import { computeJudging } from './JudgingFormula';
import { Metrics, Scenario, ScoreBreakdown } from './types';

const API = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000';
const ui = new UI(document.getElementById('app')!);

async function submit(m: Metrics, b: ScoreBreakdown) {
  try {
    await fetch(`${API}/api/v1/games/judging/submit`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m),
    });
    window.dispatchEvent(new CustomEvent('judging-score', { detail: b.score })); // útil para Laura
  } catch (e) { console.warn('Backend no disponible, el puntaje se calculó en local.', e); }
}

function play(sc: Scenario) {
  const { canvas, hud, ready } = ui.showGame(sc);
  const game = new MazeGame(canvas, sc, hud, m => {
    const b = computeJudging(m);
    submit(m, b);
    ui.showResult(b, m, chooseScenario);
  });
  ready.addEventListener('click', () => { ready.remove(); game.beginPlay(); });
}
const chooseScenario = () => ui.showScenarios(SCENARIOS, play);
ui.showIntro(chooseScenario);
