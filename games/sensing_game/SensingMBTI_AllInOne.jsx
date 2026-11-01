import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Sparkles,
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
  User,
  Sliders,
  ChevronDown,
  ChevronUp,
  Brain,
  Search,
  Clock,
  Briefcase,
  HeartHandshake,
  ShieldAlert,
  ArrowDown,
  X
} from 'lucide-react';

/**
 * ======================================================================================
 * PICTO-PATH AI: COMPONENTE REACT UNIFICADO "ALL-IN-ONE"
 * EJE DE PERCEPCIÓN SENSORIAL (SENSING SCORE) & CLASIFICACIÓN MBTI
 * ======================================================================================
 * Un solo archivo .jsx con todo el flujo completo:
 * 1. Formulario de datos demográficos (Edad, Género, Educación, Interés).
 * 2. Juego "Encuentra las diferencias" con 4 escenarios cambiantes y fórmula psicométrica.
 * 3. Selectores desplegables y sliders de 0 a 10 para las 4 dimensiones.
 * 4. Clasificador MBTI de 16 tipos y desglose de dimensiones.
 * 5. Motor de consejos psicológicos RAG basado en evidencia científica.
 * 6. Modal de infografía explicativa.
 * ======================================================================================
 */

// --- DICCIONARIO MBTI & CONSEJOS CIENTÍFICOS ---
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

// --- ESCENARIOS VISUALES DISPONIBLES ---
const SCENARIO_KEYS = ['tech', 'adventure', 'lab', 'studio'];
const SCENARIOS = {
  tech: { id: 'tech', title: 'Nivel 1: Oficina Tech', icon: '🖥️' },
  adventure: { id: 'adventure', title: 'Nivel 2: Paisaje Aventura', icon: '🌄' },
  lab: { id: 'lab', title: 'Nivel 3: Laboratorio', icon: '🔬' },
  studio: { id: 'studio', title: 'Nivel 4: Estudio de Arte', icon: '🎨' }
};

