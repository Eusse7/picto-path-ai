import { useEffect, useMemo, useState } from 'react';
import '../../../games/thinking_game/style.css';

const ASSET_ROOT = '/thinking_game/assets/';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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

function getCharacterValues(character) {
  const weights = character[2]
    .map(([icon]) => ({ icon, weights: ICON_WEIGHTS[icon] }))
    .filter(({ weights }) => weights);
  if (!weights.length) return { thinking: 0, feeling: 0 };
  return {
    thinking: weights.reduce((sum, item) => sum + item.weights.thinking, 0) / weights.length,
    feeling: weights.reduce((sum, item) => sum + item.weights.feeling, 0) / weights.length,
  };
}

function newGameId() {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `thinking-${Date.now()}`;
}

export default function ThinkingGame({ onBack, onScoreCalculated }) {
  const [screen, setScreen] = useState('intro');
  const [roundIndex, setRoundIndex] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [selectedBasket, setSelectedBasket] = useState(null);
  const [roundResults, setRoundResults] = useState([]);
  const [startedAt, setStartedAt] = useState(0);
  const [gameId, setGameId] = useState('');
  const [status, setStatus] = useState(null);

  const round = rounds[roundIndex];
  const assignedCount = assignments.length;
  const remaining = round.baskets - assignedCount;

  const resetGame = () => {
    setGameId(newGameId());
    setRoundIndex(0);
    setAssignments([]);
    setSelectedBasket(null);
    setRoundResults([]);
    setStatus(null);
    setStartedAt(performance.now());
    setScreen('game');
  };

  const selectBasket = (id) => setSelectedBasket(String(id));

  const assignBasket = (characterIndex) => {
    if (selectedBasket === null || assignments.length >= round.baskets) return;
    setAssignments((current) => [
      ...current,
      {
        id: selectedBasket,
        characterIndex,
        order: current.length + 1,
        modified: false,
      },
    ]);
    setSelectedBasket(null);
  };

  const removeAssignment = (basketId) => {
    setAssignments((current) => current
      .filter((item) => item.id !== String(basketId))
      .map((item, index) => ({ ...item, order: index + 1, modified: true })));
  };

  const finishRound = () => {
    if (assignments.length !== round.baskets) {
      window.alert(`Debes asignar las ${round.baskets} cestas antes de finalizar la ronda.`);
      return;
    }

    const totals = round.characters.reduce((sum, character, characterIndex) => {
      const count = assignments.filter((item) => item.characterIndex === characterIndex).length;
      const values = getCharacterValues(character);
      return {
        thinking: sum.thinking + count * values.thinking,
        feeling: sum.feeling + count * values.feeling,
      };
    }, { thinking: 0, feeling: 0 });
    const scoreT = totals.thinking / round.baskets;
    const scoreF = totals.feeling / round.baskets;
    const denominator = scoreT + scoreF;
    const score100 = Math.min(100, Math.max(0, denominator === 0
      ? 50
      : 50 + 50 * ((scoreT - scoreF) / denominator)));
    const result = {
      gameId,
      round: roundIndex + 1,
      scenario: round.name,
      basketsAvailable: round.baskets,
      durationSeconds: Number(((performance.now() - startedAt) / 1000).toFixed(2)),
      basketsDistributed: assignments.length,
      scoreT,
      scoreF,
      score100,
      assignments: round.characters.map(([name, image, indicators], characterIndex) => {
        const values = getCharacterValues(round.characters[characterIndex]);
        return {
          characterId: name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
          character: name,
          image,
          baskets: assignments.filter((item) => item.characterIndex === characterIndex).length,
          indicators: indicators.map(([icon, label]) => ({ icon, label, weights: ICON_WEIGHTS[icon] || null })),
          thinkingValue: values.thinking,
          feelingValue: values.feeling,
        };
      }),
    };

    const nextResults = [...roundResults, result];
    setRoundResults(nextResults);
    if (roundIndex === rounds.length - 1) {
      const globalScore100 = nextResults.reduce((sum, item) => sum + item.score100, 0) / rounds.length;
      const modelScore = Math.min(10, Math.max(0, globalScore100 / 10));
      setStatus({ kind: 'saving', text: 'Guardando resultado en el backend...' });
      setScreen('results');
      onScoreCalculated(modelScore);
      submitResult({ gameId, rounds: nextResults, globalScore100, modelScore }, modelScore);
      return;
    }

    setRoundIndex((current) => current + 1);
    setAssignments([]);
    setSelectedBasket(null);
    setStartedAt(performance.now());
  };

  const submitResult = async (metrics, modelScore) => {
    try {
      const response = await fetch(`${API_BASE_URL}/games/thinking/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: 'thinking', score: modelScore, metrics }),
      });
      if (!response.ok) throw new Error(`Backend respondió ${response.status}`);
      const data = await response.json();
      setStatus({ kind: 'success', text: `Resultado guardado en la sesión ${data.session_id}.` });
    } catch (error) {
      setStatus({ kind: 'warning', text: 'Resultado local listo. El backend no está disponible.' });
      console.warn('No se pudo enviar Thinking Score al backend.', error);
    }
  };

  const backgroundStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(180deg, #173b3b22, #173b3b55), url("${ASSET_ROOT + round.background}")`,
  }), [round.background]);

  useEffect(() => {
    if (screen === 'game') setStartedAt((current) => current || performance.now());
  }, [screen]);

  if (screen === 'intro') {
    return (
      <section className="screen intro-screen">
        <div className="intro-card">
          <p className="eyebrow">ALDEA LUNAVERDE · EXPEDICIÓN DE COSECHA</p>
          <h1>Cosecha de <span>Lunaverde</span></h1>
          <p className="intro-copy">La cosecha es limitada. Distribuye las cestas entre los habitantes y recorre las cuatro escenas de la aldea.</p>
          <div className="rule-list">
            <p><b>01</b> Arrastra una cesta hasta un habitante.</p>
            <p><b>02</b> Puedes entregar varias cestas a la misma persona.</p>
            <p><b>03</b> Antes de terminar, pulsa una cesta entregada para devolverla.</p>
          </div>
          <div className="icon-guide">
            <p className="eyebrow">¿QUÉ SIGNIFICAN LOS ICONOS?</p>
            <div className="icon-guide-grid">
              {[
                ['trabajo.png', 'Trabajo y contribución'], ['hambre.png', 'Hambre y necesidad'],
                ['enfermedad.png', 'Salud y recuperación'], ['familia.png', 'Responsabilidades familiares'],
                ['necesidad.png', 'Circunstancia personal'], ['cumpleaños.png', 'Situación especial'],
              ].map(([icon, label]) => <span key={icon}><img src={`${ASSET_ROOT}icons/${icon}`} alt="" />{label}</span>)}
            </div>
          </div>
          <button type="button" className="primary-button" onClick={resetGame}>Comenzar reparto <span>→</span></button>
          <p className="disclaimer">Las decisiones se registran para una exploración académica. No hay respuestas correctas o incorrectas.</p>
        </div>
      </section>
    );
  }

  if (screen === 'results') {
    const globalScore100 = roundResults.reduce((sum, item) => sum + item.score100, 0) / rounds.length;
    const modelScore = globalScore100 / 10;
    return (
      <section className="screen result-screen">
        <div className="result-card">
          <p className="eyebrow">CUADERNO DE LA ALDEA · PARTIDA COMPLETADA</p>
          <h1>Gracias por ayudar a <span>Lunaverde</span></h1>
          <p className="result-copy">Has completado las cuatro rondas de distribución. Este resultado es una tendencia exploratoria y no un diagnóstico psicológico.</p>
          <div className="score-box">
            <span>Puntaje exploratorio Thinking / Feeling</span>
            <strong>{modelScore.toFixed(2)}</strong><small> / 10</small>
            <p>{modelScore < 4 ? 'Mayor peso de indicadores asociados a necesidades y circunstancias.' : modelScore > 5.9 ? 'Mayor peso de indicadores asociados a criterios generales y contribución.' : 'Distribución relativamente equilibrada.'}</p>
          </div>
          <div className="formula-box">
            <span>Fórmula del puntaje</span>
            <p><i>T<sub>r</sub></i> = (suma de cestas × valor T del personaje) / cestas disponibles</p>
            <p><i>F<sub>r</sub></i> = (suma de cestas × valor F del personaje) / cestas disponibles</p>
            <p><i>S<sub>r</sub></i> = 50 + 50 × (<i>T<sub>r</sub></i> − <i>F<sub>r</sub></i>) / (<i>T<sub>r</sub></i> + <i>F<sub>r</sub></i>)</p>
            <p><i>Score modelo</i> = promedio(<i>S<sub>1</sub></i>, <i>S<sub>2</sub></i>, <i>S<sub>3</sub></i>, <i>S<sub>4</sub></i>) / 10</p>
          </div>
          <div className="round-summary">
            {roundResults.map((item) => <div key={item.round}><span>Ronda {item.round} · {item.scenario}</span><strong>{item.basketsDistributed}/{item.basketsAvailable} cestas</strong></div>)}
          </div>
          {status && <p className={`connection-status ${status.kind}`}>{status.text}</p>}
          <div className="result-actions">
            <button type="button" className="primary-button" onClick={onBack}>Regresar al panel</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="screen game-screen">
      <header className="game-header">
        <div><p className="eyebrow">COSECHA DE LUNAVERDE</p><h2>{round.name}</h2></div>
        <div className="round-info"><strong>{roundIndex + 1} / {rounds.length}</strong><span>Ronda</span></div>
        <div className="basket-counter"><img src={`${ASSET_ROOT}baskets/basket.png`} alt="" /><strong>{remaining}</strong><span>cestas disponibles</span></div>
      </header>
      <div className="scene" style={backgroundStyle}>
        <div className="scene-overlay"><span>{round.name.toUpperCase()}</span><p>Arrastra las cestas hacia los habitantes.</p></div>
        <div className="characters">
          {round.characters.map(([name, image, indicators], characterIndex) => {
            const assigned = assignments.filter((item) => item.characterIndex === characterIndex);
            return (
              <article
                className={`character-card ${assigned.length ? 'has-baskets' : ''}`}
                style={{ left: `${15 + characterIndex * 24}%` }}
                key={`${roundIndex}-${name}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => { event.preventDefault(); assignBasket(characterIndex); }}
                onClick={() => assignBasket(characterIndex)}
              >
                <div className="character-name">{name}</div>
                <div className="character-sprite">
                  <img src={`${ASSET_ROOT}characters/${image}`} alt={name} draggable="false" />
                  <span className="basket-stack">
                    {assigned.map((item) => <button type="button" className="assigned-basket" key={item.id} title="Devolver cesta" onClick={(event) => { event.stopPropagation(); removeAssignment(item.id); }}>▰</button>)}
                  </span>
                </div>
                <div className="indicators">{indicators.map(([icon, label]) => <span title={label} key={`${name}-${icon}`}><img src={`${ASSET_ROOT}icons/${icon}`} alt={label} /></span>)}</div>
                <div className="drop-hint">{assigned.length ? `${assigned.length} cesta${assigned.length > 1 ? 's' : ''}` : 'Suelta aquí'}</div>
              </article>
            );
          })}
        </div>
      </div>
      <section className="distribution-panel">
        <div className="inventory-heading"><div><p className="eyebrow">INVENTARIO</p><h3>Cestas de lunaverde</h3></div><p>{assignedCount} cesta{assignedCount === 1 ? '' : 's'} distribuida{assignedCount === 1 ? '' : 's'}</p></div>
        <div className="basket-inventory" aria-label="Cestas disponibles">
          {Array.from({ length: round.baskets }, (_, index) => String(index))
            .filter((id) => !assignments.some((item) => item.id === id))
            .map((id) => {
            return <button type="button" className={`basket draggable ${selectedBasket === id ? 'selected' : ''}`} draggable onDragStart={() => selectBasket(id)} onClick={() => selectBasket(id)} key={id}><img src={`${ASSET_ROOT}baskets/basket.png`} alt="Cesta de fruta" /><span>Cesta</span></button>;
          })}
        </div>
        <div className="finish-row"><p>Arrastra con el mouse o toca una cesta y luego un habitante.</p><button type="button" className="primary-button" onClick={finishRound}>Terminar reparto <span>→</span></button></div>
      </section>
    </section>
  );
}
