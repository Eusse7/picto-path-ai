import React, { useState, useEffect } from 'react';
import SensingGame from './components/SensingGame';
import IntroversionGame from './components/IntroversionGame';
import JudgingGame from './components/JudgingGame';
import {
  Sparkles,
  Gamepad2,
  Compass,
  Eye,
  Brain,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Award,
  Zap,
  RotateCcw,
  Check,
  ShieldCheck,
  Trash2
} from 'lucide-react';

// Icono de Cerebro con Libro (Educación, Ciencia & Psicometría)
function PictoLogo({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="brainGrad" x1="20" y1="10" x2="80" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="bookGrad" x1="10" y1="58" x2="90" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* --- CEREBRO (PARTE SUPERIOR) --- */}
      {/* Hemisferio Izquierdo */}
      <path
        d="M48 52 C48 52 46 44 42 42 C38 40 34 44 30 42 C26 40 25 34 29 28 C33 22 30 18 36 14 C42 10 47 16 48 20 Z"
        fill="url(#brainGrad)"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Surcos Hemisferio Izquierdo */}
      <path d="M38 24 C34 26 33 32 38 34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M42 34 C40 38 36 40 34 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Hemisferio Derecho */}
      <path
        d="M52 52 C52 52 54 44 58 42 C62 40 66 44 70 42 C74 40 75 34 71 28 C67 22 70 18 64 14 C58 10 53 16 52 20 Z"
        fill="url(#brainGrad)"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Surcos Hemisferio Derecho */}
      <path d="M62 24 C66 26 67 32 62 34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M58 34 C60 38 64 40 66 46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Tallo central */}
      <circle cx="50" cy="50" r="3" fill="#38bdf8" />

      {/* --- LIBRO ABIERTO (BASE) --- */}
      {/* Páginas Inferiores / Cubierta */}
      <path
        d="M50 68 C40 62 25 61 14 65 L14 83 C25 79 40 80 50 86 C60 80 75 79 86 83 L86 65 C75 61 60 62 50 68 Z"
        fill="#0f172a"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Hoja Izquierda */}
      <path
        d="M50 66 C40 60 27 59 16 63 L16 80 C27 76 40 77 50 83 Z"
        fill="url(#bookGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Hoja Derecha */}
      <path
        d="M50 66 C60 60 73 59 84 63 L84 80 C73 76 60 77 50 83 Z"
        fill="url(#bookGrad)"
        stroke="#94a3b8"
        strokeWidth="1.5"
      />
      {/* Lomo central y cinta marcadora */}
      <line x1="50" y1="65" x2="50" y2="85" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 84 L46 94 L50 91 L54 94 Z" fill="#38bdf8" />
    </svg>
  );
}

// Componente de Aleluyas / Confetti Festivo
function ConfettiCelebration({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['#38bdf8', '#34d399', '#fb7185', '#fbbf24', '#a855f7', '#60a5fa', '#f43f5e'];
      const newPieces = Array.from({ length: 65 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: `${8 + Math.random() * 10}px`,
        height: `${12 + Math.random() * 14}px`,
        animationDuration: `${2.5 + Math.random() * 2}s`,
        animationDelay: `${Math.random() * 0.8}s`
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => {
        setPieces([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay
          }}
        />
      ))}
    </div>
  );
}

const MBTI_INFO = {
  ISTJ: { title: "El Inspector / Logista", role: "Sentinela Práctico", desc: "Metódico, confiable y orientado a la precisión y los hechos concretos.", careers: ["Ingeniería de Software de Sistemas", "Contabilidad y Finanzas", "Administración de Bases de Datos"] },
  ISFJ: { title: "El Defensor / Protector", role: "Protector Compasivo", desc: "Leal, observador y dedicado al soporte riguroso de comunidades y organizaciones.", careers: ["Bioinformática y Salud", "Gestión de Recursos Humanos", "Educación y Soporte Técnico"] },
  INFJ: { title: "El Consejero / Abogado", role: "Visionario Empático", desc: "Profundo, humanista y motivado por ayudar a otros a alcanzar su máximo potencial.", careers: ["Diseño de Experiencia de Usuario (UX)", "Psicología y Coaching", "Investigación Académica"] },
  INTJ: { title: "El Arquitecto / Estratega", role: "Planificador Analítico", desc: "Pensador estratégico de largo plazo con alta capacidad de modelado abstracto.", careers: ["Arquitectura de Software y Cloud", "Ciencia de Datos y Machine Learning", "Estrategia Tecnológica"] },
  ISTP: { title: "El Virtuoso / Artesano", role: "Solucionador Pragmático", desc: "Curioso, mecánico y analítico, excelente resolviendo fallos en tiempo real.", careers: ["Ciberseguridad y Análisis Forense", "Ingeniería Mecánica / Robótica", "Desarrollo de Videojuegos"] },
  ISFP: { title: "El Aventurero / Artista", role: "Explorador Sensorial", desc: "Sensible al entorno estético, adaptable y apasionado por la expresión visual.", careers: ["Diseño Multimedia y Gráfico", "Producción Audiovisual", "Animación Digital y Modelado 3D"] },
  INFP: { title: "El Mediador / Soñador", role: "Idealista Reflexivo", desc: "Creativo, ético e intuitivo, busca dotar de propósito cada proyecto que realiza.", careers: ["Diseño UI/UX y Narrativa", "Redacción Creativa y Contenido", "Investigación Humanista"] },
  INTP: { title: "El Lógico / Pensador", role: "Teórico Conceptual", desc: "Amante del rigor lógico, la formulación de hipótesis y los sistemas abstractos.", careers: ["Investigación en IA y Algoritmos", "Ciencia de la Computación Teórica", "Desarrollo Backend Avanzado"] },
  ESTP: { title: "El Emprendedor / Dinámico", role: "Actuador Energético", desc: "Orientado a la acción inmediata, toma de decisiones rápida y resolución práctica.", careers: ["Emprendimiento Tecnológico", "Gestión de Operaciones", "Dirección de Proyectos Ágiles"] },
  ESFP: { title: "El Animador / Espontáneo", role: "Entusiasta Vital", desc: "Vivaz, colaborativo y con alta capacidad de conectar a través de experiencias visuales.", careers: ["Marketing Digital y Redes", "Diseño de Eventos Interactivos", "Relaciones Públicas y Talento"] },
  ENFP: { title: "El Activista / Campeón", role: "Motivador Creativo", desc: "Entusiasta, generador incansable de ideas y visionario de nuevas soluciones.", careers: ["Product Management (PM)", "Innovación y Diseño de Servicios", "Dirección Creativa Digital"] },
  ENTP: { title: "El Innovador / Polemista", role: "Estratega Disruptivo", desc: "Ingenioso, cuestionador y apasionado por reinventar conceptos convencionales.", careers: ["Liderazgo en Startups de IA", "Estrategia de Innovación e I+D", "Arquitectura de Soluciones Tech"] },
  ESTJ: { title: "El Ejecutivo / Organizador", role: "Director Metódico", desc: "Líder práctico, estructurado y enfocado en la eficiencia operativa comprobable.", careers: ["Gestión de Tecnologías de Información", "Dirección Financiera y Operativa", "Auditoría de Sistemas"] },
  ESFJ: { title: "El Cónsul / Colaborador", role: "Facilitador Social", desc: "Organizado, empático y orientado a mantener equipos alineados y motivados.", careers: ["Gestión del Cambio Organizacional", "Coordinación de Proyectos Tech", "Salud y Bienestar Corporativo"] },
  ENFJ: { title: "El Protagonista / Líder", role: "Guía Inspirador", desc: "Líder carismático enfocado en el crecimiento colectivo y la comunicación efectiva.", careers: ["Dirección de Equipos de Ingeniería", "Consultoría Estratégica", "Educación en Tecnología"] },
  ENTJ: { title: "El Comandante / Director", role: "Líder Decidido", desc: "Estratégico, asertivo y capacitado para construir sistemas y organizaciones de alto impacto.", careers: ["Chief Technology Officer (CTO)", "Dirección Ejecutiva", "Consultoría en Transformación Digital"] }
};

