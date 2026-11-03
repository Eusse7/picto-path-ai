import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  BookOpen,
  Timer,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Zap,
  Eye,
  HelpCircle,
  Trophy,
  Flame,
  TrendingDown,
  Target,
  Shuffle,
  ArrowRight,
  Sliders,
  X
} from 'lucide-react';

/**
 * ======================================================================================
 * PICTO-PATH AI: MINIJUEGO DE PERCEPCIÓN SENSORIAL (SENSING GAME)
 * ILUSTRACIONES DE ALTO DETALLE VISUAL & PSICOMETRÍA CALIBRADA
 * ======================================================================================
 */

const MBTI_METADATA = {
  ISTJ: { name: 'El Inspector / Logista', role: 'Sentinela Práctico' },
  ISFJ: { name: 'El Defensor / Protector', role: 'Protector Compasivo' },
  INFJ: { name: 'El Consejero / Abogado', role: 'Visionario Empático' },
  INTJ: { name: 'El Arquitecto / Estratega', role: 'Planificador Analítico' },
  ISTP: { name: 'El Virtuoso / Artesano', role: 'Solucionador Pragmático' },
  ISFP: { name: 'El Aventurero / Artista', role: 'Explorador Sensorial' },
  INFP: { name: 'El Mediador / Soñador', role: 'Idealista Reflexivo' },
  INTP: { name: 'El Lógico / Pensador', role: 'Teórico Conceptual' },
  ESTP: { name: 'El Emprendedor / Dinámico', role: 'Actuador Energético' },
  ESFP: { name: 'El Animador / Espontáneo', role: 'Entusiasta Vital' },
  ENFP: { name: 'El Activista / Campeón', role: 'Motivador Creativo' },
  ENTP: { name: 'El Innovador / Visionario', role: 'Estratega Disruptivo' },
  ESTJ: { name: 'El Ejecutivo / Organizador', role: 'Director Metódico' },
  ESFJ: { name: 'El Cónsul / Colaborador', role: 'Facilitador Social' },
  ENFJ: { name: 'El Protagonista / Líder', role: 'Guía Inspirador' },
  ENTJ: { name: 'El Comandante / Director', role: 'Líder Decidido' }
};

const SCENARIO_KEYS = ['tech', 'adventure', 'lab', 'studio'];
const SCENARIOS = {
  tech: { id: 'tech', title: 'Nivel 1: Estación de Programación', subtitle: 'Oficina nocturna tech con setup dual y código', icon: '' },
  adventure: { id: 'adventure', title: 'Nivel 2: Paisaje de Fantasía', subtitle: 'Mundo de plataformas con castillo, portal y río', icon: '' },
  lab: { id: 'lab', title: 'Nivel 3: Laboratorio Científico', subtitle: 'Mesa de bioquímica, reactivos y microscopio', icon: '' },
  studio: { id: 'studio', title: 'Nivel 4: Taller Creativo de Arte', subtitle: 'Estudio de pintor con lienzos, óleos y tableta', icon: '' }
};

