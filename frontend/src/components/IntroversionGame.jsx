
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './introversion.css';

const gems = [
  { x: 7, y: 19, value: 10, color: 'cyan' },
  { x: 18, y: 33, value: 15, color: 'pink' },
  { x: 29, y: 14, value: 10, color: 'lime' },
  { x: 42, y: 27, value: 25, color: 'gold' },
  { x: 56, y: 17, value: 10, color: 'pink' },
  { x: 69, y: 34, value: 20, color: 'cyan' },
  { x: 84, y: 19, value: 15, color: 'lime' },
  { x: 94, y: 39, value: 25, color: 'gold' },
  { x: 11, y: 67, value: 10, color: 'pink' },
  { x: 27, y: 54, value: 15, color: 'cyan' },
  { x: 44, y: 73, value: 10, color: 'lime' },
  { x: 61, y: 59, value: 20, color: 'gold' },
  { x: 77, y: 72, value: 15, color: 'pink' },
  { x: 91, y: 61, value: 20, color: 'cyan' },
];

const caveRewards = [
  { x: 10, y: 45, value: 20 },
  { x: 25, y: 61, value: 25 },
  { x: 41, y: 42, value: 20 },
  { x: 57, y: 65, value: 30 },
  { x: 71, y: 39, value: 25 },
  { x: 91, y: 68, value: 20 },
];

function DroneIcon() {
  return (
    <svg viewBox="0 0 90 60" aria-hidden="true">
      <path className="drone-beam" d="M27 40 4 57h49Z" />
      <path className="drone-arm" d="M17 28H5m68 0h12" />
      <circle className="drone-prop" cx="8" cy="22" r="7" />
      <circle className="drone-prop" cx="82" cy="22" r="7" />
      <path className="drone-body" d="M24 16h42l8 13-12 16H28L16 29Z" />
      <path className="drone-top" d="M35 9h20l5 8H30Z" />
      <circle className="drone-eye" cx="56" cy="29" r="7" />
      <circle className="drone-glint" cx="58" cy="27" r="2" />
      <path className="drone-claw" d="M36 44v7l-6 4m24-11v7l6 4" />
    </svg>
  );
}

function GemIcon({ color }) {
  return (
    <svg viewBox="0 0 42 48" aria-hidden="true">
      <path className={`gem-shape gem-${color}`} d="m21 2 17 13-6 25-11 6-11-6-6-25Z" />
      <path className="gem-shine" d="M21 2v38M4 15h34L21 40 4 15 21 2l17 13" />
    </svg>
  );
}