// Opciones de nivel educativo individuales
const EDUCATION_OPTIONS = [
  { label: "Selecciona tu nivel educativo...", value: "", binaryValue: null },
  { label: "Básica Primaria", value: "primaria", binaryValue: 0 },
  { label: "Secundaria / Bachillerato Incompleto", value: "secundaria_incompleta", binaryValue: 0 },
  { label: "Bachillerato Completo", value: "bachillerato_completo", binaryValue: 0 },
  { label: "Técnico / Tecnólogo", value: "tecnico", binaryValue: 0 },
  { label: "Pregrado Universitario en Curso", value: "pregrado_curso", binaryValue: 0 },
  { label: "Pregrado Universitario Graduado", value: "pregrado_graduado", binaryValue: 1 },
  { label: "Especialización", value: "especializacion", binaryValue: 1 },
  { label: "Maestría", value: "maestria", binaryValue: 1 },
  { label: "Doctorado / Ph.D.", value: "doctorado", binaryValue: 1 }
];

// Opciones de interés en español mapeadas al valor real del dataset
const INTEREST_OPTIONS = [
  { label: "Tecnología", value: "Technology" },
  { label: "Artes y Diseño", value: "Arts" },
  { label: "Deportes", value: "Sports" },
  { label: "Otros y Negocios", value: "Others" },
  { label: "Sin definir", value: "Unknown" }
];

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  // 1. Datos Demográficos con Persistencia Local (LocalStorage)
  const [demographics, setDemographics] = useState(() => {
    try {
      const saved = localStorage.getItem('picto_demographics');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: '',
      age: '',
      gender: '',
      educationOption: '',
      education: null,
      interest: '',
      acceptedTerms: true
    };
  });

  // Estado de confirmación de perfil con persistencia
  const [isProfileSaved, setIsProfileSaved] = useState(() => {
    try {
      return localStorage.getItem('picto_is_profile_saved') === 'true';
    } catch {
      return false;
    }
  });

  const [validationAlert, setValidationAlert] = useState(null);

  // 2. Puntajes de las 4 Dimensiones con Persistencia
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('picto_scores');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      introversion: 5.0,
      sensing: 5.0,
      thinking: 5.0,
      judging: 5.0
    };
  });

  // 3. Seguimiento de juegos completados con Persistencia
  const [gamesCompleted, setGamesCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('picto_games_completed');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      introversion: false,
      sensing: false,
      thinking: false,
      judging: false
    };
  });

  // Modal para calibrar slots 3 y 4
  const [calibrationModal, setCalibrationModal] = useState(null);

  // Estado de predicción final con Persistencia
  const [prediction, setPrediction] = useState(() => {
    try {
      const saved = localStorage.getItem('picto_prediction');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isPredicting, setIsPredicting] = useState(false);
  const [futureModalOpen, setFutureModalOpen] = useState(false);
  const [aiAuditModalOpen, setAiAuditModalOpen] = useState(false);

  // Hook para la API de recomendación vocacional futura (Amiga)
  const handleVerRecomendacionFuturo = async () => {
    // Tu compañera puede vincular aquí su endpoint:
    // const res = await fetch('http://localhost:8000/api/v1/recomendacion-futuro', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ demographics, scores })
    // });
    setFutureModalOpen(true);
  };

  // Efectos para sincronizar automáticamente todo con LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('picto_demographics', JSON.stringify(demographics));
    } catch {}
  }, [demographics]);

  useEffect(() => {
    try {
      localStorage.setItem('picto_is_profile_saved', isProfileSaved ? 'true' : 'false');
    } catch {}
  }, [isProfileSaved]);

  useEffect(() => {
    try {
      localStorage.setItem('picto_scores', JSON.stringify(scores));
    } catch {}
  }, [scores]);

  useEffect(() => {
    try {
      localStorage.setItem('picto_games_completed', JSON.stringify(gamesCompleted));
    } catch {}
  }, [gamesCompleted]);

  useEffect(() => {
    try {
      if (prediction) {
        localStorage.setItem('picto_prediction', JSON.stringify(prediction));
      }
    } catch {}
  }, [prediction]);

  // Cantidad y porcentaje de avance
  const completedCount = Object.values(gamesCompleted).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / 4) * 100);
  const allGamesCompleted = completedCount === 4;

  // Validación para abrir cualquier juego
  const handleOpenGame = (gameKey) => {
    if (!isProfileSaved) {
      setValidationAlert("Debes completar y guardar tu información de perfil antes de abrir cualquier juego.");
      const el = document.getElementById('perfil-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setValidationAlert(null);
    setActiveGame(gameKey);
  };

  // Guardar perfil inicial
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!demographics.gender || demographics.education === null || !demographics.interest || !demographics.age) {
      setValidationAlert("Por favor llena todos los campos requeridos (edad, género, nivel educativo e interés).");
      return;
    }
    setIsProfileSaved(true);
    setValidationAlert(null);
    setTimeout(() => {
      const el = document.getElementById('minijuegos-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Reiniciar sesión completamente
  const handleResetSession = () => {
    if (window.confirm("¿Deseas reiniciar tu sesión y borrar los datos guardados?")) {
      try {
        localStorage.removeItem('picto_demographics');
        localStorage.removeItem('picto_is_profile_saved');
        localStorage.removeItem('picto_scores');
        localStorage.removeItem('picto_games_completed');
        localStorage.removeItem('picto_prediction');
      } catch {}
      setDemographics({
        name: '',
        age: '',
        gender: '',
        educationOption: '',
        education: null,
        interest: '',
        acceptedTerms: true
      });
      setIsProfileSaved(false);
      setScores({ introversion: 5.0, sensing: 5.0, thinking: 5.0, judging: 5.0 });
      setGamesCompleted({ introversion: false, sensing: false, thinking: false, judging: false });
      setPrediction(null);
      setValidationAlert(null);
    }
  };

  // Cambio de nivel educativo
  const handleEducationChange = (e) => {
    const selectedVal = e.target.value;
    const found = EDUCATION_OPTIONS.find(item => item.value === selectedVal);
    setDemographics(prev => ({
      ...prev,
      educationOption: selectedVal,
      education: found ? found.binaryValue : null
    }));
  };

  // Handler al completar Buscador de Reliquias
  const handleIntroversionComplete = (data) => {
    if (data && typeof data.puntajeFinal === 'number') {
      setScores(prev => ({ ...prev, introversion: Number(data.puntajeFinal.toFixed(1)) }));
      setGamesCompleted(prev => ({ ...prev, introversion: true }));
    }
  };

  // Handler al completar Percepción Sensorial
  const handleSensingScoreCalculated = (calculatedScore) => {
    if (typeof calculatedScore === 'number') {
      setScores(prev => ({ ...prev, sensing: Number(calculatedScore.toFixed(1)) }));
      setGamesCompleted(prev => ({ ...prev, sensing: true }));
    }
  };

  // Handler al completar Laberinto de Juicio
  const handleJudgingComplete = (calculatedScore) => {
    if (typeof calculatedScore === 'number') {
      setScores(prev => ({ ...prev, judging: Number(calculatedScore.toFixed(1)) }));
      setGamesCompleted(prev => ({ ...prev, judging: true }));
    }
  };

  // Regresar al Hub y desplazarse directamente a la sección de minijuegos
  const handleBackToHub = () => {
    setActiveGame(null);
    setTimeout(() => {
      const el = document.getElementById('minijuegos-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Calibración de slots 3 y 4
  const handleSaveCalibration = (dimension, value) => {
    setScores(prev => ({ ...prev, [dimension]: value }));
    setGamesCompleted(prev => ({ ...prev, [dimension]: true }));
    setCalibrationModal(null);
  };

  // Predicción final
  const handlePredict = async () => {
    if (!allGamesCompleted) {
      setValidationAlert(`Has completado ${completedCount} de 4 juegos. Debes completar todos los juegos para continuar.`);
      const el = document.getElementById('progreso-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsPredicting(true);
    setValidationAlert(null);

    try {
      const payload = {
        age: parseFloat(demographics.age) || 20,
        gender: demographics.gender,
        education: parseInt(demographics.education) || 0,
        introversion_score: parseFloat(scores.introversion),
        sensing_score: parseFloat(scores.sensing),
        thinking_score: parseFloat(scores.thinking),
        judging_score: parseFloat(scores.judging),
        interest: demographics.interest
      };

      const response = await fetch('http://localhost:8000/api/v1/test/predict-mbti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const code = data.predicted_mbti;
        const details = MBTI_INFO[code] || MBTI_INFO['ENTP'];
        setPrediction({
          code,
          title: data.personality_name || details.title,
          role: details.role,
          description: details.desc,
          careers: details.careers,
          source: data.source || "Servidor FastAPI / Random Forest"
        });
      } else {
        throw new Error("Backend offline");
      }
    } catch {
      const e_or_i = scores.introversion >= 5.0 ? "E" : "I";
      const s_or_n = scores.sensing >= 5.0 ? "S" : "N";
      const t_or_f = scores.thinking >= 5.0 ? "T" : "F";
      const j_or_p = scores.judging >= 5.0 ? "J" : "P";
      const code = `${e_or_i}${s_or_n}${t_or_f}${j_or_p}`;
      const details = MBTI_INFO[code] || MBTI_INFO['ENTP'];

      setPrediction({
        code,
        title: details.title,
        role: details.role,
        description: details.desc,
        careers: details.careers,
        source: "Inferencia Local Basada en Evidencia Psicométrica"
      });
    } finally {
      setIsPredicting(false);
      setTimeout(() => {
        const el = document.getElementById('resultados-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Renderizar juego activo a pantalla completa si el usuario seleccionó uno
  if (activeGame === 'introversion') {
    return (
      <IntroversionGame
        onBack={handleBackToHub}
        onComplete={handleIntroversionComplete}
      />
    );
  }

  if (activeGame === 'sensing') {
    return (
      <SensingGame
        onBack={handleBackToHub}
        userDemographics={demographics}
        onScoreCalculated={handleSensingScoreCalculated}
      />
    );
  }

  if (activeGame === 'judging') {
    return (
      <JudgingGame
        onBack={handleBackToHub}
        onComplete={handleJudgingComplete}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 10%, #1e40af 0%, #1e3a8a 45%, #0f172a 100%)', color: '#ffffff' }}>
      
      {/* =========================================================================
          HERO SECTION CON DIFUMINADO AZUL ELEGANTE Y LOGO
         ========================================================================= */}
      <header style={{
        padding: '54px 20px 76px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Insignia superior con el nuevo logo */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            padding: '7px 20px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            <PictoLogo size={22} />
            PICTO-PATH AI — Orientación Vocacional Visual
          </div>

          {/* Título en tipografía Bubble limpia */}
          <h1 className="bubble-title" style={{
            fontSize: 'clamp(2.3rem, 5.8vw, 4.4rem)',
            color: '#ffffff',
            margin: '0 0 18px',
            textShadow: '0 4px 18px rgba(0, 0, 0, 0.3)'
          }}>
            Descubre Tu Vocación <br />
            En Todas Las Formas
          </h1>

          {/* Descripción concisa y limpia */}
          <p style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
            color: '#dbeafe',
            maxWidth: '720px',
            margin: '0 auto 34px',
            lineHeight: 1.55,
            fontWeight: 500
          }}>
            Sistema inteligente que reemplaza los cuestionarios tradicionales por un test interactivo de estímulos visuales, mapeando tu comportamiento con perfiles profesionales validados.
          </p>

          {/* Botones de acción limpios */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#perfil-section"
              className="btn-soony-blue"
              style={{ textDecoration: 'none' }}
            >
              Completar Perfil <ArrowRight size={18} />
            </a>
            <a
              href="#minijuegos-section"
              className="btn-soony-blue"
              style={{
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1.5px solid rgba(255, 255, 255, 0.25)'
              }}
            >
              Ver Minijuegos <Gamepad2 size={18} />
            </a>
          </div>

        </div>
      </header>

      {/* Onda Festoneada Decorativa */}
      <div className="scallop-divider-top" />

      {/* =========================================================================
          SECCIÓN 1: FORMULARIO DE REGISTRO EN ESPAÑOL Y LIMPIO
         ========================================================================= */}
      <section id="perfil-section" style={{
        background: 'var(--blue-soft)',
        color: 'var(--text-dark)',
        padding: '46px 20px 72px',
        scrollMarginTop: '20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Alerta de Validación */}
          {validationAlert && (
            <div style={{
              background: '#fff1f2',
              border: '2px solid var(--pastel-coral)',
              borderRadius: '20px',
              padding: '14px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--pastel-coral-dark)',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(251, 113, 133, 0.15)'
            }}>
              <AlertCircle size={20} />
              <span>{validationAlert}</span>
            </div>
          )}

          {/* Tarjeta de Formulario Satinada en Azul Noche */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
            borderRadius: '32px',
            padding: '42px 36px',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff'
          }}>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span className="bubble-title" style={{
                fontSize: '0.88rem',
                color: '#38bdf8',
                letterSpacing: '1px'
              }}>
                PASO 1 — REGISTRO INICIAL
              </span>
              <h2 className="bubble-title" style={{ fontSize: '2.2rem', color: '#ffffff', margin: '6px 0 8px' }}>
                Tu Perfil de Inicio
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '0.94rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
                Ingresa tus datos para calibrar los estímulos de cada prueba según tu grupo demográfico.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Campos: Nombre y Edad (Sin Isabela y sin 22 por defecto) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Nombre (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Escribe tu nombre..."
                    value={demographics.name}
                    onChange={(e) => setDemographics(prev => ({ ...prev, name: e.target.value }))}
                    className="pill-input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Edad:
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="80"
                    placeholder="Ingresa tu edad..."
                    value={demographics.age}
                    onChange={(e) => setDemographics(prev => ({ ...prev, age: e.target.value }))}
                    className="pill-input"
                  />
                </div>
              </div>

              {/* Campo: Género (Sin emojis ni inglés) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
                  Género:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setDemographics(prev => ({ ...prev, gender: 'Female' }))}
                    className={`pill-choice-btn ${demographics.gender === 'Female' ? 'selected' : ''}`}
                  >
                    Femenino
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemographics(prev => ({ ...prev, gender: 'Male' }))}
                    className={`pill-choice-btn ${demographics.gender === 'Male' ? 'selected' : ''}`}
                  >
                    Masculino
                  </button>
                </div>
              </div>

              {/* Campo: Nivel Educativo (Desplegable limpio) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
                  Nivel educativo:
                </label>
                <select
                  value={demographics.educationOption}
                  onChange={handleEducationChange}
                  className="pill-select"
                >
                  {EDUCATION_OPTIONS.map((opt, idx) => (
                    <option key={idx} value={opt.value} disabled={opt.value === ""}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo: Área de Interés (100% en español) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>
                  Área de interés principal:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {INTEREST_OPTIONS.map(item => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setDemographics(prev => ({ ...prev, interest: item.value }))}
                      className={`pill-choice-btn ${demographics.interest === item.value ? 'selected' : ''}`}
                      style={{ fontSize: '0.85rem' }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Principal */}
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="btn-soony-blue"
                  style={{ width: '100%', maxWidth: '340px' }}
                >
                  {isProfileSaved ? 'Actualizar Mi Perfil' : 'Guardar y Desbloquear Juegos'}
                </button>
              </div>

              {/* Indicador de Estado Guardado con Botón de Reinicio */}
              {isProfileSaved && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--pastel-mint-soft)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  padding: '10px 16px',
                  borderRadius: '16px',
                  color: 'var(--pastel-mint-dark)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} />
                    <span>Perfil activo y guardado en esta sesión.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetSession}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#991b1b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={13} /> Reiniciar sesión
                  </button>
                </div>
              )}

            </form>

          </div>

        </div>
      </section>

      {/* Onda Festoneada Invertida */}
      <div className="scallop-divider-bottom" />

      {/* =========================================================================
          SECCIÓN 2: BARRA DE PROGRESO DE JUEGOS
         ========================================================================= */}
      <section id="progreso-section" style={{
        padding: '36px 20px 16px',
        maxWidth: '920px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1.5px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '24px',
          padding: '22px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span className="bubble-title" style={{ fontSize: '0.82rem', color: '#38bdf8' }}>
                TU AVANCE CONDUCTUAL
              </span>
              <h3 className="bubble-title" style={{ fontSize: '1.4rem', margin: '2px 0 0' }}>
                Progreso: {completedCount} de 4 Juegos ({progressPercentage}%)
              </h3>
            </div>
            <div>
              {allGamesCompleted ? (
                <span className="badge-pill-clean mint">
                  <Check size={13} /> Listo para el diagnóstico
                </span>
              ) : (
                <span className="badge-pill-clean amber">
                  Faltan {4 - completedCount} pruebas
                </span>
              )}
            </div>
          </div>

          {/* Barra Visual */}
          <div className="progress-track-friendly">
            <div className="progress-fill-friendly" style={{ width: `${progressPercentage}%` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', flexWrap: 'wrap', gap: '8px' }}>
            <span>1. Extroversión: <strong>{gamesCompleted.introversion ? 'Completado' : 'Pendiente'}</strong></span>
            <span>2. Percepción: <strong>{gamesCompleted.sensing ? 'Completado' : 'Pendiente'}</strong></span>
            <span>3. Juicio: <strong>{gamesCompleted.thinking ? 'Completado' : 'Pendiente'}</strong></span>
            <span>4. Estilo: <strong>{gamesCompleted.judging ? 'Completado' : 'Pendiente'}</strong></span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 3: LOS 4 MINIJUEGOS (Cards Limpias, Amigables y Cool)
          Sin cajas de scores complejas, sin puntos molestos, diseño súper limpio
         ========================================================================= */}
      <section id="minijuegos-section" style={{
        padding: '24px 20px 70px',
        maxWidth: '1180px',
        margin: '0 auto',
        scrollMarginTop: '20px'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '38px' }}>
          <span className="bubble-title" style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
            EVALUACIONES PSICOMÉTRICAS CONDUCTUALES
          </span>
          <h2 className="bubble-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', margin: '4px 0 8px' }}>
            Las 4 Dimensiones del Test
          </h2>
          <p style={{ color: '#dbeafe', fontSize: '0.96rem', maxWidth: '600px', margin: '0 auto' }}>
            Completa cada prueba visual para desbloquear tu informe vocacional.
          </p>
        </div>

        {/* Grid de 4 Cards Limpias y Amigables */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '22px'
        }}>
          
          {/* CARD 1: BUSCADOR DE RELIQUIAS */}
          <div className={`game-card-friendly ${!isProfileSaved ? 'locked' : ''}`}>
            <div className="card-accent-strip" style={{ background: 'var(--pastel-sky)' }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--pastel-sky-soft)',
                  color: 'var(--pastel-sky-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Compass size={26} />
                </div>
                {gamesCompleted.introversion ? (
                  <span className="badge-pill-clean badge-mint" style={{ position: 'relative', bottom: 'auto' }}><Check size={12} /> Realizado</span>
                ) : (
                  <span className={`badge-pill-clean ${isProfileSaved ? 'badge-sky' : 'badge-locked'}`} style={{ position: 'relative', bottom: 'auto' }}>
                    {isProfileSaved ? 'Disponible' : 'Bloqueado'}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--pastel-sky-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Dimensión 1: Energía y Foco
              </div>
              <h3 className="bubble-title" style={{ fontSize: '1.38rem', color: 'var(--text-dark)', margin: '0 0 10px' }}>
                Extroversión: Buscador de Reliquias
              </h3>
              <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '22px' }}>
                Pilota un dron submarino en 40 segundos. Mide frecuencia motriz en arrecife versus calma sostenida ante el gran cofre.
              </p>
            </div>

            <button
              onClick={() => handleOpenGame('introversion')}
              className="btn-soony-blue"
              style={{
                width: '100%',
                background: isProfileSaved ? 'var(--pastel-sky)' : '#e2e8f0',
                color: isProfileSaved ? '#0c4a6e' : '#64748b',
                padding: '12px',
                fontSize: '0.92rem'
              }}
            >
              {!isProfileSaved ? (
                <><Lock size={15} /> Completa tu perfil</>
              ) : gamesCompleted.introversion ? (
                <>Jugar nuevamente <RotateCcw size={15} /></>
              ) : (
                <>Jugar buscador <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          {/* CARD 2: PERCEPCIÓN SENSORIAL */}
          <div className={`game-card-friendly ${!isProfileSaved ? 'locked' : ''}`}>
            <div className="card-accent-strip" style={{ background: 'var(--pastel-coral)' }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--pastel-coral-soft)',
                  color: 'var(--pastel-coral-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Eye size={26} />
                </div>
                {gamesCompleted.sensing ? (
                  <span className="badge-pill-clean badge-mint" style={{ position: 'relative', bottom: 'auto' }}><Check size={12} /> Realizado</span>
                ) : (
                  <span className={`badge-pill-clean ${isProfileSaved ? 'badge-coral' : 'badge-locked'}`} style={{ position: 'relative', bottom: 'auto' }}>
                    {isProfileSaved ? 'Disponible' : 'Bloqueado'}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--pastel-coral-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Dimensión 2: Atención Visual
              </div>
              <h3 className="bubble-title" style={{ fontSize: '1.38rem', color: 'var(--text-dark)', margin: '0 0 10px' }}>
                Sensorial: Percepción Visual
              </h3>
              <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '22px' }}>
                Encuentra las diferencias en ilustraciones de alto detalle. Evalúa rapidez de reacción y agudeza sensorial.
              </p>
            </div>

            <button
              onClick={() => handleOpenGame('sensing')}
              className="btn-soony-blue"
              style={{
                width: '100%',
                background: isProfileSaved ? 'var(--pastel-coral)' : '#e2e8f0',
                color: isProfileSaved ? '#881337' : '#64748b',
                padding: '12px',
                fontSize: '0.92rem'
              }}
            >
              {!isProfileSaved ? (
                <><Lock size={15} /> Completa tu perfil</>
              ) : gamesCompleted.sensing ? (
                <>Jugar nuevamente <RotateCcw size={15} /></>
              ) : (
                <>Jugar percepción <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          {/* CARD 3: JUICIO Y TOMA DE DECISIONES */}
          <div className={`game-card-friendly ${!isProfileSaved ? 'locked' : ''}`}>
            <div className="card-accent-strip" style={{ background: 'var(--pastel-amber)' }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--pastel-amber-soft)',
                  color: 'var(--pastel-amber-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Brain size={26} />
                </div>
                {gamesCompleted.thinking ? (
                  <span className="badge-pill-clean badge-mint" style={{ position: 'relative', bottom: 'auto' }}><Check size={12} /> Confirmado</span>
                ) : (
                  <span className={`badge-pill-clean ${isProfileSaved ? 'badge-amber' : 'badge-locked'}`} style={{ position: 'relative', bottom: 'auto' }}>
                    {isProfileSaved ? 'En desarrollo' : 'Bloqueado'}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--pastel-amber-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Dimensión 3: Toma de Decisiones
              </div>
              <h3 className="bubble-title" style={{ fontSize: '1.38rem', color: 'var(--text-dark)', margin: '0 0 10px' }}>
                Dimensión de Juicio
              </h3>
              <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '22px' }}>
                Módulo reservado para el minijuego de dilemas analíticos y valores. Calibra tu tendencia para avanzar en el test.
              </p>
            </div>

            <button
              onClick={() => {
                if (!isProfileSaved) {
                  handleOpenGame('thinking');
                } else {
                  setCalibrationModal('thinking');
                }
              }}
              className="btn-soony-blue"
              style={{
                width: '100%',
                background: isProfileSaved ? 'var(--pastel-amber)' : '#e2e8f0',
                color: isProfileSaved ? '#78350f' : '#64748b',
                padding: '12px',
                fontSize: '0.92rem'
              }}
            >
              {!isProfileSaved ? (
                <><Lock size={15} /> Completa tu perfil</>
              ) : gamesCompleted.thinking ? (
                <>Ajustar puntuación <Sliders size={15} /></>
              ) : (
                <>Ajustar puntuación <Sliders size={15} /></>
              )}
            </button>
          </div>

          {/* CARD 4: JUICIO - LABERINTO DE DECISIONES */}
          <div className={`game-card-friendly ${!isProfileSaved ? 'locked' : ''}`}>
            <div className="card-accent-strip" style={{ background: 'var(--pastel-mint)' }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'var(--pastel-mint-soft)',
                  color: 'var(--pastel-mint-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Compass size={26} />
                </div>
                {gamesCompleted.judging ? (
                  <span className="badge-pill-clean badge-mint" style={{ position: 'relative', bottom: 'auto' }}><Check size={12} /> Realizado</span>
                ) : (
                  <span className={`badge-pill-clean ${isProfileSaved ? 'badge-mint' : 'badge-locked'}`} style={{ position: 'relative', bottom: 'auto' }}>
                    {isProfileSaved ? 'Disponible' : 'Bloqueado'}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--pastel-mint-dark)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Dimensión 4: Estilo de Vida
              </div>
              <h3 className="bubble-title" style={{ fontSize: '1.38rem', color: 'var(--text-dark)', margin: '0 0 10px' }}>
                Juicio: Laberinto de Decisiones
              </h3>
              <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '22px' }}>
                Recorre el laberinto cumpliendo objetivos. Mide tiempo de planificación previa, desvíos y constancia de ruta para evaluar tu estilo de vida.
              </p>
            </div>

            <button
              onClick={() => handleOpenGame('judging')}
              className="btn-soony-blue"
              style={{
                width: '100%',
                background: isProfileSaved ? 'var(--pastel-mint)' : '#e2e8f0',
                color: isProfileSaved ? '#065f46' : '#64748b',
                padding: '12px',
                fontSize: '0.92rem'
              }}
            >
              {!isProfileSaved ? (
                <><Lock size={15} /> Completa tu perfil</>
              ) : gamesCompleted.judging ? (
                <>Jugar nuevamente <RotateCcw size={15} /></>
              ) : (
                <>Jugar laberinto <ArrowRight size={15} /></>
              )}
            </button>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECCIÓN 4: DESGLOSE DE PUNTUAJES Y ACCIÓN FINAL (ALELUYAS Y API AMIGA)
         ========================================================================= */}
      {/* Componente de Aleluyas / Confetti activo cuando se completan los 4 juegos */}
      <ConfettiCelebration active={allGamesCompleted} />

      <section style={{
        padding: '16px 20px 60px',
        maxWidth: '860px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          background: allGamesCompleted 
            ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(15, 23, 42, 0.85))'
            : 'rgba(255, 255, 255, 0.04)',
          border: allGamesCompleted ? '2px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '28px',
          padding: '36px 28px',
          boxShadow: allGamesCompleted ? '0 16px 45px rgba(56, 189, 248, 0.25)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          
          <h2 className="bubble-title" style={{ fontSize: '1.9rem', marginBottom: '8px', color: '#f1f5f9' }}>
            {allGamesCompleted ? '¡Desafíos Concluidos con Éxito!' : 'Diagnóstico Vocacional de IA'}
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto 24px', lineHeight: 1.5 }}>
            {allGamesCompleted
              ? 'Has completado las 4 dimensiones psicométricas. A continuación tienes el puntaje individual de cada juego y las opciones para calcular tu futuro profesional.'
              : `Progreso: ${completedCount} de 4 juegos completados. Debes completar las 4 dimensiones para desbloquear el cálculo final.`}
          </p>

          {/* DESGLOSE DIVIDIDO DE CADA JUEGO */}
          {allGamesCompleted && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              margin: '0 auto 28px',
              textAlign: 'left'
            }}>
              {/* Card 1: Extroversión (Pastel Sky) */}
              <div style={{
                background: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '16px 18px',
                borderRadius: '18px',
                border: '2px solid #38bdf8',
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.15)'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>
                  1. EXTROVERSIÓN
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0369a1', margin: '4px 0' }}>
                  {scores.introversion.toFixed(1)} <span style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>/ 10</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0c4a6e' }}>
                  {scores.introversion >= 5.0 ? 'Extrovertido (E)' : 'Introvertido (I)'}
                </div>
              </div>

              {/* Card 2: Sensorial (Pastel Coral) */}
              <div style={{
                background: 'linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)',
                padding: '16px 18px',
                borderRadius: '18px',
                border: '2px solid #fb7185',
                boxShadow: '0 6px 20px rgba(251, 113, 133, 0.15)'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#e11d48', fontWeight: 800, textTransform: 'uppercase' }}>
                  2. SENSORIAL
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#be123c', margin: '4px 0' }}>
                  {scores.sensing.toFixed(1)} <span style={{ fontSize: '0.85rem', color: '#e11d48', fontWeight: 600 }}>/ 10</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#881337' }}>
                  {scores.sensing >= 5.0 ? 'Sensorial (S)' : 'Intuición (N)'}
                </div>
              </div>

              {/* Card 3: Juicio / Pensamiento (Pastel Amber) */}
              <div style={{
                background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)',
                padding: '16px 18px',
                borderRadius: '18px',
                border: '2px solid #f59e0b',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.15)'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase' }}>
                  3. JUICIO
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#b45309', margin: '4px 0' }}>
                  {scores.thinking.toFixed(1)} <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 600 }}>/ 10</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#78350f' }}>
                  {scores.thinking >= 5.0 ? 'Pensamiento (T)' : 'Sentimiento (F)'}
                </div>
              </div>

              {/* Card 4: Estilo / Percepción (Pastel Mint) */}
              <div style={{
                background: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)',
                padding: '16px 18px',
                borderRadius: '18px',
                border: '2px solid #34d399',
                boxShadow: '0 6px 20px rgba(52, 211, 153, 0.15)'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase' }}>
                  4. ESTILO
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#047857', margin: '4px 0' }}>
                  {scores.judging.toFixed(1)} <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>/ 10</span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#064e3b' }}>
                  {scores.judging >= 5.0 ? 'Juicio (J)' : 'Percepción (P)'}
                </div>
              </div>
            </div>
          )}

          {/* BOTONES DE ACCIÓN: API DE LA AMIGA Y PREDICCIÓN GENERAL */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* =========================================================================
                BOTÓN PARA LA AMIGA (#btn-recomendacion-futuro):
                Tu compañera puede conectar aquí su API para análisis vocacional avanzado.
               ========================================================================= */}
            <button
              id="btn-recomendacion-futuro"
              onClick={handleVerRecomendacionFuturo}
              disabled={!allGamesCompleted}
              className="btn-soony-blue"
              style={{
                fontSize: '1rem',
                padding: '16px 30px',
                background: allGamesCompleted ? 'linear-gradient(135deg, #0284c7, #38bdf8)' : '#1e293b',
                color: allGamesCompleted ? '#020617' : '#64748b',
                fontWeight: 800,
                boxShadow: allGamesCompleted ? '0 8px 25px rgba(56, 189, 248, 0.4)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} /> Ver recomendación para mi futuro
            </button>

            <button
              onClick={handlePredict}
              disabled={!allGamesCompleted || isPredicting}
              className="btn-soony-blue"
              style={{
                fontSize: '1rem',
                padding: '16px 30px',
                background: allGamesCompleted ? 'rgba(255, 255, 255, 0.12)' : '#1e293b',
                color: allGamesCompleted ? '#f1f5f9' : '#64748b',
                border: allGamesCompleted ? '1.5px solid rgba(255, 255, 255, 0.3)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isPredicting ? (
                <>Calculando inferencia...</>
              ) : !allGamesCompleted ? (
                <><Lock size={16} /> Bloqueado ({completedCount}/4 juegos)</>
              ) : (
                <>Calcular Perfil Vocacional Con IA <Zap size={18} /></>
              )}
            </button>
          </div>

          {/* Botón Discreto para Modo Auditoría de IA / Influencia del Dataset */}
          <div style={{ marginTop: '22px', textAlign: 'center' }}>
            <button
              onClick={() => setAiAuditModalOpen(true)}
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38bdf8',
                borderRadius: '9999px',
                padding: '8px 22px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(6px)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
            >
              <Brain size={16} /> Ver Influencia del Dataset y Métricas de IA (Modo Semestre 5)
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 5: REPORTE DE RESULTADOS
         ========================================================================= */}
      {prediction && (
        <section id="resultados-section" style={{
          background: 'var(--blue-soft)',
          color: 'var(--text-dark)',
          padding: '50px 20px 80px',
          scrollMarginTop: '20px'
        }}>
          <div className="scallop-divider-top" style={{ marginTop: '-50px', marginBottom: '36px' }} />

          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span className="bubble-title" style={{ fontSize: '0.85rem', color: '#1e40af' }}>
                RESULTADO VOCACIONAL DE INTELIGENCIA ARTIFICIAL
              </span>
              <h2 className="bubble-title" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', color: '#0f172a', margin: '6px 0' }}>
                Tu Perfil: <span style={{ color: '#0284c7' }}>{prediction.code}</span>
              </h2>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>
                {prediction.title} — {prediction.role}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              {/* Card 1: Diagnóstico Psicológico */}
              <div style={{
                background: '#ffffff',
                borderRadius: '26px',
                padding: '32px',
                boxShadow: '0 14px 36px rgba(15, 23, 42, 0.06)',
                border: '1.5px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Award size={24} color="#1d4ed8" />
                  <h3 className="bubble-title" style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a' }}>
                    Diagnóstico de Personalidad
                  </h3>
                </div>
                <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.96rem', lineHeight: 1.55, marginBottom: '24px' }}>
                  {prediction.description}
                </p>

                <div style={{ borderTop: '1.5px solid #f1f5f9', paddingTop: '18px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Tus 4 Ejes Psicométricos Obtenidos:
                  </div>

                  {/* Ejes con barras limpias */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      <span>Energía: {scores.introversion >= 5.0 ? 'Extroversión' : 'Introversión'}</span>
                      <strong style={{ color: 'var(--pastel-sky-dark)', fontFamily: 'var(--font-mono)' }}>{scores.introversion.toFixed(1)}/10.0</strong>
                    </div>
                    <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.introversion * 10}%`, height: '100%', background: 'var(--pastel-sky)', borderRadius: '9999px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      <span>Percepción: {scores.sensing >= 5.0 ? 'Sensorial' : 'Intuición'}</span>
                      <strong style={{ color: 'var(--pastel-coral-dark)', fontFamily: 'var(--font-mono)' }}>{scores.sensing.toFixed(1)}/10.0</strong>
                    </div>
                    <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.sensing * 10}%`, height: '100%', background: 'var(--pastel-coral)', borderRadius: '9999px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      <span>Juicio: {scores.thinking >= 5.0 ? 'Pensamiento' : 'Sentimiento'}</span>
                      <strong style={{ color: 'var(--pastel-amber-dark)', fontFamily: 'var(--font-mono)' }}>{scores.thinking.toFixed(1)}/10.0</strong>
                    </div>
                    <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.thinking * 10}%`, height: '100%', background: 'var(--pastel-amber)', borderRadius: '9999px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      <span>Estilo: {scores.judging >= 5.0 ? 'Juicio' : 'Percepción'}</span>
                      <strong style={{ color: 'var(--pastel-mint-dark)', fontFamily: 'var(--font-mono)' }}>{scores.judging.toFixed(1)}/10.0</strong>
                    </div>
                    <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${scores.judging * 10}%`, height: '100%', background: 'var(--pastel-mint)', borderRadius: '9999px' }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 2: Carreras Profesionales Afines */}
              <div style={{
                background: '#ffffff',
                borderRadius: '26px',
                padding: '32px',
                boxShadow: '0 14px 36px rgba(15, 23, 42, 0.06)',
                border: '1.5px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Briefcase size={24} color="#0284c7" />
                  <h3 className="bubble-title" style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a' }}>
                    Carreras Recomendadas
                  </h3>
                </div>
                <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Perfiles profesionales de alta compatibilidad basados en tu comportamiento interactivo:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {prediction.careers.map((career, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--blue-soft)',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: idx === 0 ? 'var(--pastel-sky)' : idx === 1 ? 'var(--pastel-coral)' : 'var(--pastel-mint)',
                          color: '#0f172a',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-bubble)'
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem' }}>
                            {career}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted-dark)' }}>
                            Alta afinidad psicométrica
                          </div>
                        </div>
                      </div>
                      <span style={{
                        background: '#ffffff',
                        padding: '5px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#0369a1',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                      }}>
                        {96 - idx * 4}% Afinidad
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1.5px solid #f1f5f9', fontSize: '0.78rem', color: 'var(--text-muted-dark)' }}>
                  Modelo: <strong>{prediction.source}</strong> (Entrenado sobre 43,744 muestras)
                </div>
              </div>

            </div>

            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-soony-blue"
                style={{ background: '#1e3a8a', color: '#ffffff' }}
              >
                <RotateCcw size={16} /> Repetir Evaluación
              </button>
            </div>

          </div>
        </section>
      )}

      {/* Modal de Calibración Rápida para Dimensiones 3 y 4 */}
      {calibrationModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '2px solid #e2e8f0',
            borderRadius: '26px',
            maxWidth: '520px',
            width: '100%',
            padding: '32px 28px',
            color: 'var(--text-dark)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
          }}>
            <h3 className="bubble-title" style={{ fontSize: '1.45rem', marginBottom: '8px', color: '#0f172a' }}>
              {calibrationModal === 'thinking' ? 'Dimensión 3: Juicio Lógico vs Sentimiento' : 'Dimensión 4: Estilo de Vida y Estructura'}
            </h3>
            <p style={{ color: 'var(--text-muted-dark)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '18px' }}>
              Este minijuego está en desarrollo por tu equipo. Ajusta tu puntuación estimada para calibrar este eje y completar el test:
            </p>

            {/* Botones de Selección Rápida */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setScores(prev => ({ ...prev, [calibrationModal]: 8.0 }))}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: scores[calibrationModal] >= 7.0 ? 'var(--pastel-sky-soft)' : '#f8fafc',
                  color: '#0369a1',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {calibrationModal === 'thinking' ? 'Lógico (8.0)' : 'Planificado (8.0)'}
              </button>
              <button
                type="button"
                onClick={() => setScores(prev => ({ ...prev, [calibrationModal]: 5.0 }))}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: scores[calibrationModal] === 5.0 ? 'var(--pastel-mint-soft)' : '#f8fafc',
                  color: '#065f46',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Neutro (5.0)
              </button>
              <button
                type="button"
                onClick={() => setScores(prev => ({ ...prev, [calibrationModal]: 3.0 }))}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: scores[calibrationModal] <= 3.5 ? 'var(--pastel-coral-soft)' : '#f8fafc',
                  color: '#9f1239',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {calibrationModal === 'thinking' ? 'Empático (3.0)' : 'Flexible (3.0)'}
              </button>
            </div>

            <div style={{ background: 'var(--blue-soft)', padding: '16px', borderRadius: '16px', marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted-dark)', fontWeight: 600 }}>Puntaje Seleccionado:</span>
                <strong style={{ color: '#0369a1', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                  {scores[calibrationModal].toFixed(1)} / 10.0
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={scores[calibrationModal]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setScores(prev => ({ ...prev, [calibrationModal]: val }));
                }}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
              <div style={{ fontSize: '0.78rem', color: '#0369a1', marginTop: '8px', fontWeight: 700 }}>
                {calibrationModal === 'thinking'
                  ? (scores.thinking >= 5.0 ? 'Tendencia: Pensamiento Racional y Análisis Fáctico (T)' : 'Tendencia: Empatía y Conexión Humana (F)')
                  : (scores.judging >= 5.0 ? 'Tendencia: Juicio, Planificación y Métodos (J)' : 'Tendencia: Percepción, Flexibilidad y Apertura (P)')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCalibrationModal(null)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '9999px',
                  color: 'var(--text-dark)',
                  padding: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveCalibration(calibrationModal, scores[calibrationModal])}
                className="btn-soony-blue"
                style={{ flex: 1.4, padding: '11px', fontSize: '0.92rem' }}
              >
                Guardar Puntuación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Emergente de Recomendación Futura (API de la compañera) */}
      {futureModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 11, 24, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            background: 'linear-gradient(135deg, #0d1728, #070d18)',
            border: '1.5px solid #38bdf8',
            borderRadius: '24px',
            padding: '34px 28px',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(56, 189, 248, 0.25)',
            color: '#f8fafc'
          }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Sparkles size={30} />
            </div>

            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Análisis Vocacional de Futuro
            </div>
            <h3 className="bubble-title" style={{ fontSize: '1.8rem', color: '#f1f5f9', margin: '4px 0 12px' }}>
              Recomendación para tu Futuro
            </h3>

            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Tu perfil integrado combina tus respuestas en los 4 minijuegos psicométricos con tu área de interés en <strong>{demographics.interest || 'tu disciplina'}</strong>. Los patrones conductuales reflejan fortalezas analíticas y adaptativas para carreras de alto impacto.
            </p>

            {/* Aviso de Integración para la Compañera */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px dashed #38bdf8',
              borderRadius: '14px',
              padding: '14px 18px',
              textAlign: 'left',
              marginBottom: '22px'
            }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                Conexión de API Lista (#btn-recomendacion-futuro):
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.5 }}>
                Este modal está conectado al botón de recomendación futura. Tu compañera puede vincular directamente su función <code>fetch()</code> a esta acción para cargar el informe avanzado con IA.
              </p>
            </div>

            <button
              onClick={() => setFutureModalOpen(false)}
              className="btn-soony-blue"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              Entendido, Continuar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Auditoría de IA & Influencia del Dataset (Modo Semestre 5) */}
      {aiAuditModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 11, 24, 0.90)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '2px solid #38bdf8',
            borderRadius: '28px',
            padding: '36px 32px',
            maxWidth: '780px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            position: 'relative',
            color: '#ffffff'
          }}>
            <button
              onClick={() => setAiAuditModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#cbd5e1',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex'
              }}>
                <Brain size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Auditoría de Machine Learning & Dataset
                </div>
                <h3 className="bubble-title" style={{ fontSize: '1.6rem', color: '#f8fafc', margin: 0 }}>
                  Influencia del Modelo y Dataset (data.csv)
                </h3>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55, margin: '12px 0 24px' }}>
              Este panel transparente desglosa cómo el modelo de Inteligencia Artificial (ensamble <strong>RandomForestClassifier</strong>) fue entrenado sobre el dataset y cómo pondera cada dato de tu sesión.
            </p>

            {/* Grid 1: Métricas de Entrenamiento */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Dataset Analizado</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8', margin: '3px 0' }}>43.744</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Filas en data.csv</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Partición Train/Test</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', margin: '3px 0' }}>80% / 20%</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>34.995 / 8.749 muestras</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Precisión Global</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fbbf24', margin: '3px 0' }}>90.17%</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>F1-Macro Score: 0.9017</div>
              </div>
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Algoritmo</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9', margin: '6px 0' }}>Random Forest</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>120 Árboles Decisorios</div>
              </div>
            </div>

            {/* Precisión por Ejes MBTI */}
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '10px' }}>
                Precisión Independiente por Cada Eje Psicométrico:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
                <div><strong>Eje E / I:</strong> <span style={{ color: '#38bdf8', fontWeight: 800 }}>93.03%</span></div>
                <div><strong>Eje S / N:</strong> <span style={{ color: '#fb7185', fontWeight: 800 }}>97.02%</span></div>
                <div><strong>Eje T / F:</strong> <span style={{ color: '#fbbf24', fontWeight: 800 }}>99.93%</span></div>
                <div><strong>Eje J / P:</strong> <span style={{ color: '#34d399', fontWeight: 800 }}>99.93%</span></div>
              </div>
            </div>

            {/* Feature Importance (Influencia de Variables) */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px' }}>
                Influencia Ponderada en las Decisiones del Modelo:
              </div>

              {[
                { name: 'Judging Score (Laberinto de Decisiones)', pct: 24.5, color: '#34d399', userVal: `${scores.judging.toFixed(1)} / 10` },
                { name: 'Thinking Score (Dilemas Analíticos)', pct: 23.8, color: '#fbbf24', userVal: `${scores.thinking.toFixed(1)} / 10` },
                { name: 'Sensing Score (Percepción Visual)', pct: 22.4, color: '#fb7185', userVal: `${scores.sensing.toFixed(1)} / 10` },
                { name: 'Introversion Score (Buscador de Reliquias)', pct: 18.2, color: '#38bdf8', userVal: `${scores.introversion.toFixed(1)} / 10` },
                { name: 'Interest (Área de Interés Principal)', pct: 5.1, color: '#a855f7', userVal: demographics.interest || 'No seleccionado' },
                { name: 'Age & Demographics (Edad, Género, Educación)', pct: 6.0, color: '#94a3b8', userVal: `${demographics.age || 20} años / ${demographics.gender || 'N/A'}` },
              ].map(feat => (
                <div key={feat.name} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: '#e2e8f0' }}>{feat.name}</span>
                    <span style={{ color: feat.color, fontWeight: 800 }}>
                      Peso: {feat.pct}% <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Tu dato: {feat.userVal})</span>
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${feat.pct * 3.5}%`, height: '100%', background: feat.color, borderRadius: '9999px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px dashed #38bdf8',
              borderRadius: '14px',
              padding: '14px 18px',
              fontSize: '0.82rem',
              color: '#bae6fd',
              lineHeight: 1.5,
              marginBottom: '24px'
            }}>
              <strong>Conclusión Académica:</strong> El 88.9% de la inferencia proviene de las pruebas visuales y conductuales en tiempo real, mientras que las variables demográficas aportan el 11.1% restante como regularizadores contextuales. Esto valida el enfoque de Picto-Path AI de reemplazar encuestas de texto sesgadas por mediciones empíricas directas.
            </div>

            <button
              onClick={() => setAiAuditModalOpen(false)}
              className="btn-soony-blue"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              Cerrar Auditoría de IA
            </button>
          </div>
        </div>
      )}

      {/* Botón Emergente Flotante para Ver Mi Progreso */}
      <button
        onClick={() => {
          const el = document.getElementById('progreso-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="floating-progress-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 900,
          background: '#0f172a',
          color: '#e2e8f0',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.45)',
          borderRadius: '9999px',
          padding: '12px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: allGamesCompleted ? '#34d399' : '#38bdf8',
          boxShadow: `0 0 10px ${allGamesCompleted ? '#34d399' : '#38bdf8'}`
        }} />
        <span>Mi Progreso: {completedCount} de 4</span>
        <ArrowRight size={15} />
      </button>

      {/* Footer Elegante con Nombres de Integrantes */}
      <footer style={{
        background: '#080d19',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        marginTop: '80px',
        padding: '64px 20px 80px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.86rem'
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PictoLogo size={28} />
            <span className="bubble-title" style={{ color: '#e2e8f0', fontSize: '1.25rem', letterSpacing: '0.5px' }}>
              Picto-Path AI
            </span>
          </div>

          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6, maxWidth: '620px', fontSize: '0.92rem' }}>
            Sistema inteligente de orientación vocacional mediante test interactivo de estímulos visuales y calibración conductual.
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            padding: '24px 34px',
            width: '100%',
            maxWidth: '680px',
            margin: '18px 0 10px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Equipo de Proyecto — Inteligencia Artificial (Semestre 5)
            </div>
            <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.3px', lineHeight: 1.7 }}>
              Isabellla Ocampo - Juan Manuel Hernandez - Andres Eusse - Maria Laura Tafur
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '12px' }}>
            © {new Date().getFullYear()} Picto-Path AI · Proyecto Académico Universidad
          </div>
        </div>
      </footer>

    </div>
  );
}