export default function SensingGame({ onBack, userDemographics, onScoreCalculated }) {
  const [demographics, setDemographics] = useState(userDemographics || {
    age: 24,
    gender: 'Female',
    education: 1,
    interest: 'Technology'
  });

  const [scores, setScores] = useState({
    introversion: 5.0,
    sensing: 5.0,
    thinking: 5.0,
    judging: 5.0
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [adviceResult, setAdviceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfographicOpen, setIsInfographicOpen] = useState(false);

  const handleScoreCalculated = (calculatedScore) => {
    setScores(prev => ({ ...prev, sensing: calculatedScore }));
    if (onScoreCalculated) {
      onScoreCalculated(calculatedScore);
    }
  };

  const handlePredict = () => {
    setIsLoading(true);
    setTimeout(() => {
      const eOrI = scores.introversion >= 5.0 ? 'E' : 'I';
      const sOrN = scores.sensing >= 5.0 ? 'S' : 'N';
      const tOrF = scores.thinking >= 5.0 ? 'T' : 'F';
      const jOrP = scores.judging >= 5.0 ? 'J' : 'P';
      const type = `${eOrI}${sOrN}${tOrF}${jOrP}`;
      const meta = MBTI_METADATA[type] || { name: 'Perfil MBTI', role: 'Personalidad' };

      const pred = {
        predicted_personality: type,
        personality_name: meta.name,
        personality_description: `Perfil cognitivo caracterizado por preferencia ${sOrN === 'S' ? 'Sensorial (Sensing - S)' : 'Intuitiva (Intuition - N)'}.`,
        dimensions: {
          energy: { letter: eOrI, trait: eOrI === 'E' ? 'Extroversión' : 'Introversión', score: scores.introversion },
          perception: { letter: sOrN, trait: sOrN === 'S' ? 'Sensorial (Sensing)' : 'Intuición (Intuition)', score: scores.sensing },
          judgment: { letter: tOrF, trait: tOrF === 'T' ? 'Pensamiento (Thinking)' : 'Sentimiento (Feeling)', score: scores.thinking },
          lifestyle: { letter: jOrP, trait: jOrP === 'J' ? 'Juicio (Judging)' : 'Percepción (Perceiving)', score: scores.judging }
        }
      };

      const isSensing = scores.sensing >= 5.0;
      const advice = {
        personality_type: type,
        personality_title: `${meta.name} (${type})`,
        cognitive_stack: isSensing ? 'Eje Sensorial Concreto' : 'Eje Intuitivo Conceptual',
        actionable_tips: [
          {
            domain: 'Desarrollo Profesional y Carreras Afines',
            headline: 'Alineación Estratégica Vocacional',
            recommendation: isSensing
              ? 'Sobresales en roles con resultados empíricos directos y ejecución técnica tangible (arquitectura de software, ingeniería de confiabilidad, análisis fáctico).'
              : 'Enfócate en roles de formulación conceptual, diseño estratégico e innovación holística sin restricciones rígidas de procedimiento.'
          },
          {
            domain: 'Manejo del Estrés y Regulación Emocional',
            headline: 'Protocolo de Resiliencia Cognitivo-Conductual',
            recommendation: isSensing
              ? 'Ante sobrecarga mental por burocracia abstracta, interactúa con el mundo físico mediante actividad táctil o ejercicio motor para restablecer la claridad cognitiva.'
              : 'Ante parálisis por sobreanálisis conceptual, utiliza la técnica de Timeboxing para acotar alternativas y ejecutar iteraciones concretas.'
          },
          {
            domain: 'Optimización del Estilo de Procesamiento (Sensing)',
            headline: 'Aprovechamiento del Sensing Score en la Toma de Decisiones',
            recommendation: `Puntaje obtenido: ${scores.sensing}/10. ${isSensing ? 'Tu detección de microdetalles físicos es sumamente veloz. Complementa esta agilidad con pausas deliberadas para evaluar el panorama sistémico.' : 'Tu estilo es global y conceptual. Utiliza listas de verificación visuales para evitar omitir microdetalles operativos en fases de cierre.'}`
          }
        ]
      };

      setPredictionResult(pred);
      setAdviceResult(advice);
      setIsLoading(false);

      setTimeout(() => {
        const el = document.getElementById('results-section-allinone');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 300);
  };

  const handleReset = () => {
    setPredictionResult(null);
    setAdviceResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px', color: '#f8fafc', fontFamily: 'var(--font-sans)' }}>
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
      {/* Encabezado */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '20px',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {onBack && (
            <button onClick={onBack} style={{ background: '#1e293b', color: '#f8fafc', border: '1px solid #334155', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ← Volver al Hub
            </button>
          )}
          <div style={{
            background: 'linear-gradient(135deg, #00e5ff, #6366f1)',
            padding: '12px',
            borderRadius: '14px',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
          }}>
            <BrainCircuit size={30} color="#0a0e1a" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Picto-Path AI <span style={{ fontSize: '0.9rem', color: '#00e5ff', fontWeight: 700 }}>• Minijuego de Percepción Sensorial</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0' }}>
              Desafío Visual "Encuentra las 5 Diferencias" & Clasificación MBTI con Árboles de Decisión
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsInfographicOpen(true)}
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            color: '#00e5ff',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={16} />
          Infografía Psicométrica
        </button>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <SensingGameSection
          onScoreCalculated={handleScoreCalculated}
          onBack={onBack}
          onOpenInfographic={() => setIsInfographicOpen(true)}
        />
      </main>

      {/* MODAL INFOGRÁFICO */}
      {isInfographicOpen && (
        <InfographicModal onClose={() => setIsInfographicOpen(false)} />
      )}
    </div>
  );
}

// ==========================================
// SECCIÓN 1: FORMULARIO DEMOGRÁFICO
// ==========================================
function DemographicsSection({ demographics, onChange }) {
  return (
    <div style={{ background: '#0f172a', padding: '22px 24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <span className="badge-tag badge-cyan">Paso 1 de 4</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>Datos Demográficos y Perfil</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Edad: <strong style={{ color: '#00e5ff' }}>{demographics.age} años</strong></label>
          <input
            type="range"
            min="18"
            max="65"
            value={demographics.age}
            onChange={(e) => onChange(prev => ({ ...prev, age: parseFloat(e.target.value) }))}
            style={{ width: '100%', accentColor: '#00e5ff', marginTop: '6px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Género:</label>
          <select
            value={demographics.gender}
            onChange={(e) => onChange(prev => ({ ...prev, gender: e.target.value }))}
            style={{ width: '100%', background: '#020617', color: '#f8fafc', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}
          >
            <option value="Female">Femenino</option>
            <option value="Male">Masculino</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Nivel Educativo:</label>
          <select
            value={demographics.education}
            onChange={(e) => onChange(prev => ({ ...prev, education: parseInt(e.target.value) }))}
            style={{ width: '100%', background: '#020617', color: '#f8fafc', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}
          >
            <option value={1}>Postgrado / Universitario Completo (1)</option>
            <option value={0}>Pregrado / Bachillerato (0)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Área de Interés Principal:</label>
          <select
            value={demographics.interest}
            onChange={(e) => onChange(prev => ({ ...prev, interest: e.target.value }))}
            style={{ width: '100%', background: '#020617', color: '#f8fafc', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}
          >
            <option value="Technology">Tecnología & Software</option>
            <option value="Arts">Artes & Creatividad</option>
            <option value="Sports">Deportes & Rendimiento</option>
            <option value="Others">Otras Áreas</option>
            <option value="Unknown">No Definido</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SECCIÓN 2: JUEGO VISUAL ENCUENTRA LAS DIFERENCIAS
// ==========================================
function SensingGameSection({ onScoreCalculated, onOpenInfographic, onBack }) {
  const TIME_LIMIT = 15;
  const idealTime = 4.0;
  const alpha = 0.5;
  const beta = 0.45;

  const [scenarioKey, setScenarioKey] = useState('adventure');
  const [gameState, setGameState] = useState('idle');
  const [finalScore, setFinalScore] = useState(5.0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [foundIds, setFoundIds] = useState([]);
  const [errors, setErrors] = useState(0);
  const [isErrorFlashing, setIsErrorFlashing] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [hudMessage, setHudMessage] = useState({
    type: 'info',
    text: 'Examina ambas escenas con cuidado. Detecta los 5 elementos modificados en la escena derecha.'
  });

  const timerRef = useRef(null);

  const startGame = () => {
    setGameState('playing');
    setElapsedTime(0);
    setFoundIds([]);
    setErrors(0);
    setHudMessage({
      type: 'info',
      text: '¡Cronómetro en marcha! Haz clic sobre las 5 diferencias antes de que se agote el tiempo.'
    });
  };

  const changeScenario = (key) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScenarioKey(key);
    setGameState('idle');
    setElapsedTime(0);
    setFoundIds([]);
    setErrors(0);
    setHudMessage({
      type: 'info',
      text: `Escenario cargado: ${SCENARIOS[key].title}. ¡Presiona Iniciar para jugar!`
    });
  };

  const nextScenario = () => {
    const idx = SCENARIO_KEYS.indexOf(scenarioKey);
    const nextKey = SCENARIO_KEYS[(idx + 1) % SCENARIO_KEYS.length];
    changeScenario(nextKey);
  };

  const randomizeScenario = () => {
    const available = SCENARIO_KEYS.filter(k => k !== scenarioKey);
    const nextKey = available[Math.floor(Math.random() * available.length)];
    changeScenario(nextKey);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const start = performance.now();
      timerRef.current = setInterval(() => {
        const sec = (performance.now() - start) / 1000;
        if (sec >= TIME_LIMIT) {
          setElapsedTime(TIME_LIMIT);
          finishGame(TIME_LIMIT, foundIds, errors);
        } else {
          setElapsedTime(sec);
        }
      }, 40);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, foundIds, errors]);

  const finishGame = (finalTime, currentFound, currentErrors) => {
    setGameState('completed');
    if (timerRef.current) clearInterval(timerRef.current);

    const hits = currentFound.length;
    const base = hits * 2.0;
    const errPen = currentErrors * alpha;
    const delay = Math.max(0, finalTime - idealTime);
    const timePen = beta * delay;
    const raw = base - errPen - timePen;
    const clamped = Math.round(Math.max(0, Math.min(10, raw)) * 100) / 100;

    setFinalScore(clamped);
    if (onScoreCalculated) {
      onScoreCalculated(clamped);
    }
  };

  const currentHits = foundIds.length;
  const currentBase = currentHits * 2.0;
  const currentErrPen = errors * alpha;
  const currentDelay = Math.max(0, elapsedTime - idealTime);
  const currentTimePen = beta * currentDelay;
  const liveRaw = currentBase - currentErrPen - currentTimePen;
  const liveScore = Math.round(Math.max(0, Math.min(10, liveRaw)) * 10) / 10;
  const isOverTime = currentDelay > 0;

  const handleObjectHit = (id) => {
    if (gameState !== 'playing' || foundIds.includes(id)) return;
    const next = [...foundIds, id];
    setFoundIds(next);
    setHudMessage({
      type: 'hit',
      text: `✓ ¡Diferencia encontrada! (${next.length} de 5 descubiertas)`
    });
    if (next.length === 5) {
      finishGame(elapsedTime, next, errors);
    }
  };

  const handleMissClick = () => {
    if (gameState !== 'playing') return;
    setErrors(prev => prev + 1);
    setIsErrorFlashing(true);
    setHudMessage({
      type: 'miss',
      text: `⚠️ Clic sin diferencia (-${alpha} pts)`
    });
    setTimeout(() => setIsErrorFlashing(false), 300);
  };

  return (
    <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
      {/* MODAL EMERGENTE DE INSTRUCCIONES */}
      {showInstructionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 11, 24, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            border: '2px solid #38bdf8',
            borderRadius: '24px',
            padding: '34px 30px',
            maxWidth: '680px',
            width: '100%',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowInstructionsModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '10px',
                borderRadius: '12px',
                color: '#38bdf8'
              }}>
                <BookOpen size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Instrucciones de la Misión
                </span>
                <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#f8fafc', fontWeight: 800 }}>
                  Percepción Sensorial
                </h3>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '20px' }}>
              En esta prueba psicométrica visual, compararás dos escenas de alto detalle para evaluar tu agudeza perceptiva concreta (Sensorial) versus abstracta (Intuición).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '22px' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>1. OBJETIVO</div>
                <div style={{ fontSize: '0.86rem', color: '#f1f5f9', marginTop: '4px', lineHeight: 1.4 }}>Encuentra los 5 elementos modificados en la escena derecha.</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>2. TIEMPO IDEAL</div>
                <div style={{ fontSize: '0.86rem', color: '#f1f5f9', marginTop: '4px', lineHeight: 1.4 }}>Tienes 15s en total. Resolver en menos de 4.0s no penaliza puntos.</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: 800 }}>3. PENALIZACIONES</div>
                <div style={{ fontSize: '0.86rem', color: '#f1f5f9', marginTop: '4px', lineHeight: 1.4 }}>Demora: -0.45 pts/segundo. Clics fallidos: -0.50 pts.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '10px' }}>
              <button
                onClick={() => setShowInstructionsModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#020617',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(56, 189, 248, 0.4)'
                }}
              >
                ▶ Entendido, Elegir Escenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selector de Escenarios con Botón de Instrucciones */}
      <div style={{
        background: '#070c18',
        padding: '12px 16px',
        borderRadius: '12px',
        border: '1px solid #1e293b',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: '#00e5ff', fontSize: '0.85rem' }}>Escenario Visual:</strong>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {SCENARIOS[scenarioKey].title} — <span style={{ color: '#64748b' }}>{SCENARIOS[scenarioKey].subtitle}</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {SCENARIO_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => changeScenario(k)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: scenarioKey === k ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: scenarioKey === k ? '#00e5ff' : '#94a3b8',
                border: scenarioKey === k ? '1px solid #00e5ff' : '1px solid #334155',
                cursor: 'pointer'
              }}
            >
              {SCENARIOS[k].icon} {SCENARIOS[k].title.split(':')[1]?.trim()}
            </button>
          ))}
          <button
            onClick={nextScenario}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: 'rgba(0, 229, 255, 0.15)',
              color: '#00e5ff',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Siguiente <ArrowRight size={14} />
          </button>
          <button
            onClick={randomizeScenario}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shuffle size={14} /> Azar
          </button>
          <button
            onClick={() => setShowInstructionsModal(true)}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={14} /> Instrucciones
          </button>
        </div>
      </div>

      {/* Telemetría Psicométrica */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        <div style={{ background: isOverTime ? 'rgba(239, 68, 68, 0.1)' : '#070c18', padding: '14px', borderRadius: '12px', border: isOverTime ? '1px solid #ef4444' : '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: isOverTime ? '#ef4444' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
            {isOverTime ? '⚠️ TIEMPO EXCEDIDO' : 'TIEMPO TRANSCURRIDO'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isOverTime ? '#ef4444' : '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {elapsedTime.toFixed(1)}s <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {TIME_LIMIT}s</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: isOverTime ? '#ef4444' : '#64748b' }}>
            {isOverTime ? `Demora extra: +${currentDelay.toFixed(1)}s` : `Ideal: < ${idealTime.toFixed(1)}s`}
          </div>
        </div>

        <div style={{ background: '#070c18', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>DIFERENCIAS HALLADAS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
            {currentHits} / 5
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981' }}>+{currentBase.toFixed(1)} pts (+2.0 c/u)</div>
        </div>

        <div style={{ background: isOverTime ? 'rgba(239, 68, 68, 0.1)' : '#070c18', padding: '14px', borderRadius: '12px', border: isOverTime ? '1px solid #ef4444' : '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: isOverTime ? '#ef4444' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>PÉRDIDA POR DEMORA</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isOverTime ? '#ef4444' : '#64748b', fontFamily: 'var(--font-mono)' }}>
            -{currentTimePen.toFixed(2)} pts
          </div>
          <div style={{ fontSize: '0.72rem', color: isOverTime ? '#ef4444' : '#64748b' }}>
            {isOverTime ? `-${beta} pts/seg por dudar` : 'Sin penalización activa'}
          </div>
        </div>

        <div style={{ background: '#070c18', padding: '14px', borderRadius: '12px', border: '2px solid #00e5ff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#00e5ff', fontWeight: 700, textTransform: 'uppercase' }}>SENSING SCORE VIVO</span>
            <span style={{ fontSize: '0.7rem', color: liveScore >= 5.0 ? '#00e5ff' : '#ef4444', fontWeight: 800 }}>
              {liveScore >= 5.0 ? 'Sensorial (S)' : 'Intuición (N)'}
            </span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>
            {liveScore.toFixed(2)} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 10</span>
          </div>
          <div style={{ height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
            <div style={{ height: '100%', width: `${(liveScore / 10) * 100}%`, background: '#00e5ff', transition: 'width 0.2s ease' }} />
          </div>
        </div>
      </div>

      {/* HUD Fijo sin saltos ni spoilers */}
      <div style={{
        height: '40px',
        background: '#070c18',
        border: hudMessage.type === 'hit' ? '1px solid #10b981' : hudMessage.type === 'miss' ? '1px solid #ef4444' : '1px solid #1e293b',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        fontSize: '0.82rem',
        fontWeight: 700,
        color: hudMessage.type === 'hit' ? '#10b981' : hudMessage.type === 'miss' ? '#ef4444' : '#94a3b8',
        marginBottom: '16px'
      }}>
        {hudMessage.type === 'hit' && <CheckCircle2 size={16} style={{ marginRight: '8px' }} />}
        {hudMessage.type === 'miss' && <AlertCircle size={16} style={{ marginRight: '8px' }} />}
        {hudMessage.type === 'info' && <Target size={16} color="#00e5ff" style={{ marginRight: '8px' }} />}
        <span>{hudMessage.text}</span>
      </div>

      {/* Doble Escenario Visual de Alta Resolución */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', position: 'relative' }}>
        {/* Izquierda: Original */}
        <div style={{ background: '#070c18', borderRadius: '14px', overflow: 'hidden', border: '1px solid #334155' }}>
          <div style={{ padding: '8px 14px', background: '#1e293b', fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8' }}>
            1. Escenario Original de Referencia
          </div>
          <div style={{ aspectRatio: '16/10', userSelect: 'none' }}>
            <RenderHighDetailScene scenario={scenarioKey} isModified={false} />
          </div>
        </div>

        {/* Derecha: Modificado */}
        <div style={{
          background: '#070c18',
          borderRadius: '14px',
          overflow: 'hidden',
          border: isErrorFlashing ? '2px solid #ef4444' : '1px solid #00e5ff',
          position: 'relative'
        }} className={isErrorFlashing ? 'animate-shake' : ''}>
          <div style={{ padding: '8px 14px', background: '#1e293b', fontSize: '0.78rem', fontWeight: 700, color: '#00e5ff', display: 'flex', justifyContent: 'space-between' }}>
            <span>2. Escenario Modificado (Haz Clic en el Objeto que Cambió)</span>
            <span style={{ color: isOverTime ? '#ef4444' : '#00e5ff' }}>
              {isOverTime ? `🔥 -${beta} pts/s` : '🎯 Clics directos'}
            </span>
          </div>
          <div style={{ aspectRatio: '16/10', userSelect: 'none', cursor: gameState === 'playing' ? 'crosshair' : 'default', position: 'relative' }}>
            <RenderHighDetailScene
              scenario={scenarioKey}
              isModified={true}
              onObjectHit={handleObjectHit}
              onMissClick={handleMissClick}
              foundIds={foundIds}
              gameState={gameState}
            />

            {/* Overlay Inicio */}
            {gameState === 'idle' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(7, 12, 24, 0.92)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                zIndex: 10
              }}>
                <Eye size={46} color="#00e5ff" style={{ marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>{SCENARIOS[scenarioKey].title}</h4>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', maxWidth: '420px', margin: '0 0 18px', lineHeight: 1.45 }}>
                  {SCENARIOS[scenarioKey].subtitle}.<br />
                  Puedes cambiar de mundo en la barra superior o presionar el botón para iniciar el cronómetro.
                </p>
                <button
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #00e5ff, #6366f1)',
                    color: '#0a0e1a',
                    fontWeight: 800,
                    fontSize: '0.98rem',
                    padding: '13px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
                  }}
                >
                  ▶ Iniciar Desafío en Este Escenario
                </button>
              </div>
            )}

            {/* Overlay Fin con Métricas, Fórmula Psicométrica y Botones */}
            {gameState === 'completed' && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(5, 11, 24, 0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                zIndex: 100000
              }}>
                <div style={{
                  maxWidth: '620px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #0d1728, #070d18)',
                  border: '1.5px solid #00e5ff',
                  borderRadius: '24px',
                  padding: '32px 28px',
                  textAlign: 'center',
                  boxShadow: '0 25px 60px rgba(0, 229, 255, 0.25)',
                  color: '#f8fafc'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(0, 229, 255, 0.15)',
                    color: '#00e5ff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <Trophy size={32} />
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00e5ff', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Evaluación Psicométrica Concluida
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 14px' }}>
                    Dimensión Conductual: Percepción Sensorial (S) vs Intuición (N)
                  </div>

                  <div style={{ fontSize: '3rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', margin: '0 0 4px' }}>
                    {finalScore.toFixed(1)} <span style={{ fontSize: '1.4rem', color: '#64748b' }}>/ 10.0</span>
                  </div>

                  <div style={{
                    display: 'inline-block',
                    padding: '5px 16px',
                    borderRadius: '9999px',
                    background: finalScore >= 5.0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                    color: finalScore >= 5.0 ? '#34d399' : '#c084fc',
                    border: `1px solid ${finalScore >= 5.0 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`,
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    marginBottom: '20px'
                  }}>
                    {finalScore >= 5.0 ? 'Tendencia Sensorial Concreta (S)' : 'Tendencia Intuitiva Conceptual (N)'}
                  </div>

                  {/* Grid de Métricas */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ background: '#0a1120', padding: '10px 6px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>ACIERTOS</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#34d399' }}>{foundIds.length}/5</div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>+{(foundIds.length * 2.0).toFixed(1)} pts</div>
                    </div>
                    <div style={{ background: '#0a1120', padding: '10px 6px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>TIEMPO</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc' }}>{elapsedTime.toFixed(1)}s</div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>ideal: ≤ 4.0s</div>
                    </div>
                    <div style={{ background: '#0a1120', padding: '10px 6px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>DEMORA</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: currentDelay > 0 ? '#ef4444' : '#34d399' }}>
                        +{currentDelay.toFixed(1)}s
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>-{(currentDelay * beta).toFixed(2)} pts</div>
                    </div>
                    <div style={{ background: '#0a1120', padding: '10px 6px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700 }}>ERRORES</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: errors > 0 ? '#ef4444' : '#34d399' }}>{errors}</div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>-{(errors * alpha).toFixed(2)} pts</div>
                    </div>
                  </div>

                  {/* Caja de Fórmula Psicométrica */}
                  <div style={{ background: '#070c18', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00e5ff', textTransform: 'uppercase' }}>
                      Fórmula Factorial Aplicada:
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                      ({foundIds.length} × 2.0) - ({errors} × 0.50) - ({currentDelay.toFixed(1)}s × 0.45) = <strong style={{ color: '#00e5ff' }}>{finalScore.toFixed(2)}</strong>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {onBack && (
                      <button
                        onClick={() => {
                          if (onScoreCalculated) onScoreCalculated(finalScore);
                          onBack();
                        }}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          padding: '14px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.94rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        ← GUARDAR Y REGRESAR AL INICIO
                      </button>
                    )}
                    <button
                      onClick={nextScenario}
                      style={{
                        background: 'transparent',
                        color: '#94a3b8',
                        border: '1px solid #334155',
                        padding: '10px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Repetir Evaluación (Otro Escenario)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SECCIÓN 3: PESTAÑAS DESPLEGABLES (0-10)
// ==========================================
function ScoreSelectorsSection({ scores, onChange, onPredict, isLoading }) {
  const DIMENSIONS = [
    { key: 'introversion', label: '1. Dimensión de Energía', high: 'Extroversión (E)', low: 'Introversión (I)' },
    { key: 'sensing', label: '2. Dimensión de Percepción (Sensing Score)', high: 'Sensorial (S)', low: 'Intuición (N)', isMain: true },
    { key: 'thinking', label: '3. Dimensión de Juicio', high: 'Pensamiento / Thinking (T)', low: 'Sentimiento / Feeling (F)' },
    { key: 'judging', label: '4. Dimensión de Estilo de Vida', high: 'Juicio / Judging (J)', low: 'Percepción / Perceiving (P)' }
  ];

  return (
    <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span className="badge-tag badge-cyan">Paso 3 de 4</span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 0', color: '#f8fafc' }}>
            Ajuste de Puntuaciones (Escala 0 a 10)
          </h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {DIMENSIONS.map(dim => {
          const val = scores[dim.key];
          return (
            <div
              key={dim.key}
              style={{
                background: '#070c18',
                padding: '16px',
                borderRadius: '12px',
                border: dim.isMain ? '2px solid #00e5ff' : '1px solid #334155'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: dim.isMain ? '#00e5ff' : '#f8fafc' }}>
                  {dim.label}
                </span>
                <select
                  value={val.toFixed(1)}
                  onChange={(e) => onChange(prev => ({ ...prev, [dim.key]: parseFloat(e.target.value) }))}
                  style={{ background: '#1e293b', color: '#00e5ff', border: '1px solid #334155', borderRadius: '6px', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 800 }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n.toFixed(1)}>{n.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={val}
                onChange={(e) => onChange(prev => ({ ...prev, [dim.key]: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: dim.isMain ? '#00e5ff' : '#6366f1' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                <span>{dim.low}</span>
                <strong style={{ color: '#f8fafc' }}>{val.toFixed(2)}</strong>
                <span>{dim.high}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button
          onClick={onPredict}
          disabled={isLoading}
          style={{
            background: 'linear-gradient(135deg, #00e5ff, #6366f1)',
            color: '#0a0e1a',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '13px 40px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
          }}
        >
          {isLoading ? 'Clasificando con Modelo de IA...' : '⚡ Clasificar Personalidad MBTI'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SECCIÓN 4: RESULTADOS & RAG ADVICE
// ==========================================
function ResultsSection({ result, advice, onReset }) {
  return (
    <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid #00e5ff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <span className="badge-tag badge-cyan">Paso 4 de 4</span>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, margin: '6px 0 0', color: '#f8fafc' }}>
            {result.personality_name} ({result.predicted_personality})
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0' }}>{result.personality_description}</p>
        </div>

        <button
          onClick={onReset}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#f8fafc',
            border: '1px solid #334155',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={16} style={{ marginRight: '6px' }} /> Nueva Evaluación
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {Object.entries(result.dimensions).map(([k, d]) => (
          <div key={k} style={{ background: '#070c18', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{d.trait}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00e5ff', fontFamily: 'var(--font-mono)' }}>{d.letter}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Score: {d.score}/10</div>
          </div>
        ))}
      </div>

      {advice && advice.actionable_tips && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px' }}>
            📚 Recomendaciones Basadas en Evidencia Científica (RAG)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {advice.actionable_tips.map((tip, idx) => (
              <div key={idx} style={{ background: '#070c18', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.7rem', color: '#00e5ff', fontWeight: 700, textTransform: 'uppercase' }}>
                  {tip.domain}
                </span>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '6px 0' }}>{tip.headline}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{tip.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// RENDERIZADOR DE ESCENARIOS DE ALTO DETALLE
// ==========================================
function RenderHighDetailScene({ scenario, isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  if (scenario === 'adventure') {
    return <AdventureHighDetailSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
  }
  if (scenario === 'lab') {
    return <LabHighDetailSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
  }
  if (scenario === 'studio') {
    return <StudioHighDetailSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
  }
  return <TechHighDetailSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
}

// ======================================================================================
// 1. ESCENARIO DE AVENTURA Y FANTASÍA (ILUSTRACIÓN RICA EN DETALLES Y CAPAS)
// ======================================================================================
function AdventureHighDetailSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  const bg = () => { if (gameState === 'playing' && onMissClick) onMissClick(); };

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified ? bg : undefined}>
      <defs>
        {/* Gradiente cielo nocturno */}
        <linearGradient id="advSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060c1d" />
          <stop offset="40%" stopColor="#0d1b3a" />
          <stop offset="75%" stopColor="#1e2952" />
          <stop offset="100%" stopColor="#2e2957" />
        </linearGradient>
        {/* Gradiente colinas lejanas */}
        <linearGradient id="advMntBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2447" />
          <stop offset="100%" stopColor="#0c1228" />
        </linearGradient>
        {/* Gradiente colina frontal */}
        <linearGradient id="advGrassFore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="60%" stopColor="#166534" />
          <stop offset="100%" stopColor="#0f3c21" />
        </linearGradient>
        {/* Gradiente agua del río */}
        <linearGradient id="advWater" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>

      {/* Cielo Cósmico */}
      <rect x="0" y="0" width="800" height="500" fill="url(#advSky)" />

      {/* Campo de estrellas centelleantes */}
      {[
        [40, 30, 1.5], [90, 80, 2], [150, 25, 1.2], [220, 60, 1.8], [280, 35, 1.5],
        [340, 85, 2], [410, 40, 1.2], [480, 75, 1.6], [540, 20, 2], [610, 65, 1.4],
        [680, 35, 2], [730, 80, 1.5], [770, 25, 1.8]
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" opacity={0.6 + (i % 4) * 0.12} />
      ))}

      {/* Cadena de Montañas Nevadas al Fondo */}
      <polygon points="40,280 180,90 320,280" fill="url(#advMntBack)" opacity="0.8" />
      <polygon points="150,132 180,90 210,132 195,124 180,138 165,125" fill="#e2e8f0" opacity="0.45" />

      <polygon points="240,310 420,70 600,310" fill="url(#advMntBack)" opacity="0.9" />
      <polygon points="380,126 420,70 460,126 440,115 420,132 400,118" fill="#e2e8f0" opacity="0.55" />

      <polygon points="500,320 660,110 820,320" fill="url(#advMntBack)" opacity="0.75" />
      <polygon points="630,150 660,110 690,150 675,142 660,154 645,144" fill="#e2e8f0" opacity="0.45" />

      {/* Nubes Flotantes Iluminadas */}
      <g fill="#334155" opacity="0.55">
        <path d="M30,120 Q55,95 85,115 Q115,100 135,125 Q160,130 150,155 Q130,175 70,165 Q35,160 30,120 Z" />
        <path d="M480,90 Q510,65 540,85 Q575,70 595,95 Q625,100 610,125 Q590,145 520,135 Q485,130 480,90 Z" />
      </g>

      {/* DIFERENCIA 1: ASTRO CELESTIAL (Sol Radiante vs Luna Mágica con Eclipse) */}
      <g transform="translate(100, 45)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 1)}>
        {isModified && <rect x="-25" y="-25" width="100" height="100" fill="transparent" />}
        {isModified ? (
          /* Luna Mágica de Neón con Eclipse y Destellos */
          <g>
            <circle cx="25" cy="25" r="30" fill="#a855f7" opacity="0.2" />
            <circle cx="25" cy="25" r="22" fill="#7c3aed" />
            <path d="M12,8 A 20 20 0 1 0 38,40 A 16 16 0 1 1 12,8 Z" fill="#e9d5ff" />
            <polygon points="52,10 54,16 60,16 55,20 57,26 52,22 47,26 49,20 44,16 50,16" fill="#fbbf24" />
          </g>
        ) : (
          /* Sol Dorado Radiante con Rayos Esculpidos */
          <g>
            <circle cx="25" cy="25" r="32" fill="#facc15" opacity="0.25" />
            <circle cx="25" cy="25" r="20" fill="#eab308" />
            <circle cx="25" cy="25" r="16" fill="#fde047" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="25" y1="2" x2="25" y2="-6"
                stroke="#facc15" strokeWidth="3" strokeLinecap="round"
                transform={`rotate(${angle} 25 25)`}
              />
            ))}
          </g>
        )}
        {isModified && foundIds.includes(1) && (
          <g>
            <circle cx="25" cy="25" r="36" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="25" cy="25" r="14" fill="#00e5ff" />
            <path d="M19,25 L23,29 L31,21" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Colina Media con Bosque de Pinos */}
      <path d="M-50,380 Q200,240 450,330 T900,340 L900,500 L-50,500 Z" fill="#0d2818" />
      {/* Siluetas de pinos en cresta */}
      {[60, 90, 120, 160, 200, 240, 280, 520, 560, 600, 640].map((px, i) => (
        <polygon key={i} points={`${px},${280 - (i % 3) * 6} ${px - 8},${305 - (i % 3) * 6} ${px + 8},${305 - (i % 3) * 6}`} fill="#091f13" />
      ))}

      {/* DIFERENCIA 4: TORREÓN MEDIEVAL EN COLINA DERECHA (Bandera Azul vs Dragón Carmesí) */}
      <g transform="translate(660, 130)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 4)}>
        {isModified && <rect x="-25" y="-35" width="100" height="180" fill="transparent" />}
        {/* Muro base con textura de sillares */}
        <polygon points="12,70 54,70 48,185 16,185" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        <rect x="26" y="105" width="14" height="24" rx="7" fill="#020617" stroke="#475569" strokeWidth="1" />
        <line x1="26" y1="117" x2="40" y2="117" stroke="#fbbf24" strokeWidth="2" />
        {/* Almenas superiores */}
        <rect x="6" y="55" width="54" height="16" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="14" y="47" width="10" height="10" fill="#475569" />
        <rect x="30" y="47" width="10" height="10" fill="#475569" />
        <rect x="46" y="47" width="10" height="10" fill="#475569" />
        {/* Techo cónico escamado */}
        <polygon points="33,8 4,55 62,55" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <line x1="33" y1="8" x2="33" y2="-18" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Bandera / Estandarte */}
        {isModified ? (
          /* Bandera carmesí de dragón ondeando a la derecha */
          <g>
            <polygon points="33,-18 78,-7 33,4" fill="#dc2626" />
            <polygon points="40,-13 46,-7 40,-1" fill="#facc15" />
            <circle cx="58" cy="-7" r="4" fill="#facc15" />
          </g>
        ) : (
          /* Bandera real azul cerúleo ondeando a la izquierda */
          <g>
            <polygon points="33,-18 -10,-7 33,4" fill="#0284c7" />
            <polygon points="26,-13 20,-7 26,-1" fill="#ffffff" />
          </g>
        )}
        {isModified && foundIds.includes(4) && (
          <g>
            <circle cx="38" cy="-5" r="35" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="38" cy="-5" r="14" fill="#00e5ff" />
            <path d="M32,-5 L36,-1 L44,-9" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Colina Delantera con Relieve y Césped Detallado */}
      <path d="M-20,430 Q250,290 550,380 T850,390 L850,500 L-20,500 Z" fill="url(#advGrassFore)" />
      <path d="M-20,455 Q250,315 550,405 T850,415 L850,500 L-20,500 Z" fill="#166534" opacity="0.6" />

      {/* DIFERENCIA 2: PORTAL MÁGICO DE PIEDRA (Vacío vs Gran Cristal Flotante de Neón) */}
      <g transform="translate(180, 230)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 2)}>
        {isModified && <rect x="-20" y="-15" width="105" height="125" fill="transparent" />}
        {/* Columnas megalíticas de piedra con sillares */}
        <rect x="0" y="25" width="18" height="75" rx="3" fill="#475569" stroke="#334155" strokeWidth="2" />
        <line x1="2" y1="45" x2="16" y2="45" stroke="#1e293b" strokeWidth="1.5" />
        <line x1="2" y1="70" x2="16" y2="70" stroke="#1e293b" strokeWidth="1.5" />

        <rect x="52" y="25" width="18" height="75" rx="3" fill="#475569" stroke="#334155" strokeWidth="2" />
        <line x1="54" y1="45" x2="68" y2="45" stroke="#1e293b" strokeWidth="1.5" />
        <line x1="54" y1="70" x2="68" y2="70" stroke="#1e293b" strokeWidth="1.5" />

        {/* Dintel curvado superior con runa tallada */}
        <path d="M-6,26 Q35,-4 76,26 L76,14 Q35,-16 -6,14 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
        <circle cx="35" cy="18" r="4" fill="#334155" />

        {/* Contenido del Portal */}
        {isModified && (
          <g>
            <polygon points="35,18 50,42 35,70 20,42" fill="#00e5ff" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="35" cy="44" r="22" fill="#00e5ff" opacity="0.3" />
            <circle cx="30" cy="38" r="3" fill="#ffffff" />
            <circle cx="40" cy="50" r="2.5" fill="#ffffff" />
          </g>
        )}

        {isModified && foundIds.includes(2) && (
          <g>
            <circle cx="35" cy="45" r="35" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="35" cy="45" r="14" fill="#00e5ff" />
            <path d="M29,45 L33,49 L41,41" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Árbol Centenario con Copa Follaje en Capas */}
      <path d="M430,350 C425,280 405,240 440,180 C475,240 455,280 465,350 Z" fill="#5c2c16" stroke="#3d1d0e" strokeWidth="3" />
      <path d="M420,350 Q430,330 440,310" stroke="#3d1d0e" strokeWidth="2" fill="none" />
      <path d="M460,350 Q450,330 445,300" stroke="#3d1d0e" strokeWidth="2" fill="none" />

      {/* Follaje volumétrico */}
      <ellipse cx="445" cy="165" rx="65" ry="52" fill="#15803d" />
      <ellipse cx="410" cy="140" rx="42" ry="34" fill="#16a34a" />
      <ellipse cx="480" cy="145" rx="45" ry="36" fill="#22c55e" />
      <ellipse cx="445" cy="120" rx="35" ry="28" fill="#4ade80" opacity="0.9" />

      {/* DIFERENCIA 3: PIE DEL ÁRBOL (Roca Musgosa vs Cofre de Oro con Gemas) */}
      <g transform="translate(465, 315)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 3)}>
        {isModified && <rect x="-15" y="-15" width="85" height="65" fill="transparent" />}
        {isModified ? (
          /* Cofre de Roble con Oro Brillante y Joyas */
          <g>
            <rect x="0" y="12" width="44" height="26" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <rect x="18" y="18" width="8" height="12" fill="#facc15" stroke="#78350f" strokeWidth="1" />
            <circle cx="22" cy="24" r="2" fill="#451a03" />
            <path d="M-3,12 Q22,-6 47,12" fill="#b45309" stroke="#451a03" strokeWidth="2.5" />
            {/* Montículo de monedas y gemas */}
            <circle cx="10" cy="9" r="5" fill="#facc15" stroke="#b45309" strokeWidth="1" />
            <circle cx="22" cy="7" r="5.5" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
            <circle cx="34" cy="8" r="5" fill="#facc15" stroke="#b45309" strokeWidth="1" />
            <polygon points="17,3 21,7 17,11 13,7" fill="#ef4444" />
            <polygon points="28,2 32,6 28,10 24,6" fill="#00e5ff" />
          </g>
        ) : (
          /* Roca Musgosa con Textura de Grietas */
          <g>
            <ellipse cx="22" cy="24" rx="24" ry="14" fill="#475569" stroke="#334155" strokeWidth="2" />
            <ellipse cx="16" cy="18" rx="14" ry="8" fill="#64748b" />
            <path d="M8,20 Q20,14 32,20" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="26" r="3" fill="#22c55e" />
            <circle cx="28" cy="24" r="2.5" fill="#22c55e" />
          </g>
        )}
        {isModified && foundIds.includes(3) && (
          <g>
            <circle cx="22" cy="18" r="34" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="22" cy="18" r="14" fill="#00e5ff" />
            <path d="M16,18 L20,22 L28,14" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Río Cristalino con Reflejos y Ondulaciones */}
      <path d="M140,445 Q320,395 500,445 Q320,500 140,445 Z" fill="url(#advWater)" />
      <path d="M220,435 Q320,420 420,435" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M260,455 Q330,445 400,455" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* DIFERENCIA 5: ESTANQUE (Hoja de Nenúfar Lisa vs Flor de Loto Rosa Neón) */}
      <g transform="translate(305, 420)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 5)}>
        {isModified && <rect x="-18" y="-18" width="80" height="60" fill="transparent" />}
        {/* Hoja de nenúfar esculpida */}
        <ellipse cx="22" cy="14" rx="26" ry="12" fill="#15803d" stroke="#166534" strokeWidth="2" />
        <line x1="22" y1="14" x2="44" y2="8" stroke="#071827" strokeWidth="2" />
        {isModified && (
          /* Flor de loto de fantasía de doble capa de pétalos */
          <g>
            <ellipse cx="22" cy="8" rx="16" ry="9" fill="#f43f5e" />
            <ellipse cx="14" cy="6" rx="10" ry="7" fill="#fb7185" />
            <ellipse cx="30" cy="6" rx="10" ry="7" fill="#fb7185" />
            <ellipse cx="22" cy="4" rx="8" ry="6" fill="#fda4af" />
            <circle cx="22" cy="6" r="3.5" fill="#facc15" />
          </g>
        )}
        {isModified && foundIds.includes(5) && (
          <g>
            <circle cx="22" cy="10" r="32" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="22" cy="10" r="14" fill="#00e5ff" />
            <path d="M16,10 L20,14 L28,6" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

// ======================================================================================
// 2. ESCENARIO TECH DE PROGRAMACIÓN (SETUP DUAL, CÓDIGO Y DETALLES URBANOS)
// ======================================================================================
function TechHighDetailSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  const bg = () => { if (gameState === 'playing' && onMissClick) onMissClick(); };

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified ? bg : undefined}>
      {/* Fondo habitación oscura */}
      <rect x="0" y="0" width="800" height="500" fill="#0b1120" />

      {/* Ventana Panorámica con Skyline de Ciudad Cyberpunk */}
      <rect x="35" y="30" width="160" height="200" rx="10" fill="#030712" stroke="#1e293b" strokeWidth="4" />
      {/* Rascacielos con luces de ventanas */}
      <rect x="50" y="90" width="30" height="140" fill="#0f172a" />
      <rect x="90" y="60" width="35" height="170" fill="#1e293b" />
      <rect x="135" y="100" width="30" height="130" fill="#0f172a" />
      {/* Luces de ventanas amarillas y cian */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <g key={i}>
          <rect x="55" y={105 + i * 18} width="6" height="4" fill="#facc15" opacity="0.8" />
          <rect x="100" y={75 + i * 22} width="8" height="5" fill="#00e5ff" opacity="0.7" />
          <rect x="145" y={115 + i * 18} width="6" height="4" fill="#facc15" opacity="0.8" />
        </g>
      ))}
      <circle cx="85" cy="55" r="14" fill="#f8fafc" opacity="0.85" />
      <line x1="35" y1="130" x2="195" y2="130" stroke="#1e293b" strokeWidth="3" />
      <line x1="115" y1="30" x2="115" y2="230" stroke="#1e293b" strokeWidth="3" />

      {/* Repisa Flotante Superior con Libros y Decoración */}
      <rect x="560" y="80" width="200" height="14" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1" />
      <rect x="575" y="94" width="8" height="22" fill="#1e293b" />
      <rect x="735" y="94" width="8" height="22" fill="#1e293b" />
      {/* Libros técnicos ordenados */}
      <rect x="580" y="32" width="16" height="48" rx="2" fill="#3b82f6" />
      <rect x="598" y="38" width="14" height="42" rx="2" fill="#10b981" />
      <rect x="614" y="28" width="18" height="52" rx="2" fill="#a855f7" />

      {/* DIFERENCIA 4: PLANTA EN LA REPISA (Cactus clásico vs Suculenta con Flores Violetas) */}
      <g transform="translate(655, 30)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 4)}>
        {isModified && <rect x="-15" y="-15" width="75" height="75" fill="transparent" />}
        <polygon points="8,48 34,48 38,26 4,26" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
        {isModified ? (
          /* Suculenta con hermosas flores púrpuras abiertas */
          <g>
            <circle cx="21" cy="18" r="12" fill="#9333ea" />
            <circle cx="12" cy="12" r="8" fill="#a855f7" />
            <circle cx="30" cy="12" r="8" fill="#c084fc" />
            <circle cx="21" cy="5" r="7" fill="#fbbf24" />
            <circle cx="21" cy="18" r="4.5" fill="#ffffff" />
          </g>
        ) : (
          /* Cactus espinoso clásico */
          <g>
            <rect x="16" y="8" width="10" height="20" rx="5" fill="#15803d" />
            <rect x="8" y="14" width="9" height="5" rx="2.5" fill="#16a34a" />
            <rect x="25" y="14" width="9" height="5" rx="2.5" fill="#16a34a" />
          </g>
        )}
        {isModified && foundIds.includes(4) && (
          <g>
            <circle cx="21" cy="24" r="34" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="21" cy="24" r="14" fill="#00e5ff" />
            <path d="M15,24 L19,28 L27,20" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Mesa de Trabajo de Madera Oscura con Bisel */}
      <polygon points="70,305 730,305 770,435 30,435" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      <rect x="90" y="435" width="24" height="65" fill="#0f172a" />
      <rect x="686" y="435" width="24" height="65" fill="#0f172a" />

      {/* Alfombrilla de Escritorio XXL */}
      <polygon points="200,345 600,345 630,425 170,425" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

      {/* Monitor Ultra-Wide Central con Soporte Ergonómico */}
      <rect x="360" y="260" width="80" height="48" rx="4" fill="#334155" />
      <ellipse cx="400" cy="308" rx="55" ry="9" fill="#1e293b" />
      <rect x="220" y="110" width="360" height="180" rx="10" fill="#020617" stroke="#38bdf8" strokeWidth="3.5" />
      <rect x="230" y="120" width="340" height="160" fill="#090d16" />

      {/* Líneas de Código en el Editor (VS Code Theme) */}
      <rect x="245" y="135" width="80" height="6" rx="2" fill="#38bdf8" />
      <rect x="245" y="150" width="130" height="5" rx="2" fill="#c084fc" />
      <rect x="260" y="162" width="150" height="5" rx="2" fill="#94a3b8" />
      <rect x="260" y="174" width="95" height="5" rx="2" fill="#22c55e" />
      <rect x="260" y="186" width="170" height="5" rx="2" fill="#94a3b8" />
      <rect x="245" y="200" width="115" height="5" rx="2" fill="#f59e0b" />

      {/* DIFERENCIA 5: MONITOR (Código Normal vs Alerta Roja de BUG) */}
      <g transform="translate(470, 205)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 5)}>
        {isModified && <rect x="-15" y="-12" width="105" height="55" fill="transparent" />}
        {isModified ? (
          /* Alerta Roja de Error en Código */
          <g>
            <rect x="0" y="0" width="75" height="24" rx="4" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="2" />
            <polygon points="12,17 7,7 17,7" fill="#ef4444" />
            <text x="22" y="16" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">FATAL BUG!</text>
            <line x1="-30" y1="28" x2="45" y2="28" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 2" />
          </g>
        ) : (
          /* Línea de código verde normal */
          <rect x="-20" y="8" width="75" height="5" rx="2" fill="#64748b" />
        )}
        {isModified && foundIds.includes(5) && (
          <g>
            <circle cx="35" cy="12" r="32" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="35" cy="12" r="14" fill="#00e5ff" />
            <path d="M29,12 L33,16 L41,8" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 3: POST-IT EN MARCO DEL MONITOR */}
      <g transform="translate(385, 95)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 3)}>
        {isModified && <rect x="-15" y="-10" width="65" height="55" fill="transparent" />}
        {isModified && (
          /* Nota adhesiva amarilla doblada en la esquina */
          <g>
            <rect x="0" y="0" width="34" height="30" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" rx="2" />
            <line x1="5" y1="9" x2="29" y2="9" stroke="#854d0e" strokeWidth="2" />
            <line x1="5" y1="16" x2="24" y2="16" stroke="#854d0e" strokeWidth="2" />
            <line x1="5" y1="23" x2="27" y2="23" stroke="#854d0e" strokeWidth="2" />
          </g>
        )}
        {isModified && foundIds.includes(3) && (
          <g>
            <circle cx="17" cy="15" r="30" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="17" cy="15" r="14" fill="#00e5ff" />
            <path d="M11,15 L15,19 L23,11" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Teclado Mecánico RGB y Ratón */}
      <polygon points="300,360 500,360 520,405 280,405" fill="#334155" stroke="#475569" strokeWidth="1.5" />
      <rect x="315" y="366" width="160" height="6" rx="2" fill="#64748b" />
      <rect x="310" y="378" width="170" height="6" rx="2" fill="#64748b" />
      <rect x="305" y="390" width="180" height="7" rx="2" fill="#00e5ff" opacity="0.8" />
      <ellipse cx="560" cy="385" rx="15" ry="22" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
      <line x1="560" y1="365" x2="560" y2="380" stroke="#00e5ff" strokeWidth="2" />

      {/* DIFERENCIA 2: SMARTPHONE VS MEMORIA USB EN LA MESA */}
      <g transform="translate(265, 370)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 2)}>
        {isModified && <rect x="-15" y="-12" width="75" height="55" fill="transparent" />}
        {isModified ? (
          /* Smartphone de alta gama con pantalla encendida */
          <g>
            <rect x="0" y="0" width="42" height="26" rx="5" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
            <rect x="4" y="3" width="34" height="20" rx="3" fill="#0284c7" />
            <circle cx="10" cy="13" r="3.5" fill="#ffffff" />
            <line x1="17" y1="10" x2="32" y2="10" stroke="#ffffff" strokeWidth="2" />
            <line x1="17" y1="15" x2="28" y2="15" stroke="#ffffff" strokeWidth="1.5" />
          </g>
        ) : (
          /* Memoria USB con tapa metálica */
          <g transform="translate(8, 6)">
            <rect x="0" y="0" width="20" height="10" rx="2" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            <rect x="20" y="2" width="8" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="7" cy="5" r="1.5" fill="#ffffff" />
          </g>
        )}
        {isModified && foundIds.includes(2) && (
          <g>
            <circle cx="21" cy="13" r="32" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="21" cy="13" r="14" fill="#00e5ff" />
            <path d="M15,13 L19,17 L27,9" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 1: TAZA DE CAFÉ HUMEANTE */}
      <g transform="translate(155, 320)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 1)}>
        {isModified && <rect x="-15" y="-15" width="70" height="65" fill="transparent" />}
        <ellipse cx="18" cy="4" rx="18" ry="7" fill={isModified ? "#f97316" : "#0284c7"} />
        <path d="M0,4 C0,26 7,38 18,38 C29,38 36,26 36,4 Z" fill={isModified ? "#ea580c" : "#0369a1"} stroke="#334155" strokeWidth="1.5" />
        <ellipse cx="18" cy="4" rx="15" ry="5" fill="#3e2723" />
        <path d="M34,12 C44,12 44,26 34,28" fill="none" stroke={isModified ? "#ea580c" : "#0369a1"} strokeWidth="4.5" strokeLinecap="round" />
        {/* Vapor ondulante */}
        <path d="M13,-4 Q18,-12 13,-19" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22,-5 Q27,-13 22,-20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
        {isModified && foundIds.includes(1) && (
          <g>
            <circle cx="18" cy="20" r="34" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="18" cy="20" r="14" fill="#00e5ff" />
            <path d="M12,20 L16,24 L24,16" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Lámpara de Escritorio con Cono de Luz */}
      <rect x="680" y="285" width="34" height="9" rx="2" fill="#475569" />
      <line x1="697" y1="285" x2="670" y2="220" stroke="#94a3b8" strokeWidth="4.5" />
      <line x1="670" y1="220" x2="615" y2="245" stroke="#94a3b8" strokeWidth="4.5" />
      <polygon points="605,235 628,240 610,265" fill="#facc15" />
    </svg>
  );
}

// ======================================================================================
// 3. ESCENARIO DE LABORATORIO CIENTÍFICO (EQUIPOS ANALÍTICOS Y CRISTALERÍA)
// ======================================================================================
function LabHighDetailSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  const bg = () => { if (gameState === 'playing' && onMissClick) onMissClick(); };

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified ? bg : undefined}>
      {/* Fondo azulejos de laboratorio */}
      <rect x="0" y="0" width="800" height="500" fill="#0a1424" />
      <rect x="0" y="380" width="800" height="120" fill="#142136" />
      {/* Cuadrícula de azulejos limpios */}
      <line x1="0" y1="120" x2="800" y2="120" stroke="#13233c" strokeWidth="1.5" />
      <line x1="0" y1="240" x2="800" y2="240" stroke="#13233c" strokeWidth="1.5" />
      <line x1="266" y1="0" x2="266" y2="380" stroke="#13233c" strokeWidth="1.5" />
      <line x1="533" y1="0" x2="533" y2="380" stroke="#13233c" strokeWidth="1.5" />

      {/* Repisa Superior con Reactivos y Frascos */}
      <rect x="500" y="70" width="260" height="14" rx="3" fill="#334155" />
      <rect x="520" y="24" width="24" height="46" rx="3" fill="#0284c7" />
      <rect x="555" y="30" width="20" height="40" rx="2" fill="#059669" />

      {/* DIFERENCIA 4: FRASCO BIOHAZARD EN REPISA */}
      <g transform="translate(640, 24)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 4)}>
        {isModified && <rect x="-15" y="-15" width="65" height="75" fill="transparent" />}
        {isModified ? (
          /* Frasco ámbar con alerta de riesgo biológico */
          <g>
            <rect x="0" y="0" width="34" height="46" rx="4" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            <rect x="9" y="-6" width="16" height="8" rx="2" fill="#713f12" />
            <polygon points="17,14 10,29 24,29" fill="#000000" />
            <circle cx="17,25" r="2.5" fill="#eab308" />
          </g>
        ) : (
          /* Frasco estándar */
          <g>
            <rect x="0" y="5" width="28" height="41" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
            <rect x="8" y="0" width="12" height="6" rx="2" fill="#92400e" />
          </g>
        )}
        {isModified && foundIds.includes(4) && (
          <g>
            <circle cx="17" cy="22" r="32" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="17" cy="22" r="14" fill="#00e5ff" />
            <path d="M11,22 L15,26 L23,18" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Mesa de Laboratorio de Resina Química */}
      <polygon points="60,310 740,310 780,430 20,430" fill="#1e2c42" stroke="#3b4d6b" strokeWidth="3" />
      <rect x="80" y="430" width="22" height="70" fill="#0f172a" />
      <rect x="700" y="430" width="22" height="70" fill="#0f172a" />

      {/* DIFERENCIA 1: MATRAZ ERLENMEYER (Líquido Azul vs Fucsia Neón Hirviendo) */}
      <g transform="translate(140, 300)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 1)}>
        {isModified && <rect x="-15" y="-15" width="75" height="80" fill="transparent" />}
        <rect x="15" y="0" width="14" height="24" fill="rgba(255,255,255,0.2)" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="22,22 42,58 2,58" fill="rgba(255,255,255,0.15)" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="22,34 40,57 4,57" fill={isModified ? "#ec4899" : "#06b6d4"} />
        {isModified && (
          <g>
            <circle cx="17" cy="42" r="3" fill="#ffffff" opacity="0.9" />
            <circle cx="27" cy="48" r="2.5" fill="#ffffff" opacity="0.9" />
            <circle cx="22" cy="12" r="2" fill="#ec4899" />
          </g>
        )}
        {isModified && foundIds.includes(1) && (
          <g>
            <circle cx="22" cy="38" r="34" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="22" cy="38" r="14" fill="#00e5ff" />
            <path d="M16,38 L20,42 L28,34" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 2: MICROSCOPIO (Lente Estándar vs Fluorescente Verde) */}
      <g transform="translate(260, 250)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 2)}>
        {isModified && <rect x="-15" y="-15" width="90" height="130" fill="transparent" />}
        <ellipse cx="30" cy="102" rx="28" ry="9" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <path d="M38,98 Q60,62 38,32 L22,32" fill="none" stroke="#475569" strokeWidth="11" strokeLinecap="round" />
        <rect x="14" y="16" width="18" height="38" rx="3" fill="#334155" />
        <rect x="10" y="6" width="26" height="11" rx="3" fill="#0f172a" />
        <polygon points="14,54 30,54 26,74 18,74" fill="#1e293b" />
        {isModified ? (
          <g>
            <rect x="18" y="74" width="9" height="14" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <circle cx="22" cy="90" r="8" fill="rgba(34, 197, 94, 0.4)" />
          </g>
        ) : (
          <rect x="19" y="74" width="7" height="11" fill="#64748b" />
        )}
        <rect x="8" y="85" width="34" height="6" fill="#0f172a" />
        {isModified && foundIds.includes(2) && (
          <g>
            <circle cx="26" cy="58" r="35" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="26" cy="58" r="14" fill="#00e5ff" />
            <path d="M20,58 L24,62 L32,54" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Monitor Espectral Central */}
      <rect x="420" y="260" width="60" height="50" rx="4" fill="#475569" />
      <ellipse cx="450" cy="310" rx="48" ry="9" fill="#334155" />
      <rect x="350" y="130" width="230" height="150" rx="8" fill="#020617" stroke="#38bdf8" strokeWidth="3" />
      <rect x="360" y="140" width="210" height="130" fill="#070c18" />

      {/* DIFERENCIA 3: MONITOR (Gráfica de Espectro vs Espiral ADN Fluorescente) */}
      <g transform="translate(365, 145)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 3)}>
        {isModified && <rect x="-10" y="-10" width="210" height="135" fill="transparent" />}
        {isModified ? (
          /* Espiral de ADN 3D Fluorescente */
          <g transform="translate(35, 25)">
            <path d="M10,15 Q40,42 70,15 T130,15" fill="none" stroke="#a855f7" strokeWidth="4" />
            <path d="M10,48 Q40,20 70,48 T130,48" fill="none" stroke="#38bdf8" strokeWidth="4" />
            <line x1="30" y1="28" x2="30" y2="36" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="50" y1="24" x2="50" y2="40" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="80" y1="22" x2="80" y2="42" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="110" y1="27" x2="110" y2="37" stroke="#ffffff" strokeWidth="2.5" />
          </g>
        ) : (
          /* Gráfica estándar */
          <g transform="translate(25, 35)">
            <line x1="0" y1="65" x2="170" y2="65" stroke="#334155" strokeWidth="2" />
            <polyline points="0,60 30,55 50,20 70,60 100,35 120,60 160,60" fill="none" stroke="#22c55e" strokeWidth="3.5" />
          </g>
        )}
        {isModified && foundIds.includes(3) && (
          <g>
            <circle cx="100" cy="60" r="36" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="100" cy="60" r="14" fill="#00e5ff" />
            <path d="M94,60 L98,64 L106,56" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 5: INSTRUMENTO EN BANDEJA (Pinzas vs Pipeta Digital) */}
      <g transform="translate(620, 360)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 5)}>
        {isModified && <rect x="-15" y="-12" width="95" height="50" fill="transparent" />}
        <polygon points="0,28 75,28 80,40 -5,40" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        {isModified ? (
          <g transform="translate(10, 12)">
            <rect x="0" y="5" width="50" height="14" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <rect x="12" y="8" width="18" height="8" fill="#ef4444" />
            <polygon points="50,9 64,12 50,15" fill="#94a3b8" />
          </g>
        ) : (
          <g transform="translate(14, 18)">
            <line x1="0" y1="2" x2="45" y2="4" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="0" y1="8" x2="45" y2="6" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>
        )}
        {isModified && foundIds.includes(5) && (
          <g>
            <circle cx="38" cy="24" r="30" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="38" cy="24" r="14" fill="#00e5ff" />
            <path d="M32,24 L36,28 L44,20" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

// ======================================================================================
// 4. ESCENARIO DE TALLER DE ARTE Y DISEÑO (LIENZOS, PINTURAS Y TABLETA)
// ======================================================================================
function StudioHighDetailSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  const bg = () => { if (gameState === 'playing' && onMissClick) onMissClick(); };

  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified ? bg : undefined}>
      {/* Fondo taller cálido */}
      <rect x="0" y="0" width="800" height="500" fill="#161224" />
      <rect x="0" y="380" width="800" height="120" fill="#241b34" />

      {/* DIFERENCIA 4: RELOJ DE PARED (Marca 3:00 vs 6:30) */}
      <g transform="translate(380, 35)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 4)}>
        {isModified && <rect x="-10" y="-10" width="65" height="65" fill="transparent" />}
        <circle cx="22" cy="22" r="26" fill="#1f1833" stroke="#e2e8f0" strokeWidth="3.5" />
        <circle cx="22" cy="22" r="3" fill="#e2e8f0" />
        {isModified ? (
          <g>
            <line x1="22" y1="22" x2="22" y2="38" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="22" y1="22" x2="11" y2="31" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <line x1="22" y1="22" x2="38" y2="22" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="22" y1="22" x2="22" y2="9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {isModified && foundIds.includes(4) && (
          <g>
            <circle cx="22" cy="22" r="32" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="22" cy="22" r="14" fill="#00e5ff" />
            <path d="M16,22 L20,26 L28,18" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 1: CUADRO EN LA PARED (Geométrico Frío vs Sol Ardiente al Óleo) */}
      <g transform="translate(75, 45)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 1)}>
        {isModified && <rect x="-10" y="-10" width="140" height="160" fill="transparent" />}
        <rect x="0" y="0" width="120" height="140" rx="4" fill="#0b0817" stroke="#ca8a04" strokeWidth="4.5" />
        {isModified ? (
          /* Cuadro Abstracto con Sol Flamígero Naranja/Rosa */
          <g>
            <circle cx="60" cy="60" r="32" fill="#f97316" />
            <polygon points="60,10 82,98 22,65" fill="#ec4899" opacity="0.75" />
            <line x1="15" y1="108" x2="105" y2="108" stroke="#38bdf8" strokeWidth="4.5" />
          </g>
        ) : (
          /* Cuadro Geométrico Bauhaus */
          <g>
            <rect x="28" y="28" width="64" height="64" rx="4" fill="#0284c7" />
            <circle cx="60" cy="60" r="22" fill="#38bdf8" />
            <line x1="15" y1="108" x2="105" y2="108" stroke="#64748b" strokeWidth="3.5" />
          </g>
        )}
        {isModified && foundIds.includes(1) && (
          <g>
            <circle cx="60" cy="70" r="38" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="60" cy="70" r="14" fill="#00e5ff" />
            <path d="M54,70 L58,74 L66,66" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Mesa de Taller de Roble con Herramientas */}
      <polygon points="70,305 730,305 770,430 30,430" fill="#31223e" stroke="#503766" strokeWidth="3" />
      <rect x="90" y="430" width="24" height="70" fill="#181022" />
      <rect x="680" y="430" width="24" height="70" fill="#181022" />

      {/* DIFERENCIA 2: PORTALÁPICES (Pinceles de Madera vs Rotuladores Neón) */}
      <g transform="translate(175, 310)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 2)}>
        {isModified && <rect x="-15" y="-15" width="65" height="75" fill="transparent" />}
        <rect x="6" y="20" width="28" height="36" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
        {isModified ? (
          <g>
            <rect x="10" y="0" width="6" height="24" rx="2" fill="#f97316" />
            <rect x="18" y="-6" width="6" height="28" rx="2" fill="#00e5ff" />
            <rect x="25" y="3" width="6" height="22" rx="2" fill="#ec4899" />
          </g>
        ) : (
          <g>
            <line x1="12" y1="0" x2="17" y2="24" stroke="#d97706" strokeWidth="3" />
            <polygon points="12,0 9,-5 15,-5" fill="#64748b" />
            <line x1="24" y1="-4" x2="20" y2="24" stroke="#d97706" strokeWidth="3" />
            <polygon points="24,-4 21,-9 27,-9" fill="#64748b" />
          </g>
        )}
        {isModified && foundIds.includes(2) && (
          <g>
            <circle cx="20" cy="26" r="32" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="20" cy="26" r="14" fill="#00e5ff" />
            <path d="M14,26 L18,30 L26,22" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 3: TABLETA DIGITAL (Apagada vs Boceto Ilustrado y Stylus Activo) */}
      <g transform="translate(315, 340)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 3)}>
        {isModified && <rect x="-15" y="-12" width="190" height="85" fill="transparent" />}
        <polygon points="10,0 155,0 165,58 0,58" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        <polygon points="18,6 147,6 155,52 10,52" fill={isModified ? "#1e1b4b" : "#020617"} />
        {isModified ? (
          <g>
            <path d="M42,36 Q82,12 122,32" fill="none" stroke="#a855f7" strokeWidth="3.5" />
            <circle cx="82" cy="22" r="9" fill="#38bdf8" />
            <line x1="145" y1="16" x2="172" y2="42" stroke="#00e5ff" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        ) : (
          <line x1="145" y1="16" x2="172" y2="42" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
        )}
        {isModified && foundIds.includes(3) && (
          <g>
            <circle cx="82" cy="30" r="36" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="82" cy="30" r="14" fill="#00e5ff" />
            <path d="M76,30 L80,34 L88,26" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* DIFERENCIA 5: PLANTA EN LA ESQUINA (Hojas Verdes vs Flores Rojas Exóticas) */}
      <g transform="translate(640, 215)" style={{ cursor: isModified ? 'pointer' : 'default' }} onClick={(e) => isModified && hit(e, 5)}>
        {isModified && <rect x="-15" y="-15" width="105" height="160" fill="transparent" />}
        <polygon points="20,115 52,115 60,62 12,62" fill="#78350f" />
        <path d="M36,62 Q20,20 42,0" fill="none" stroke="#15803d" strokeWidth="4.5" />
        {isModified ? (
          <g>
            <circle cx="42" cy="0" r="15" fill="#dc2626" />
            <circle cx="42" cy="0" r="5" fill="#facc15" />
            <ellipse cx="16" cy="26" rx="15" ry="9" fill="#16a34a" transform="rotate(-30 16 26)" />
            <ellipse cx="58" cy="22" rx="15" ry="9" fill="#16a34a" transform="rotate(30 58 22)" />
          </g>
        ) : (
          <g>
            <ellipse cx="42" cy="0" rx="19" ry="11" fill="#16a34a" />
            <ellipse cx="16" cy="26" rx="15" ry="9" fill="#15803d" transform="rotate(-30 16 26)" />
            <ellipse cx="58" cy="22" rx="15" ry="9" fill="#15803d" transform="rotate(30 58 22)" />
          </g>
        )}
        {isModified && foundIds.includes(5) && (
          <g>
            <circle cx="36" cy="46" r="36" stroke="#00e5ff" strokeWidth="3.5" fill="rgba(0, 229, 255, 0.25)" />
            <circle cx="36" cy="46" r="14" fill="#00e5ff" />
            <path d="M30,46 L34,50 L42,42" stroke="#0a0e1a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

// ==========================================
// MODAL INFOGRÁFICO
// ==========================================
function InfographicModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '820px', width: '100%', background: '#0d1322', border: '1px solid #00e5ff', borderRadius: '16px', padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <span className="badge-tag badge-cyan">Infografía Psicométrica</span>
            <h3 style={{ margin: '6px 0 0', fontSize: '1.3rem', color: '#f8fafc' }}>
              ¿Cómo influye el Tiempo en el Sensing Score?
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#f8fafc', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
          <div style={{ background: '#070c18', padding: '18px', borderRadius: '12px', border: '1px solid #00e5ff' }}>
            <h4 style={{ color: '#00e5ff', margin: '0 0 8px' }}>Rápido y Preciso (≤ 4.0s)</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', fontFamily: 'var(--font-mono)' }}>Score Alto (≥ 8.0)</div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5 }}>
              Foco en detalles físicos inmediatos sin sobreanálisis. Procesamiento perceptual ágil y concreto (Sensorial).
            </p>
          </div>
          <div style={{ background: '#070c18', padding: '18px', borderRadius: '12px', border: '1px solid #a855f7' }}>
            <h4 style={{ color: '#c084fc', margin: '0 0 8px' }}>Lento o con Dudas (&gt; 4.0s)</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444', fontFamily: 'var(--font-mono)' }}>Score Bajo (&lt; 5.0)</div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5 }}>
              La demora descuenta -0.45 pts por segundo. Foco en conceptos abstractos, patrones holísticos o significados (Intuición).
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ width: '100%', background: '#00e5ff', color: '#0a0e1a', fontWeight: 800, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
        >
          Entendido, Volver al Desafío
        </button>
      </div>
    </div>
  );
}