export default function IntroversionGame({ onComplete, onBack }) {
  const [phase, setPhase] = useState('instructions');
  const [selectedZone, setSelectedZone] = useState(null);
  const [seconds, setSeconds] = useState(40);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 35, y: 42 });
  const [collected, setCollected] = useState([]);
  const [caveCollected, setCaveCollected] = useState([]);
  
  // Telemetría
  const [frecuenciaMotriz, setFrecuenciaMotriz] = useState(0);
  const [visitedCells, setVisitedCells] = useState(new Set(['3-4']));
  const [estabilidadSostenida, setEstabilidadSostenida] = useState(0);
  const currentStillSecondsRef = useRef(0);
  const maxStillSecondsRef = useRef(0);

  const [chestFocus, setChestFocus] = useState(0);
  const [chestOpen, setChestOpen] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);
  const boardRef = useRef(null);

  const areaExploradaDecimal = useMemo(() => {
    return Math.min(1.0, visitedCells.size / 100.0);
  }, [visitedCells]);

  const calculatedExtroversion = useMemo(() => {
    const rawScore = 5.0 + (frecuenciaMotriz * 0.08) + (areaExploradaDecimal * 3.0) - (estabilidadSostenida * 0.35);
    const clamped = Math.max(0, Math.min(10, rawScore));
    return Number(clamped.toFixed(2));
  }, [frecuenciaMotriz, areaExploradaDecimal, estabilidadSostenida]);

  // Batería 40 segundos
  useEffect(() => {
    if (phase !== 'playing' || transitionTarget) return;

    const timer = window.setInterval(() => {
      currentStillSecondsRef.current += 1;
      if (currentStillSecondsRef.current > maxStillSecondsRef.current) {
        maxStillSecondsRef.current = currentStillSecondsRef.current;
        setEstabilidadSostenida(maxStillSecondsRef.current);
      }

      setSeconds((value) => {
        if (value <= 1) {
          setPhase('done');
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, transitionTarget]);

  // Transiciones
  useEffect(() => {
    if (!transitionTarget) return;
    const transitionTimer = window.setTimeout(() => {
      setSelectedZone(transitionTarget);
      setPosition(transitionTarget === 'cave' ? { x: 12, y: 50 } : { x: 88, y: 48 });
      setTransitionTarget(null);
    }, 1400);
    return () => window.clearTimeout(transitionTimer);
  }, [transitionTarget]);

  // Cofre (8 segundos)
  useEffect(() => {
    if (phase !== 'playing' || chestFocus <= 0 || chestFocus >= 8) return;

    const focusTimer = window.setTimeout(() => {
      setChestFocus((value) => {
        const next = value + 1;
        if (next === 8) {
          setChestOpen(true);
          setScore((current) => current + 500);
        }
        return next;
      });
    }, 1000);

    return () => window.clearTimeout(focusTimer);
  }, [chestFocus, phase]);

  useEffect(() => {
    if (phase === 'done' && onComplete) {
      onComplete({
        game_id: 'buscador_de_reliquias',
        frecuenciaMotriz,
        areaExplorada: Number(areaExploradaDecimal.toFixed(3)),
        estabilidadSostenida,
        puntajeFinal: calculatedExtroversion,
        dimension: calculatedExtroversion >= 5.0 ? 'E' : 'I'
      });
    }
  }, [phase, onComplete, frecuenciaMotriz, areaExploradaDecimal, estabilidadSostenida, calculatedExtroversion]);

  function recordMotorAction() {
    setFrecuenciaMotriz((prev) => prev + 1);
    currentStillSecondsRef.current = 0;
    if (!chestOpen) {
      setChestFocus(0);
    }
  }

  function trackGridCell(xPct, yPct) {
    const gridX = Math.max(0, Math.min(9, Math.floor(xPct / 10)));
    const gridY = Math.max(0, Math.min(9, Math.floor(yPct / 10)));
    const cellKey = `${gridX}-${gridY}`;

    setVisitedCells((current) => {
      if (current.has(cellKey)) return current;
      const next = new Set(current);
      next.add(cellKey);
      return next;
    });
  }

  function startGame() {
    if (!selectedZone) return;
    setSeconds(40);
    setScore(0);
    setPosition({ x: 35, y: 42 });
    setCollected([]);
    setCaveCollected([]);
    setFrecuenciaMotriz(0);
    setVisitedCells(new Set(['3-4']));
    setEstabilidadSostenida(0);
    currentStillSecondsRef.current = 0;
    maxStillSecondsRef.current = 0;
    setChestFocus(0);
    setChestOpen(false);
    setTransitionTarget(null);
    setPhase('playing');
  }

  function openZoneSelection() {
    setSelectedZone(null);
    setPhase('choosing');
  }

  function chooseAgain() {
    setSelectedZone(null);
    setPhase('choosing');
  }

  function moveDrone(event) {
    if (phase !== 'playing' || !boardRef.current) return;
    const target = event.target;
    if (target.closest && (target.closest('[data-gem]') || target.closest('[data-cave-reward]') || target.closest('[data-chest]'))) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));

    recordMotorAction();
    setPosition({ x, y });
    trackGridCell(x, y);
  }

  function collectGem(index) {
    if (phase !== 'playing' || collected.includes(index)) return;
    const gem = gems[index];

    recordMotorAction();
    setPosition({ x: gem.x, y: gem.y });
    trackGridCell(gem.x, gem.y);

    setCollected((current) => [...current, index]);
    setScore((value) => value + gem.value);
  }

  function collectCaveReward(index) {
    if (phase !== 'playing' || caveCollected.includes(index)) return;
    const reward = caveRewards[index];

    recordMotorAction();
    setPosition({ x: reward.x, y: reward.y });
    trackGridCell(reward.x, reward.y);

    setCaveCollected((current) => [...current, index]);
    setScore((value) => value + reward.value);
  }

  function focusChest() {
    if (phase !== 'playing' || chestOpen) return;
    recordMotorAction();
    setPosition({ x: 86, y: 51 });
    trackGridCell(86, 51);
    setChestFocus(1);
  }

  function enterDeepCave() {
    if (phase !== 'playing' || selectedZone !== 'reef' || transitionTarget) return;
    recordMotorAction();
    setPosition({ x: 86, y: 86 });
    trackGridCell(86, 86);
    setTransitionTarget('cave');
  }

  function returnToReef() {
    if (phase !== 'playing' || selectedZone !== 'cave' || transitionTarget) return;
    recordMotorAction();
    setPosition({ x: 8, y: 32 });
    trackGridCell(8, 32);
    setTransitionTarget('reef');
  }

  const explorationPct = Math.round(areaExploradaDecimal * 100);
  const actionsPerSecond = phase === 'briefing' ? 0 : frecuenciaMotriz / Math.max(1, 40 - seconds);

  return (
    <main className="app-shell">
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
            border: '2px solid rgba(255,255,255,0.4)',
            padding: '10px 18px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Volver al Inicio
        </button>
      )}
      <header className="topbar">
        {onBack && (
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", marginRight: "16px", fontWeight: 700 }}>
            ← Volver al Hub
          </button>
        )}
        <div className="brand">
          <div className="brand-mark">
            <span />
          </div>
          <div>
            <p className="eyebrow">PROTOCOLO DE EVALUACIÓN PSICOMÉTRICA</p>
            <p className="brand-title">BUSCADOR<span>/</span>RELIQUIAS</p>
          </div>
        </div>

        <div className={`timer ${seconds <= 10 ? 'timer-warning' : ''}`}>
          <div className="timer-icon" />
          <div>
            <span>BATERÍA</span>
            <strong>00:{String(seconds).padStart(2, '0')}</strong>
          </div>
          <div className="battery">
            <i style={{ width: `${(seconds / 40) * 100}%` }} />
          </div>
        </div>

        <div className="score-card">
          <span>VALOR RECUPERADO</span>
          <strong>{score.toString().padStart(4, '0')}</strong>
          <small>CRÉDITOS</small>
        </div>
      </header>

      <section className="game-layout">
        <div className="mission-rail">
          <div className="rail-heading">
            <span>01</span>
            <div>
              <p>DILEMA CONDUCTUAL</p>
              <strong>DOS RUTAS</strong>
            </div>
          </div>

          <div className="mission-copy">
            <p>Dos rutas.</p>
            <p>40 segundos de batería.</p>
            <b>Tu estrategia de exploración.</b>
          </div>

          <div className="route-card reef-route">
            <div className="route-number">A</div>
            <div>
              <span>ARRECIFE SUPERFICIAL</span>
              <strong>Explora y recolecta</strong>
              <p>Recompensas frecuentes · Movilidad continua</p>
            </div>
          </div>
          <div className="route-card cave-route">
            <div className="route-number">B</div>
            <div>
              <span>CUEVA PROFUNDA</span>
              <strong>Cofre Central</strong>
              <p>Recompensa masiva (+500) · 8s concentración</p>
            </div>
          </div>

          <div className="controls-hint">
            <span className="mouse-icon"><i /></span>
            <p><b>HAZ CLIC</b> en el mapa para dirigir el dron submarino</p>
          </div>
        </div>

        <div
          className={`game-board phase-${phase} ${selectedZone ? `zone-${selectedZone}` : 'zone-split'}`}
          ref={boardRef}
          onPointerDown={moveDrone}
          style={{
            '--drone-x': `${position.x}%`,
            '--drone-y': `${position.y}%`,
          }}
        >
          <div className="water-rays" />
          <div className="fish-school" aria-hidden="true">
            <span className="fish fish-one"><i /></span>
            <span className="fish fish-two"><i /></span>
            <span className="fish fish-three"><i /></span>
            <span className="fish fish-four"><i /></span>
            <span className="fish fish-five"><i /></span>
            <span className="fish fish-six"><i /></span>
            <span className="fish fish-seven"><i /></span>
            <span className="fish fish-eight"><i /></span>
          </div>

          {/* ZONA A: ARRECIFE SUPERFICIAL */}
          <div className="reef-zone">
            <div className="zone-label reef-label">
              <span>RUTA A</span>
              <strong>ARRECIFE SUPERFICIAL</strong>
            </div>
            <div className="bubble bubble-one" />
            <div className="bubble bubble-two" />
            <div className="bubble bubble-three" />
            <div className="coral coral-a"><i /><i /><i /></div>
            <div className="coral coral-b"><i /><i /><i /></div>
            <div className="seaweed seaweed-a"><i /><i /><i /></div>
            <div className="seaweed seaweed-b"><i /><i /></div>
            {gems.map((gem, index) => (
              <button
                className={`gem ${collected.includes(index) ? 'collected' : ''}`}
                data-gem
                key={index}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  collectGem(index);
                }}
                style={{ left: `${gem.x}%`, top: `${gem.y}%` }}
                aria-label={`Recolectar gema de ${gem.value} créditos`}
              >
                <GemIcon color={gem.color} />
                <span>+{gem.value}</span>
              </button>
            ))}
          </div>

          {/* ZONA B: CUEVA PROFUNDA */}
          <div className="cave-zone">
            <div className="cave-wall cave-top" />
            <div className="cave-wall cave-bottom" />
            <div className="zone-label cave-label">
              <span>RUTA B</span>
              <strong>CUEVA PROFUNDA</strong>
            </div>
            <div className="deep-glow" />
            <div className="cave-details" aria-hidden="true">
              <span className="deep-plant deep-plant-one"><i /><i /><i /></span>
              <span className="deep-plant deep-plant-two"><i /><i /></span>
              <span className="cave-crystal crystal-one"><i /><i /><i /></span>
              <span className="cave-crystal crystal-two"><i /><i /></span>
              <span className="cave-rock rock-one" />
              <span className="cave-rock rock-two" />
              <span className="cave-bubbles"><i /><i /><i /><i /></span>
            </div>
            {caveRewards.map((reward, index) => (
              <button
                className={`gem cave-reward ${caveCollected.includes(index) ? 'collected' : ''}`}
                data-cave-reward
                key={index}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  collectCaveReward(index);
                }}
                style={{ left: `${reward.x}%`, top: `${reward.y}%` }}
                aria-label={`Recuperar reliquia de ${reward.value} créditos`}
              >
                <GemIcon color="cyan" />
                <span>+{reward.value}</span>
              </button>
            ))}

            {/* COFRE CENTRAL (8 SEGUNDOS) */}
            <button
              className={`chest ${chestOpen ? 'chest-open' : ''}`}
              data-chest
              onPointerDown={(event) => {
                event.stopPropagation();
                focusChest();
              }}
              aria-label="Mantener posición sobre el cofre durante 8 segundos"
            >
              <span className="chest-lid"><i /></span>
              <span className="chest-body"><i /></span>
              <b>{chestOpen ? 'ABIERTO' : '+500'}</b>
            </button>
            {chestFocus > 0 && !chestOpen && (
              <div className="focus-meter">
                <div className="focus-ring" style={{ '--progress': `${(chestFocus / 8) * 360}deg` }}>
                  <span>{8 - chestFocus}</span>
                </div>
                <p>MANTÉN POSICIÓN (8s)</p>
                <small>Cualquier clic reinicia el cofre</small>
              </div>
            )}
          </div>

          <div className="seabed" />
          {phase === 'playing' && selectedZone === 'cave' && (
            <>
              <div className="cave-darkness" aria-hidden="true" />
              <div className="drone-light-ring" aria-hidden="true">
                <i />
              </div>
            </>
          )}

          {/* Dron submarino */}
          <div className="drone" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
            <DroneIcon />
            <span>DRN-07</span>
          </div>

          {/* Entradas */}
          {phase === 'playing' && selectedZone === 'reef' && (
            <button
              className="cave-entry"
              onPointerDown={(event) => {
                event.stopPropagation();
                enterDeepCave();
              }}
              aria-label="Descender a la cueva profunda"
            >
              <span className="entry-pulse"><i>↓</i></span>
              <span>
                <small>RUTA ALTERNATIVA</small>
                <strong>DESCENDER A LA CUEVA</strong>
                <p>Lleva el dron hasta aquí</p>
              </span>
            </button>
          )}

          {phase === 'playing' && selectedZone === 'cave' && (
            <button
              className="cave-entry reef-return"
              onPointerDown={(event) => {
                event.stopPropagation();
                returnToReef();
              }}
              aria-label="Regresar al arrecife exterior"
            >
              <span className="entry-pulse"><i>↑</i></span>
              <span>
                <small>RUTA DE REGRESO</small>
                <strong>VOLVER AL EXTERIOR</strong>
                <p>Lleva el dron hasta aquí</p>
              </span>
            </button>
          )}

          {transitionTarget && (
            <div className={`dive-transition ${transitionTarget === 'reef' ? 'rise-transition' : ''}`} aria-live="polite">
              <div className="transition-bubbles">
                <i /><i /><i /><i /><i /><i />
              </div>
              <div className="depth-lines"><i /><i /><i /><i /><i /></div>
              <div className="transition-message">
                <span>CAMBIO DE PROFUNDIDAD</span>
                <strong>{transitionTarget === 'cave' ? 'DESCENDIENDO' : 'ASCENDIENDO'}</strong>
                <small>{transitionTarget === 'cave' ? 'CUEVA PROFUNDA · NIVEL −02' : 'ARRECIFE EXTERIOR · NIVEL 00'}</small>
              </div>
            </div>
          )}

          {/* MODAL 1: INSTRUCCIONES */}
          {phase === 'instructions' && (
            <div className="briefing-overlay instructions-overlay">
              <div className="instructions-card">
                <div className="instructions-header">
                  <div>
                    <span className="briefing-index">MANUAL OPERATIVO / DRN-07</span>
                    <p className="briefing-kicker">ANTES DE SUMERGIRTE</p>
                    <h1>INSTRUCCIONES<br /><em>DE LA MISIÓN</em></h1>
                  </div>
                  <div className="mission-duration">
                    <span>BATERÍA TOTAL</span>
                    <strong>40</strong>
                    <small>SEGUNDOS</small>
                  </div>
                </div>

                <div className="instructions-grid">
                  <section className="instruction-block">
                    <span className="instruction-number">01</span>
                    <div className="instruction-icon">⌁</div>
                    <div>
                      <small>CONTROL PRINCIPAL</small>
                      <strong>MUEVE EL DRON</strong>
                      <p>Haz clic en cualquier punto del mapa. El dron se desplazará hacia el objetivo.</p>
                    </div>
                  </section>
                  <section className="instruction-block">
                    <span className="instruction-number">02</span>
                    <div className="instruction-icon">◇</div>
                    <div>
                      <small>ARRECIFE SUPERFICIAL</small>
                      <strong>RECOLECTA GEMAS</strong>
                      <p>Múltiples gemas que desaparecen al contacto. Fomenta desplazamientos ágiles y continuos.</p>
                    </div>
                  </section>
                  <section className="instruction-block">
                    <span className="instruction-number">03</span>
                    <div className="instruction-icon">↕</div>
                    <div>
                      <small>TRANSICIÓN</small>
                      <strong>DOS RUTAS LIBRES</strong>
                      <p>Puedes descender a la cueva o ascender al arrecife en cualquier instante de la partida.</p>
                    </div>
                  </section>
                  <section className="instruction-block">
                    <span className="instruction-number">04</span>
                    <div className="instruction-icon">◉</div>
                    <div>
                      <small>CUEVA PROFUNDA</small>
                      <strong>COFRE CENTRAL</strong>
                      <p>La cueva oculta un único cofre central de alto valor (+500 créditos).</p>
                    </div>
                  </section>
                </div>

                <div className="chest-instruction">
                  <span className="chest-manual-icon">▣</span>
                  <div>
                    <small>OBJETIVO ESPECIAL · +500 CRÉDITOS</small>
                    <strong>¿CÓMO ABRIR EL COFRE?</strong>
                    <p>Ubica el dron sobre el cofre y permanece <b>exactamente 8 segundos inmóvil</b>. Cualquier clic en la pantalla reiniciará el contador a cero.</p>
                  </div>
                  <div className="hold-indicator">
                    <i />
                    <span>8s</span>
                  </div>
                </div>

                <div className="instructions-footer">
                  <p><i /> El cronómetro comenzará al seleccionar tu zona de inmersión.</p>
                  <button className="start-button" onClick={() => setPhase('briefing')}>
                    <span>ENTENDIDO, CONTINUAR</span>
                    <i>→</i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 2: BRIEFING PREVIO */}
          {phase === 'briefing' && (
            <div className="briefing-overlay">
              <div className="briefing-card">
                <span className="briefing-index">SIMULACIÓN CONDUCTUAL</span>
                <p className="briefing-kicker">INMERSIÓN LISTA</p>
                <h1>¿CÓMO INVERTIRÁS<br />TUS <em>40 SEGUNDOS?</em></h1>
                <p className="briefing-text">Elige libremente tu ruta inicial. Tu patrón de búsqueda espacial y motriz determinará el rendimiento de la exploración.</p>
                <div className="game-manual">
                  <div className="manual-heading">
                    <span>MANUAL DE INMERSIÓN</span>
                    <small>GUÍA RÁPIDA</small>
                  </div>
                  <div className="manual-steps">
                    <div>
                      <b>01</b>
                      <span className="manual-symbol">⌁</span>
                      <p><strong>MUÉVETE</strong>Haz clic para desplazar el dron por el mapa.</p>
                    </div>
                    <div>
                      <b>02</b>
                      <span className="manual-symbol">◇</span>
                      <p><strong>RECOLECTA</strong>Recoge gemas en el arrecife superficial.</p>
                    </div>
                    <div>
                      <b>03</b>
                      <span className="manual-symbol">▣</span>
                      <p><strong>CONCÉNTRATE</strong>Permanece 8 segundos inmóvil sobre el cofre.</p>
                    </div>
                  </div>
                </div>
                <button className="start-button" onClick={openZoneSelection}>
                  <span>INICIAR JUEGO</span>
                  <i>→</i>
                </button>
                <small>Selecciona tu zona para comenzar los 40 segundos</small>
              </div>
            </div>
          )}

          {/* MODAL 3: SELECCIÓN DE ZONA */}
          {phase === 'choosing' && (
            <div className="briefing-overlay">
              <div className="briefing-card zone-choice-card">
                <span className="briefing-index">SELECCIÓN DE RUTA</span>
                <p className="briefing-kicker">PLAN DE INMERSIÓN</p>
                <h1>ELIGE TU<br /><em>ZONA DE EXPLORACIÓN</em></h1>
                <p className="briefing-text">Define tu estrategia inicial. Puedes transicionar libremente de una zona a otra durante la partida.</p>
                <div className="zone-selector">
                  <button
                    className={`zone-option reef-option ${selectedZone === 'reef' ? 'selected' : ''}`}
                    onClick={() => setSelectedZone('reef')}
                  >
                    <span className="option-letter">A</span>
                    <span>
                      <small>PATRÓN EXPANSIVO</small>
                      <strong>ARRECIFE SUPERFICIAL</strong>
                      <p>Múltiples gemas. Movilidad rápida y saltos constantes de atención.</p>
                    </span>
                    <i>{selectedZone === 'reef' ? '✓' : '→'}</i>
                  </button>
                  <button
                    className={`zone-option cave-option ${selectedZone === 'cave' ? 'selected' : ''}`}
                    onClick={() => setSelectedZone('cave')}
                  >
                    <span className="option-letter">B</span>
                    <span>
                      <small>PATRÓN DE CONCENTRACIÓN</small>
                      <strong>CUEVA PROFUNDA</strong>
                      <p>Cofre central. Requiere 8 segundos absolutamente inmóvil.</p>
                    </span>
                    <i>{selectedZone === 'cave' ? '✓' : '→'}</i>
                  </button>
                </div>
                <button className="start-button" onClick={startGame} disabled={!selectedZone}>
                  <span>{selectedZone ? 'SUMERGIR DRON (40s)' : 'ELIGE UNA ZONA'}</span>
                  <i>→</i>
                </button>
                <small>La reserva de 40 segundos inicia de inmediato</small>
              </div>
            </div>
          )}

          {/* MODAL 4: PANTALLA DE RESULTADOS PSICOMÉTRICOS */}
          {phase === 'done' && (
            <div className="briefing-overlay">
              <div className="briefing-card results-card">
                <span className="briefing-index">EVALUACIÓN PSICOMÉTRICA CONCLUIDA</span>
                <p className="briefing-kicker">DIMENSIÓN CONDUCTUAL: EXTROVERSIÓN</p>
                <h1>PUNTUACIÓN <em>{calculatedExtroversion.toFixed(1)}/10.0</em></h1>
                <p style={{ fontSize: '0.85rem', color: '#90a8be', margin: '4px 0 16px 0' }}>
                  {calculatedExtroversion >= 5.0 ? 'Tendencia Extrovertida (Patrón Expansivo)' : 'Tendencia Introvertida (Patrón Focalizado)'}
                </p>

                <div className="result-stats">
                  <div>
                    <span>FREC. MOTRIZ</span>
                    <b>{frecuenciaMotriz}</b>
                    <small style={{ fontSize: '0.65rem', color: '#68849c' }}>clics (x0.08)</small>
                  </div>
                  <div>
                    <span>ÁREA EXPLORADA</span>
                    <b>{explorationPct}%</b>
                    <small style={{ fontSize: '0.65rem', color: '#68849c' }}>{areaExploradaDecimal.toFixed(2)} (x3.0)</small>
                  </div>
                  <div>
                    <span>ESTABILIDAD MÁX.</span>
                    <b>{estabilidadSostenida}s</b>
                    <small style={{ fontSize: '0.65rem', color: '#68849c' }}>inmóvil (-0.35)</small>
                  </div>
                  <div>
                    <span>CRÉDITOS</span>
                    <b>{score}</b>
                    <small style={{ fontSize: '0.65rem', color: '#68849c' }}>recolectados</small>
                  </div>
                </div>

                <div style={{ backgroundColor: '#132130', padding: '12px 16px', borderRadius: '8px', margin: '14px 0', border: '1px solid #20354b', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.68rem', color: '#7ba0be', fontWeight: 'bold' }}>FÓRMULA FACTORIAL APLICADA:</span>
                  <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#62d2db', margin: '4px 0 0 0' }}>
                    5.0 + ({frecuenciaMotriz} × 0.08) + ({areaExploradaDecimal.toFixed(2)} × 3.0) - ({estabilidadSostenida} × 0.35) = <strong>{calculatedExtroversion}</strong>
                  </p>
                </div>

                {onBack && (
                  <button
                    onClick={onBack}
                    style={{
                      marginBottom: '12px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    ← GUARDAR Y REGRESAR AL INICIO
                  </button>
                )}
                <button className="start-button" onClick={chooseAgain}>
                  <span>REPETIR EVALUACIÓN</span>
                  <i>←</i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BARRA LATERAL: TELEMETRÍA EN TIEMPO REAL */}
        
      </section>

      <footer>
        <span>OCEANIC BEHAVIORAL LAB · PICTO-PATH AI</span>
        <div><i /> SISTEMA DE TELEMETRÍA ESPACIAL NOMINAL</div>
        <p>SESIÓN #DRN-07-EXTRO</p>
      </footer>
    </main>
  );
}
