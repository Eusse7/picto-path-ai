import { Metrics, Scenario, ScoreBreakdown } from './types';
import { WEIGHTS, PLAN_REF_SECONDS } from './JudgingFormula';

export class UI {
  constructor(private root: HTMLElement) {}

  showIntro(onStart: () => void) {
    this.root.innerHTML = `<div class="overlay"><div class="card">
      <h1>🧩 El laberinto</h1>
      <p>Vas a elegir una misión y recorrer un laberinto para cumplir su objetivo.</p>
      <ul>
        <li>Primero verás el mapa completo. Estúdialo el tiempo que quieras.</li>
        <li>Cuando estés listo, pulsa <b>Empezar</b>.</li>
        <li>Muévete con las flechas del teclado o con W, A, S, D.</li>
        <li>Llega a la bandera 🏁 cumpliendo el objetivo de tu misión.</li>
      </ul>
      <button id="go">Entendido, elegir misión</button></div></div>`;
    this.root.querySelector('#go')!.addEventListener('click', onStart);
  }

  showScenarios(list: Scenario[], onPick: (s: Scenario) => void) {
    this.root.innerHTML = `<div class="card wide"><h2>Elige tu misión</h2><div class="grid">
      ${list.map(s => `<button class="scn" data-id="${s.id}" style="background:${s.color}">
        <span class="big">${s.emoji}</span><b>${s.name}</b><small>${s.story}</small></button>`).join('')}
      </div></div>`;
    this.root.querySelectorAll<HTMLButtonElement>('.scn').forEach(b =>
      b.addEventListener('click', () => onPick(list.find(s => s.id === b.dataset.id)!)));
  }

  showGame(sc: Scenario) {
    this.root.innerHTML = `<div class="card wide"><h2>${sc.emoji} ${sc.name}</h2>
      <p>${sc.objective}</p><div id="hud" class="hud"></div>
      <canvas id="maze"></canvas>
      <button id="ready">Estoy listo, empezar</button></div>`;
    return {
      canvas: this.root.querySelector<HTMLCanvasElement>('#maze')!,
      hud: this.root.querySelector<HTMLElement>('#hud')!,
      ready: this.root.querySelector<HTMLButtonElement>('#ready')!,
    };
  }

  showResult(b: ScoreBreakdown, m: Metrics, onRetry: () => void) {
    const pct = (v: number) => `${Math.round(v * 100)}%`;
    const rows: [string, string, number, number][] = [
      ['P', 'Planificación', WEIGHTS.planning, b.planning], ['E', 'Eficiencia de ruta', WEIGHTS.efficiency, b.efficiency],
      ['C', 'Compromiso', WEIGHTS.commitment, b.commitment], ['F', 'Foco', WEIGHTS.focus, b.focus],
      ['O', 'Orden (1 − entropía)', WEIGHTS.order, b.order], ['S', 'Escenario elegido', WEIGHTS.scenario, b.scenario],
    ];
    this.root.innerHTML = `<div class="card"><h2>${m.completed ? 'Misión completada' : 'Se acabó el tiempo'}</h2>
      <div class="score">${b.score.toFixed(1)}<small> / 10</small></div>
      <p>Tu puntaje de Judging: cuánto prefieres planear y cerrar frente a improvisar y explorar.</p>
      <button id="toggle">Ver fórmula</button> <button id="retry" class="ghost">Jugar otra misión</button>
      <div id="formula" hidden>
        <code>JS = 10 × (0.20·P + 0.20·E + 0.15·C + 0.15·F + 0.10·O + 0.20·S)</code>
        <table>${rows.map(([k, n, w, v]) => `<tr><td>${k}</td><td>${n}</td><td>peso ${w}</td><td>${pct(v)}</td></tr>`).join('')}</table>
        <small>P = min(tiempo de planificación / ${PLAN_REF_SECONDS}s, 1) · E = pasos óptimos / pasos reales ·
        C = 1 − celdas repetidas / pasos · F = 1 − premios opcionales tomados / total ·
        O = 1 − H/2 con H la entropía de Shannon de tus direcciones · S = peso de la misión elegida.</small>
      </div></div>`;
    const f = this.root.querySelector<HTMLElement>('#formula')!;
    const t = this.root.querySelector<HTMLButtonElement>('#toggle')!;
    t.addEventListener('click', () => { f.hidden = !f.hidden; t.textContent = f.hidden ? 'Ver fórmula' : 'Ocultar fórmula'; });
    this.root.querySelector('#retry')!.addEventListener('click', onRetry);
  }
}
