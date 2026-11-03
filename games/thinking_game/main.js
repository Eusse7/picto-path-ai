const ASSET_ROOT = './assets/';
const API_BASE_URL = window.PICTO_API_URL || 'http://localhost:8000';
const ICON_WEIGHTS = {
  'trabajo.png': { thinking: 0.6, feeling: 0.4 },
  'hambre.png': { thinking: 0.4, feeling: 0.6 },
  'enfermedad.png': { thinking: 0.4, feeling: 0.6 },
  'cumpleaños.png': { thinking: 0.45, feeling: 0.55 },
  'familia.png': { thinking: 0.45, feeling: 0.55 },
  'necesidad.png': { thinking: 0.4, feeling: 0.6 },
};

const rounds = [
  {
    name: 'La plaza de la cosecha', background: 'backgrounds/fondo1.jpg', baskets: 3,
    characters: [
      ['Ana', 'anaF.png', [['trabajo.png', 'Tres turnos de trabajo'], ['hambre.png', 'Hambre moderada']]],
      ['Leo', 'leoF.png', [['cumpleaños.png', 'Hoy es su cumpleaños'], ['hambre.png', 'Hambre moderada']]],
      ['Rosa', 'rosa.png', [['necesidad.png', 'Acaba de llegar'], ['hambre.png', 'Mucha hambre']]],
      ['Tomás', 'tomas.png', [['enfermedad.png', 'Está enfermo'], ['hambre.png', 'Hambre moderada']]],
    ],
  },
  {
    name: 'El mercado bajo la lluvia', background: 'backgrounds/fondo2.jpg', baskets: 2,
    characters: [
      ['Mateo', 'mateo.png', [['trabajo.png', 'Reparó el mercado'], ['trabajo.png', 'Dos turnos']]],
      ['Elena', 'elena.png', [['necesidad.png', 'Perdió provisiones'], ['hambre.png', 'Mucha hambre']]],
      ['Bruno', 'bruno.png', [['familia.png', 'Familia a su cargo'], ['trabajo.png', 'Dos turnos']]],
      ['Clara', 'clara.png', [['necesidad.png', 'Intercambia productos'], ['hambre.png', 'Hambre leve']]],
    ],
  },
  {
    name: 'El invierno de Lunaverde', background: 'backgrounds/fondos3jpg.jpg', baskets: 3,
    characters: [
      ['Inés', 'ines.png', [['familia.png', 'Cuida los animales'], ['trabajo.png', 'Tres turnos']]],
      ['Samuel', 'samuel.png', [['enfermedad.png', 'Se recupera'], ['hambre.png', 'Hambre elevada']]],
      ['Julia', 'julia.png', [['necesidad.png', 'Acaba de llegar'], ['hambre.png', 'Hambre moderada']]],
      ['Pedro', 'pedro.png', [['necesidad.png', 'Perdió sus cultivos'], ['hambre.png', 'Mucha hambre']]],
    ],
  },
  {
    name: 'La fiesta de la cosecha', background: 'backgrounds/fondo4.jpg', baskets: 2,
    characters: [
      ['Ana', 'anaF.png', [['trabajo.png', 'Aportó herramientas'], ['hambre.png', 'Hambre moderada']]],
      ['Leo', 'leoF.png', [['trabajo.png', 'Organizó la fiesta'], ['hambre.png', 'Hambre moderada']]],
      ['Rosa', 'rosa.png', [['necesidad.png', 'Recupera provisiones'], ['hambre.png', 'Mucha hambre']]],
      ['Tomás', 'tomas.png', [['familia.png', 'Ayudó a otros'], ['hambre.png', 'Hambre moderada']]],
    ],
  },
];

const state = {
  gameId: '', roundIndex: 0, selectedBasket: null, nextBasketId: 0, startedAt: 0,
  assignments: [], roundResults: [], locked: false,
};

const $ = (selector) => document.querySelector(selector);
const intro = $('#intro'), game = $('#game'), results = $('#results');

function currentRound() { return rounds[state.roundIndex]; }

function startGame() {
  state.gameId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `thinking-${Date.now()}`;
  state.roundIndex = 0; state.roundResults = []; state.assignments = []; state.nextBasketId = 0; state.locked = false;
  state.startedAt = performance.now();
  intro.classList.add('hidden'); results.classList.add('hidden'); game.classList.remove('hidden');
  renderRound();
}