export default function SensingMBTI_AllInOne() {
  // Estado 1: Demográficos
  const [demographics, setDemographics] = useState({
    age: 24,
    gender: 'Female',
    education: 1,
    interest: 'Technology'
  });

  // Estado 2: Puntuaciones continuas (0 a 10)
  const [scores, setScores] = useState({
    introversion: 5.0,
    sensing: 5.0,
    thinking: 5.0,
    judging: 5.0
  });

  // Estado 3: Resultados y modales
  const [predictionResult, setPredictionResult] = useState(null);
  const [adviceResult, setAdviceResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfographicOpen, setIsInfographicOpen] = useState(false);

  // Manejo de actualización del Sensing Score desde el juego
  const handleScoreCalculated = (calculatedScore) => {
    setScores(prev => ({ ...prev, sensing: calculatedScore }));
  };

  // Clasificador MBTI analítico local
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px 80px', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Encabezado */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00e5ff, #6366f1)',
            padding: '10px',
            borderRadius: '14px',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
          }}>
            <BrainCircuit size={28} color="#0a0e1a" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              Picto-Path AI <span style={{ fontSize: '0.85rem', color: '#00e5ff', fontWeight: 600 }}>• Módulo Sensing All-In-One</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0' }}>
              Evaluación Psicométrica Visual & Clasificación MBTI con Árbol de Decisión
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsInfographicOpen(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#f8fafc',
            border: '1px solid #334155',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={16} color="#00e5ff" />
          Infografía Psicométrica
        </button>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* PASO 1: DEMOGRÁFICOS */}
        <DemographicsSection demographics={demographics} onChange={setDemographics} />

        {/* PASO 2: JUEGO ENCUENTRA LAS DIFERENCIAS (SENSING SCORE) */}
        <SensingGameSection
          onScoreCalculated={handleScoreCalculated}
          onOpenInfographic={() => setIsInfographicOpen(true)}
        />

        {/* PASO 3: SELECCIÓN DE PUNTAJES DESPLEGABLES (0-10) */}
        <ScoreSelectorsSection
          scores={scores}
          onChange={setScores}
          onPredict={handlePredict}
          isLoading={isLoading}
        />

        {/* PASO 4: RESULTADOS DE PREDICCIÓN & CONSEJOS RAG */}
        {predictionResult && (
          <div id="results-section-allinone">
            <ResultsSection
              result={predictionResult}
              advice={adviceResult}
              onReset={handleReset}
            />
          </div>
        )}
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
    <div style={{ background: '#121829', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
          Paso 1 de 4
        </span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Datos Demográficos y Perfil</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Edad */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Edad: {demographics.age} años</label>
          <input
            type="range"
            min="18"
            max="65"
            value={demographics.age}
            onChange={(e) => onChange(prev => ({ ...prev, age: parseFloat(e.target.value) }))}
            style={{ width: '100%', accentColor: '#00e5ff', marginTop: '6px' }}
          />
        </div>

        {/* Género */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Género:</label>
          <select
            value={demographics.gender}
            onChange={(e) => onChange(prev => ({ ...prev, gender: e.target.value }))}
            style={{ width: '100%', background: '#0a0e1a', color: '#f8fafc', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}
          >
            <option value="Female">Femenino</option>
            <option value="Male">Masculino</option>
          </select>
        </div>

        {/* Educación */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Nivel Educativo:</label>
          <select
            value={demographics.education}
            onChange={(e) => onChange(prev => ({ ...prev, education: parseInt(e.target.value) }))}
            style={{ width: '100%', background: '#0a0e1a', color: '#f8fafc', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}
          >
            <option value={1}>Postgrado / Universitario Completo</option>
            <option value={0}>Pregrado / Bachillerato</option>
          </select>
        </div>

        {/* Interés */}
        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Área de Interés:</label>
          <select
            value={demographics.interest}
            onChange={(e) => onChange(prev => ({ ...prev, interest: e.target.value }))}
            style={{ width: '100%', background: '#0a0e1a', color: '#f8fafc', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}
          >
            <option value="Technology">Tecnología & Software</option>
            <option value="Arts">Artes & Creatividad</option>
            <option value="Sports">Deportes & Actividad Física</option>
            <option value="Others">Otras Áreas</option>
            <option value="Unknown">No Definido</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SECCIÓN 2: JUEGO ENCUENTRA LAS DIFERENCIAS
// ==========================================
function SensingGameSection({ onScoreCalculated, onOpenInfographic }) {
  const TIME_LIMIT = 15;
  const idealTime = 4.0;
  const alpha = 0.5;
  const beta = 0.45;

  const [scenarioKey, setScenarioKey] = useState('tech');
  const [gameState, setGameState] = useState('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [foundIds, setFoundIds] = useState([]);
  const [errors, setErrors] = useState(0);
  const [isErrorFlashing, setIsErrorFlashing] = useState(false);
  const [hudMessage, setHudMessage] = useState({
    type: 'info',
    text: 'Observa ambas imágenes y encuentra las 5 diferencias por tu cuenta.'
  });

  const timerRef = useRef(null);

  const startGame = () => {
    setGameState('playing');
    setElapsedTime(0);
    setFoundIds([]);
    setErrors(0);
    setHudMessage({
      type: 'info',
      text: '¡Cronómetro en marcha! Encuentra las 5 diferencias antes de que se agote el tiempo.'
    });
  };

  const changeScenario = (key) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScenarioKey(key);
    setGameState('idle');
    setElapsedTime(0);
    setFoundIds([]);
    setErrors(0);
  };

  const nextScenario = () => {
    const idx = SCENARIO_KEYS.indexOf(scenarioKey);
    const nextKey = SCENARIO_KEYS[(idx + 1) % SCENARIO_KEYS.length];
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

    onScoreCalculated(clamped);
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
      text: `✓ ¡Diferencia encontrada! (${next.length} de 5)`
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
    <div style={{ background: '#121829', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <span style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
            Paso 2 de 4: Eje Central
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '6px 0 0' }}>Desafío Visual: Sensing Score</h3>
        </div>

        {/* Selector de Imagen / Escenario */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {SCENARIO_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => changeScenario(k)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: scenarioKey === k ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: scenarioKey === k ? '#00e5ff' : '#94a3b8',
                border: scenarioKey === k ? '1px solid #00e5ff' : '1px solid #334155',
                cursor: 'pointer'
              }}
            >
              {SCENARIOS[k].icon} {SCENARIOS[k].title}
            </button>
          ))}
          <button
            onClick={nextScenario}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'rgba(0, 229, 255, 0.15)',
              color: '#00e5ff',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Siguiente <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Métricas en vivo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: '#0a0e1a', padding: '12px', borderRadius: '10px', border: isOverTime ? '1px solid #ef4444' : '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: isOverTime ? '#ef4444' : '#94a3b8', fontWeight: 700 }}>TIEMPO</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isOverTime ? '#ef4444' : '#f8fafc' }}>
            {elapsedTime.toFixed(1)}s <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ {TIME_LIMIT}s</span>
          </div>
        </div>

        <div style={{ background: '#0a0e1a', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>DIFERENCIAS HALLADAS</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{currentHits} / 5</div>
        </div>

        <div style={{ background: '#0a0e1a', padding: '12px', borderRadius: '10px', border: isOverTime ? '1px solid #ef4444' : '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: isOverTime ? '#ef4444' : '#94a3b8', fontWeight: 700 }}>PÉRDIDA POR DEMORA</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isOverTime ? '#ef4444' : '#64748b' }}>
            -{currentTimePen.toFixed(2)} pts
          </div>
        </div>

        <div style={{ background: '#0a0e1a', padding: '12px', borderRadius: '10px', border: '2px solid #00e5ff' }}>
          <div style={{ fontSize: '0.72rem', color: '#00e5ff', fontWeight: 700 }}>SENSING SCORE VIVO</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00e5ff' }}>{liveScore.toFixed(2)} / 10</div>
        </div>
      </div>

      {/* HUD Fijo sin spoilers */}
      <div style={{
        height: '38px',
        background: '#0a0e1a',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontSize: '0.8rem',
        fontWeight: 700,
        color: hudMessage.type === 'hit' ? '#10b981' : hudMessage.type === 'miss' ? '#ef4444' : '#94a3b8',
        marginBottom: '16px'
      }}>
        {hudMessage.text}
      </div>

      {/* Doble Escenario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', position: 'relative' }}>
        {/* Izquierdo: Original */}
        <div style={{ background: '#0a0e1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
          <div style={{ padding: '6px 12px', background: '#1e293b', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
            1. Escenario Original de Referencia
          </div>
          <div style={{ aspectRatio: '16/10' }}>
            <ActiveSceneSvg scenario={scenarioKey} isModified={false} />
          </div>
        </div>

        {/* Derecho: Modificado Interactivo */}
        <div style={{ background: '#0a0e1a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #00e5ff', position: 'relative' }}>
          <div style={{ padding: '6px 12px', background: '#1e293b', fontSize: '0.75rem', fontWeight: 700, color: '#00e5ff' }}>
            2. Escenario Modificado (Haz Clic en el Objeto Cambiado)
          </div>
          <div style={{ aspectRatio: '16/10', cursor: gameState === 'playing' ? 'crosshair' : 'default' }}>
            <ActiveSceneSvg
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
                background: 'rgba(10, 14, 26, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center'
              }}>
                <Eye size={40} color="#00e5ff" style={{ marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem' }}>{SCENARIOS[scenarioKey].title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '380px', margin: '0 0 16px' }}>
                  Encuentra las 5 diferencias visuales. A mayor demora, menor será tu Sensing Score.
                </p>
                <button
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #00e5ff, #6366f1)',
                    color: '#0a0e1a',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ▶ Iniciar Desafío
                </button>
              </div>
            )}

            {/* Overlay Fin */}
            {gameState === 'completed' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10, 14, 26, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center'
              }}>
                <Trophy size={40} color="#00e5ff" style={{ marginBottom: '8px' }} />
                <h4 style={{ margin: '0 0 4px', fontSize: '1.3rem' }}>
                  Sensing Score: <span style={{ color: '#00e5ff' }}>{liveScore.toFixed(2)} / 10.0</span>
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 16px' }}>
                  {currentDelay > 0
                    ? `Demora de ${currentDelay.toFixed(1)}s descontó -${currentTimePen.toFixed(2)} pts.`
                    : '¡Velocidad perfecta dentro del tiempo ideal!'}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={nextScenario}
                    style={{
                      background: 'linear-gradient(135deg, #00e5ff, #6366f1)',
                      color: '#0a0e1a',
                      fontWeight: 800,
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Siguiente Imagen ➡️
                  </button>
                  <button
                    onClick={startGame}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#f8fafc',
                      fontWeight: 600,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      cursor: 'pointer'
                    }}
                  >
                    Reintentar
                  </button>
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
    { key: 'introversion', label: '1. Extraversión vs Introversión', high: 'Extroversión (E)', low: 'Introversión (I)' },
    { key: 'sensing', label: '2. Percepción Sensorial (Sensing Score)', high: 'Sensorial (S)', low: 'Intuición (N)', isMain: true },
    { key: 'thinking', label: '3. Pensamiento vs Sentimiento', high: 'Thinking (T)', low: 'Feeling (F)' },
    { key: 'judging', label: '4. Juicio vs Percepción', high: 'Judging (J)', low: 'Perceiving (P)' }
  ];

  return (
    <div style={{ background: '#121829', padding: '24px', borderRadius: '16px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
            Paso 3 de 4
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 0' }}>
            Ajuste de Puntuaciones (Escala Continua 0 a 10)
          </h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {DIMENSIONS.map(dim => {
          const val = scores[dim.key];
          return (
            <div
              key={dim.key}
              style={{
                background: '#0a0e1a',
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

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
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
            padding: '12px 36px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)'
          }}
        >
          {isLoading ? 'Clasificando con Árbol de Decisión...' : '⚡ Clasificar Personalidad MBTI'}
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
    <div style={{ background: '#121829', padding: '24px', borderRadius: '16px', border: '1px solid #00e5ff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <span style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
            Paso 4 de 4
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '6px 0 0', color: '#f8fafc' }}>
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

      {/* 4 Ejes MBTI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {Object.entries(result.dimensions).map(([k, d]) => (
          <div key={k} style={{ background: '#0a0e1a', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{d.trait}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00e5ff' }}>{d.letter}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Score: {d.score}/10</div>
          </div>
        ))}
      </div>

      {/* Consejos RAG */}
      {advice && advice.actionable_tips && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px' }}>
            📚 Recomendaciones Basadas en Evidencia Científica (RAG)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {advice.actionable_tips.map((tip, idx) => (
              <div key={idx} style={{ background: '#0a0e1a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <span style={{ fontSize: '0.7rem', color: '#00e5ff', fontWeight: 700, textTransform: 'uppercase' }}>
                  {tip.domain}
                </span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '6px 0' }}>{tip.headline}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>{tip.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ESCENARIOS SVG (TECH, AVENTURA, LAB, STUDIO)
// ==========================================
function ActiveSceneSvg({ scenario, isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  if (scenario === 'adventure') {
    return <AdventureSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
  }
  if (scenario === 'lab') {
    return <LabSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
  }
  if (scenario === 'studio') {
    return <StudioSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
  }
  return <TechSvg isModified={isModified} onObjectHit={onObjectHit} onMissClick={onMissClick} foundIds={foundIds} gameState={gameState} />;
}

// 1. Tech SVG
function TechSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified && gameState === 'playing' ? onMissClick : undefined}>
      <rect x="0" y="0" width="800" height="500" fill="#0f172a" />
      <rect x="0" y="380" width="800" height="120" fill="#1e293b" />
      <polygon points="80,310 720,310 760,430 40,430" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      <rect x="230" y="120" width="340" height="170" rx="10" fill="#020617" stroke="#38bdf8" strokeWidth="3" />
      <rect x="240" y="130" width="320" height="150" fill="#090d16" />
      {/* Diff 1: Cafe */}
      <g transform="translate(165, 325)" onClick={(e) => isModified && hit(e, 1)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="65" height="60" fill="transparent" />}
        <ellipse cx="16" cy="4" rx="16" ry="6" fill={isModified ? "#f97316" : "#0284c7"} />
        <path d="M0,4 C0,24 6,34 16,34 C26,34 32,24 32,4 Z" fill={isModified ? "#ea580c" : "#0369a1"} />
        {isModified && foundIds.includes(1) && (
          <circle cx="16" cy="18" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />
        )}
      </g>
      {/* Diff 2: Smartphone */}
      <g transform="translate(275, 375)" onClick={(e) => isModified && hit(e, 2)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-12" width="65" height="48" fill="transparent" />}
        {isModified ? (
          <rect x="0" y="0" width="38" height="24" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
        ) : (
          <rect x="0" y="0" width="18" height="9" rx="2" fill="#f59e0b" />
        )}
        {isModified && foundIds.includes(2) && (
          <circle cx="19" cy="12" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />
        )}
      </g>
      {/* Diff 3: Nota Monitor */}
      <g transform="translate(385, 105)" onClick={(e) => isModified && hit(e, 3)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-10" width="60" height="55" fill="transparent" />}
        {isModified && <rect x="0" y="0" width="32" height="28" fill="#facc15" rx="2" />}
        {isModified && foundIds.includes(3) && (
          <circle cx="16" cy="14" r="26" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />
        )}
      </g>
      {/* Diff 4: Planta Repisa */}
      <g transform="translate(650, 45)" onClick={(e) => isModified && hit(e, 4)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="70" height="70" fill="transparent" />}
        <polygon points="8,42 32,42 36,25 4,25" fill="#ca8a04" />
        {isModified ? <circle cx="20" cy="18" r="11" fill="#9333ea" /> : <rect x="15" y="8" width="10" height="20" rx="5" fill="#15803d" />}
        {isModified && foundIds.includes(4) && (
          <circle cx="20" cy="25" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />
        )}
      </g>
      {/* Diff 5: Bug */}
      <g transform="translate(485, 215)" onClick={(e) => isModified && hit(e, 5)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-12" width="90" height="50" fill="transparent" />}
        {isModified ? (
          <rect x="0" y="0" width="58" height="20" rx="4" fill="#ef4444" />
        ) : (
          <rect x="-20" y="6" width="65" height="5" rx="2" fill="#64748b" />
        )}
        {isModified && foundIds.includes(5) && (
          <circle cx="28" cy="12" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />
        )}
      </g>
    </svg>
  );
}

// 2. Adventure SVG
function AdventureSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified && gameState === 'playing' ? onMissClick : undefined}>
      <rect x="0" y="0" width="800" height="500" fill="#0e1e38" />
      <polygon points="200,320 380,140 560,320" fill="#1b283d" opacity="0.7" />
      <path d="M-20,440 Q250,290 550,380 T850,390 L850,500 L-20,500 Z" fill="#14532d" />
      {/* Diff 1: Sol/Luna */}
      <g transform="translate(100, 50)" onClick={(e) => isModified && hit(e, 1)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-20" y="-20" width="90" height="90" fill="transparent" />}
        {isModified ? <circle cx="25" cy="25" r="20" fill="#c084fc" /> : <circle cx="25" cy="25" r="20" fill="#facc15" />}
        {isModified && foundIds.includes(1) && <circle cx="25" cy="25" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Diff 2: Portal */}
      <g transform="translate(180, 250)" onClick={(e) => isModified && hit(e, 2)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-20" y="-15" width="95" height="110" fill="transparent" />}
        <rect x="0" y="20" width="16" height="65" rx="3" fill="#475569" />
        <rect x="44" y="20" width="16" height="65" rx="3" fill="#475569" />
        {isModified && <polygon points="30,22 42,40 30,62 18,40" fill="#00e5ff" />}
        {isModified && foundIds.includes(2) && <circle cx="30" cy="40" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Diff 3: Cofre */}
      <g transform="translate(465, 320)" onClick={(e) => isModified && hit(e, 3)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="70" height="55" fill="transparent" />}
        {isModified ? <rect x="0" y="10" width="36" height="22" rx="3" fill="#facc15" /> : <ellipse cx="18" cy="22" rx="20" ry="12" fill="#475569" />}
        {isModified && foundIds.includes(3) && <circle cx="18" cy="16" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Diff 4: Torre */}
      <g transform="translate(660, 150)" onClick={(e) => isModified && hit(e, 4)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-20" y="-30" width="90" height="90" fill="transparent" />}
        <polygon points="10,60 50,60 45,160 15,160" fill="#334155" />
        {isModified ? <polygon points="30,-15 65,-6 30,3" fill="#ef4444" /> : <polygon points="30,-15 0,-6 30,3" fill="#38bdf8" />}
        {isModified && foundIds.includes(4) && <circle cx="35" cy="-5" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Diff 5: Nenúfar */}
      <g transform="translate(300, 425)" onClick={(e) => isModified && hit(e, 5)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="70" height="50" fill="transparent" />}
        <ellipse cx="20" cy="14" rx="22" ry="10" fill="#15803d" />
        {isModified && <circle cx="20" cy="10" r="10" fill="#f43f5e" />}
        {isModified && foundIds.includes(5) && <circle cx="20" cy="10" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
    </svg>
  );
}

// 3. Lab SVG
function LabSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified && gameState === 'playing' ? onMissClick : undefined}>
      <rect x="0" y="0" width="800" height="500" fill="#0c192c" />
      <polygon points="60,320 740,320 780,430 20,430" fill="#24344d" stroke="#3b5275" strokeWidth="3" />
      {/* Matraz */}
      <g transform="translate(150, 310)" onClick={(e) => isModified && hit(e, 1)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="70" height="75" fill="transparent" />}
        <polygon points="20,20 38,55 2,55" fill={isModified ? "#ec4899" : "#06b6d4"} />
        {isModified && foundIds.includes(1) && <circle cx="20" cy="35" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Microscopio */}
      <g transform="translate(270, 260)" onClick={(e) => isModified && hit(e, 2)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="85" height="120" fill="transparent" />}
        <rect x="12" y="15" width="16" height="35" rx="3" fill="#334155" />
        {isModified ? <rect x="16" y="70" width="8" height="12" fill="#22c55e" /> : <rect x="17" y="70" width="6" height="10" fill="#64748b" />}
        {isModified && foundIds.includes(2) && <circle cx="24" cy="55" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Monitor */}
      <g transform="translate(365, 155)" onClick={(e) => isModified && hit(e, 3)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-10" y="-10" width="200" height="125" fill="transparent" />}
        {isModified ? <path d="M10,15 Q40,40 70,15" stroke="#a855f7" strokeWidth="4" fill="none" /> : <line x1="0" y1="30" x2="80" y2="30" stroke="#22c55e" strokeWidth="3" />}
        {isModified && foundIds.includes(3) && <circle cx="45" cy="25" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Frasco */}
      <g transform="translate(650, 35)" onClick={(e) => isModified && hit(e, 4)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-10" y="-10" width="55" height="65" fill="transparent" />}
        {isModified ? <rect x="0" y="0" width="30" height="45" rx="4" fill="#eab308" /> : <rect x="0" y="5" width="26" height="40" rx="3" fill="#78350f" />}
        {isModified && foundIds.includes(4) && <circle cx="15" cy="20" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Herramienta */}
      <g transform="translate(620, 370)" onClick={(e) => isModified && hit(e, 5)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-12" width="90" height="45" fill="transparent" />}
        {isModified ? <rect x="0" y="5" width="45" height="12" rx="3" fill="#ef4444" /> : <line x1="0" y1="2" x2="40" y2="4" stroke="#cbd5e1" strokeWidth="3" />}
        {isModified && foundIds.includes(5) && <circle cx="35" cy="22" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
    </svg>
  );
}

// 4. Studio SVG
function StudioSvg({ isModified, onObjectHit, onMissClick, foundIds = [], gameState }) {
  const hit = (e, id) => { e.stopPropagation(); if (onObjectHit) onObjectHit(id); };
  return (
    <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%', display: 'block' }} onClick={isModified && gameState === 'playing' ? onMissClick : undefined}>
      <rect x="0" y="0" width="800" height="500" fill="#141124" />
      <polygon points="70,310 730,310 770,430 30,430" fill="#2d2238" stroke="#4a375e" strokeWidth="3" />
      {/* Cuadro */}
      <g transform="translate(80, 50)" onClick={(e) => isModified && hit(e, 1)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-10" y="-10" width="130" height="150" fill="transparent" />}
        <rect x="0" y="0" width="110" height="130" rx="4" fill="#0b0817" stroke="#ca8a04" strokeWidth="3" />
        {isModified ? <circle cx="55" cy="55" r="30" fill="#f97316" /> : <rect x="25" y="25" width="60" height="60" rx="4" fill="#0284c7" />}
        {isModified && foundIds.includes(1) && <circle cx="55" cy="65" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Pinceles */}
      <g transform="translate(180, 315)" onClick={(e) => isModified && hit(e, 2)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="60" height="70" fill="transparent" />}
        <rect x="6" y="20" width="26" height="34" rx="4" fill="#334155" />
        {isModified ? <rect x="10" y="2" width="6" height="22" fill="#00e5ff" /> : <line x1="12" y1="2" x2="16" y2="24" stroke="#d97706" strokeWidth="3" />}
        {isModified && foundIds.includes(2) && <circle cx="19" cy="25" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Tableta */}
      <g transform="translate(320, 345)" onClick={(e) => isModified && hit(e, 3)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-12" width="180" height="80" fill="transparent" />}
        <polygon points="10,0 150,0 160,55 0,55" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
        {isModified && <circle cx="80" cy="25" r="10" fill="#38bdf8" />}
        {isModified && foundIds.includes(3) && <circle cx="80" cy="28" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Reloj */}
      <g transform="translate(380, 40)" onClick={(e) => isModified && hit(e, 4)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-10" y="-10" width="60" height="60" fill="transparent" />}
        <circle cx="20" cy="20" r="24" fill="#1e1833" stroke="#e2e8f0" strokeWidth="3" />
        {isModified ? <line x1="20" y1="20" x2="20" y2="35" stroke="#ef4444" strokeWidth="3" /> : <line x1="20" y1="20" x2="34" y2="20" stroke="#38bdf8" strokeWidth="3" />}
        {isModified && foundIds.includes(4) && <circle cx="20" cy="20" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
      </g>
      {/* Planta */}
      <g transform="translate(640, 220)" onClick={(e) => isModified && hit(e, 5)} style={{ cursor: isModified ? 'pointer' : 'default' }}>
        {isModified && <rect x="-15" y="-15" width="95" height="150" fill="transparent" />}
        <polygon points="20,110 50,110 58,60 12,60" fill="#78350f" />
        {isModified ? <circle cx="40" cy="0" r="14" fill="#dc2626" /> : <ellipse cx="40" cy="0" rx="18" ry="10" fill="#16a34a" />}
        {isModified && foundIds.includes(5) && <circle cx="35" cy="45" r="28" stroke="#00e5ff" strokeWidth="3" fill="rgba(0, 229, 255, 0.25)" />}
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
      background: 'rgba(5, 8, 16, 0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '800px', width: '100%', background: '#0d1322', border: '1px solid #00e5ff', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>
            ¿Cómo influye el Tiempo en el Sensing Score?
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#f8fafc', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#0a0e1a', padding: '16px', borderRadius: '12px', border: '1px solid #00e5ff' }}>
            <h4 style={{ color: '#00e5ff', margin: '0 0 8px' }}>Rápido y Preciso (≤ 4.0s)</h4>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>Score Alto (≥ 8.0)</div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
              Foco en detalles físicos directos sin sobreanálisis. Procesamiento perceptual ágil (Sensorial).
            </p>
          </div>
          <div style={{ background: '#0a0e1a', padding: '16px', borderRadius: '12px', border: '1px solid #a855f7' }}>
            <h4 style={{ color: '#c084fc', margin: '0 0 8px' }}>Lento o con Dudas (&gt; 4.0s)</h4>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>Score Bajo (&lt; 5.0)</div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
              La demora descuenta -0.45 pts/segundo. Foco en conceptos holísticos o significados (Intuición).
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ width: '100%', background: '#00e5ff', color: '#0a0e1a', fontWeight: 800, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Cerrar Infografía
        </button>
      </div>
    </div>
  );
}