function calculateCharacterValues(character) {
  const indicators = character[2];
  const weights = indicators
    .map(([icon]) => ({ icon, weights: ICON_WEIGHTS[icon] }))
    .filter((item) => item.weights);
  if (!weights.length) {
    return { thinking: 0, feeling: 0, iconWeights: [] };
  }
  return {
    thinking: weights.reduce((sum, item) => sum + item.weights.thinking, 0) / weights.length,
    feeling: weights.reduce((sum, item) => sum + item.weights.feeling, 0) / weights.length,
    iconWeights: weights,
  };
}

function renderRound() {
  const round = currentRound();
  $('#round-name').textContent = round.name;
  $('#round-number').textContent = `${state.roundIndex + 1} / ${rounds.length}`;
  $('#basket-count').textContent = round.baskets - state.assignments.length;
  $('#scene-label').textContent = round.name.toUpperCase();
  $('#round-status').textContent = `${state.assignments.length} cesta${state.assignments.length === 1 ? '' : 's'} distribuida${state.assignments.length === 1 ? '' : 's'}`;
  $('#scene').style.backgroundImage = `linear-gradient(180deg, #173b3b22, #173b3b55), url("${ASSET_ROOT + round.background}")`;
  renderCharacters(); renderInventory();
}

function renderCharacters() {
  const container = $('#characters'); container.innerHTML = '';
  currentRound().characters.forEach((character, index) => {
    const [name, image, indicators] = character;
    const assigned = state.assignments.filter((item) => item.characterIndex === index);
    const card = document.createElement('article');
    card.className = `character-card ${assigned.length ? 'has-baskets' : ''}`;
    card.style.left = `${15 + index * 24}%`;
    card.innerHTML = `
      <div class="character-name">${name}</div>
      <div class="character-sprite"><img src="${ASSET_ROOT}characters/${image}" alt="${name}" draggable="false"><span class="basket-stack">${assigned.map((item) => `<button class="assigned-basket" data-basket-id="${item.id}" title="Devolver cesta">▰</button>`).join('')}</span></div>
      <div class="indicators">${indicators.map(([icon, label]) => `<span title="${label}"><img src="${ASSET_ROOT}icons/${icon}" alt="${label}"></span>`).join('')}</div>
      <div class="drop-hint">${assigned.length ? `${assigned.length} cesta${assigned.length > 1 ? 's' : ''}` : 'Suelta aquí'}</div>`;
    card.dataset.characterIndex = index;
    card.addEventListener('dragover', (event) => { event.preventDefault(); card.classList.add('drop-target'); });
    card.addEventListener('dragleave', () => card.classList.remove('drop-target'));
    card.addEventListener('drop', (event) => { event.preventDefault(); card.classList.remove('drop-target'); assignBasket(index); });
    card.addEventListener('click', () => { if (state.selectedBasket !== null) assignBasket(index); });
    container.appendChild(card);
  });
  container.querySelectorAll('.assigned-basket').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation(); removeAssignment(Number(button.dataset.basketId));
  }));
}

function renderInventory() {
  const inventory = $('#basket-inventory'); inventory.innerHTML = '';
  const remaining = currentRound().baskets - state.assignments.length;
  for (let index = 0; index < remaining; index += 1) {
    const basket = document.createElement('button');
    basket.className = 'basket draggable'; basket.draggable = true; basket.dataset.basketId = state.nextBasketId++;
    basket.innerHTML = `<img src="${ASSET_ROOT}baskets/basket.png" alt="Cesta de fruta"><span>Cesta</span>`;
    basket.addEventListener('dragstart', () => { state.selectedBasket = basket.dataset.basketId; basket.classList.add('dragging'); });
    basket.addEventListener('dragend', () => basket.classList.remove('dragging'));
    basket.addEventListener('click', () => { state.selectedBasket = basket.dataset.basketId; inventory.querySelectorAll('.basket').forEach((item) => item.classList.remove('selected')); basket.classList.add('selected'); });
    inventory.appendChild(basket);
  }
}

function assignBasket(characterIndex) {
  if (state.locked || currentRound().baskets <= state.assignments.length) return;
  const id = state.selectedBasket ?? String(state.nextBasketId++);
  state.assignments.push({ id: String(id), characterIndex, order: state.assignments.length + 1, modified: false });
  state.selectedBasket = null; renderCharacters(); renderInventory();
}

function removeAssignment(basketId) {
  const itemIndex = state.assignments.findIndex((item) => item.id === String(basketId));
  if (itemIndex === -1) return;
  state.assignments.splice(itemIndex, 1);
  state.assignments.forEach((item, index) => { item.modified = true; item.order = index + 1; });
  renderCharacters(); renderInventory();
}

function finishRound() {
  if (state.locked) return;
  const round = currentRound();
  if (state.assignments.length !== round.baskets) {
    window.alert(`Debes asignar las ${round.baskets} cestas antes de finalizar la ronda.`);
    return;
  }
  state.locked = true;
  const durationSeconds = Number(((performance.now() - state.startedAt) / 1000).toFixed(2));
  const totals = round.characters.reduce((sum, character, index) => {
    const amount = state.assignments.filter((item) => item.characterIndex === index).length;
    const values = calculateCharacterValues(character);
    return {
      thinking: sum.thinking + amount * values.thinking,
      feeling: sum.feeling + amount * values.feeling,
    };
  }, { thinking: 0, feeling: 0 });
  const scoreT = totals.thinking / round.baskets;
  const scoreF = totals.feeling / round.baskets;
  const denominator = scoreT + scoreF;
  const rawScore100 = denominator === 0 ? 50 : 50 + 50 * ((scoreT - scoreF) / denominator);
  const score100 = Math.min(100, Math.max(0, rawScore100));
  state.roundResults.push({
    gameId: state.gameId,
    round: state.roundIndex + 1, scenario: round.name, basketsAvailable: round.baskets,
    durationSeconds, basketsDistributed: state.assignments.length, scoreT, scoreF, score100,
    assignments: round.characters.map(([name, image, indicators], characterIndex) => {
      const values = calculateCharacterValues(round.characters[characterIndex]);
      return {
      characterId: name.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''),
      character: name, baskets: state.assignments.filter((item) => item.characterIndex === characterIndex).length,
      indicators: indicators.map(([icon, label]) => ({ icon, label, weights: ICON_WEIGHTS[icon] || null })),
      thinkingValue: values.thinking,
      feelingValue: values.feeling,
      };
    }),
  });
  if (state.roundIndex === rounds.length - 1) { showResults(); return; }
  $('#scene').classList.add('transitioning');
  window.setTimeout(() => { state.roundIndex += 1; state.assignments = []; state.locked = false; state.startedAt = performance.now(); $('#scene').classList.remove('transitioning'); renderRound(); }, 650);
}

function showResults() {
  game.classList.add('hidden'); results.classList.remove('hidden');
  const globalScore100 = state.roundResults.reduce((sum, round) => sum + round.score100, 0) / rounds.length;
  const finalScore = Math.min(10, Math.max(0, globalScore100 / 10));
  state.globalScore100 = globalScore100;
  state.modelScore = finalScore;
  $('#final-score').textContent = finalScore.toFixed(2);
  $('#score-label').textContent = finalScore < 4 ? 'Mayor peso de indicadores asociados a necesidades y circunstancias.' : finalScore > 5.9 ? 'Mayor peso de indicadores asociados a criterios generales y contribución.' : 'Distribución relativamente equilibrada.';
  $('#round-summary').innerHTML = state.roundResults.map((round) => `<div><span>Ronda ${round.round} · ${round.scenario}</span><strong>${round.basketsDistributed}/${round.basketsAvailable} cestas</strong></div>`).join('');
  submitResult(finalScore);
  window.dispatchEvent(new CustomEvent('thinking-score', { detail: finalScore }));
  window.parent.postMessage({ type: 'thinking-score', score: finalScore }, '*');
}

async function submitResult(score) {
  const status = document.createElement('p');
  status.className = 'connection-status';
  status.textContent = 'Guardando resultado en el backend...';
  $('.result-actions').before(status);
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/games/thinking/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        game_id: 'thinking',
        score,
        metrics: {
          gameId: state.gameId,
          rounds: state.roundResults,
          globalScore100: state.globalScore100,
          modelScore: state.modelScore,
        },
      }),
    });
    if (!response.ok) throw new Error(`Backend respondió ${response.status}`);
    const data = await response.json();
    status.textContent = `Resultado guardado en la sesión ${data.session_id}.`;
    status.classList.add('success');
  } catch (error) {
    status.textContent = 'Resultado local listo. El backend no está disponible.';
    status.classList.add('warning');
    console.warn('No se pudo enviar Thinking Score al backend.', error);
  }
}

$('#start-button').addEventListener('click', startGame);
$('#finish-button').addEventListener('click', finishRound);
$('#return-panel-button').addEventListener('click', () => {
  window.parent.postMessage({ type: 'thinking-back-to-panel' }, '*');
});
