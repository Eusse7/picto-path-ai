# Picto-Path AI: Módulo de Juicio vs Percepción (Judging Game)

Módulo psicométrico conductual que evalúa el eje de personalidad **Juicio ($J$) vs Percepción ($P$)** mediante la resolución de laberintos dinámicos interactivos.

---

## 1. Fundamento Psicométrico
- **Eje evaluado:** Estilo de Vida y Toma de Decisiones Espaciales (Juicio / Estructura vs Percepción / Flexibilidad).
- **Variable generada:** `Judging Score` (rango $0.0$ a $10.0$).
- **Interpretación para el Modelo ML:**
  - $\ge 5.0 \implies$ Tendencia a Juicio ($J$): planificación previa, apego a la meta principal, rutas eficientes sin desvíos ni titubeos.
  - $< 5.0 \implies$ Tendencia a Percepción ($P$): acción inmediata, exploración de ramales secundarios, recolección de recompensas opcionales, flexibilidad ante el entorno.

---

## 2. Estructura de Archivos del Módulo

```text
picto-path-ai/games/judging_game/
│
├── scenarios.ts          # Definición de los 4 escenarios temáticos, personajes y prior de escenario
├── types.ts              # Definiciones TypeScript de coordenadas, celdas, métricas y resultados
├── MazeGenerator.ts      # Generador de laberintos por DFS con camino soluble garantizado
├── BehaviorTracker.ts    # Telemetría de conducta: tiempo de planificación, pasos, celdas repetidas, direcciones
├── JudgingFormula.ts     # Cálculo de la fórmula matemática y entropía de Shannon en TypeScript
├── MazeGame.ts           # Motor del juego en HTML5 Canvas (60 FPS, animaciones y colisiones)
├── UI.ts                 # Controles de interfaz y HUD visual auxiliar
│
├── formula.py            # Réplica idéntica de la fórmula psicométrica en Python
├── schemas.py            # Esquemas Pydantic para validación y tipos del backend
├── router.py             # Router FastAPI para cálculo o auditoría vía API REST
│
├── GUIA_TECNICA.md       # Documento detallado de arquitectura, variables y fórmulas matemáticas
├── GUIA_SUSTENTACION.md  # Guía con preguntas típicas y respuestas técnicas para la evaluación de Semestre 5
└── README.md             # Este archivo
```

---

## 3. Formulación Matemática

El puntaje del juego integra 6 dimensiones conductuales:

$$\text{Judging Score} = 10 \cdot \Big( 0.20 \cdot P + 0.20 \cdot E + 0.15 \cdot C + 0.15 \cdot F + 0.10 \cdot O + 0.20 \cdot S \Big)$$

1. **$P$ (Planificación):** $\min(1.0, \frac{t_{\text{plan}}}{15\text{s}})$. Mide cuánto tiempo se detiene el usuario a observar antes de dar el primer paso.
2. **$E$ (Eficiencia):** $\min(1.0, \frac{\text{Pasos Óptimos}}{\text{Pasos Reales}})$. Evalúa cercanía a la ruta más corta (BFS).
3. **$C$ (Compromiso):** $1.0 - \frac{\text{Celdas Revisitadas}}{\text{Pasos}}$. Penaliza el retroceso (backtracking) o titubeo.
4. **$F$ (Foco):** $1.0 - \frac{\text{Bonos Recolectados}}{\text{Total Bonos}}$. Evalúa apego al objetivo principal sin dejarse distraer por gemas secundarias.
5. **$O$ (Orden Direccional):** $1.0 - \frac{H}{2.0}$, donde $H$ es la **Entropía de Shannon** de la frecuencia de direcciones ($\uparrow, \downarrow, \leftarrow, \rightarrow$).
6. **$S$ (Sesgo de Escenario):** Prior inherente según el reto seleccionado (de $0.15$ para jardín botánico a $0.85$ para rescate con protocolo 1-2-3).

---

## 4. Escenarios Disponibles

1. **Misión Rescate (Héroe: Capitán Fox):** Protocolo estricto de salvar 3 sobrevivientes en secuencia numerada ($1 \to 2 \to 3$). Alta estructura ($S = 0.85$).
2. **Búnker Cuántico (Héroe: Ingeniero Axel):** Hallar la llave maestra y escapar antes de 75 segundos. Estructura moderada ($S = 0.65$).
3. **Ruinas Piratas (Héroe: Corsario Drake):** Encontrar 2 cofres en el orden deseado y llegar al barco. Flexibilidad moderada ($S = 0.35$).
4. **Jardín Místico (Héroe: Exploradora Flora):** Recolectar 4 orquídeas a tu propio ritmo. Exploración libre ($S = 0.15$).

---

## 5. Integración con el Sistema Global
El puntaje calculado se emite al componente principal [`App.jsx`](file:///c:/Universidad/@Semestre5/IA/picto-path-ai/frontend/src/App.jsx) para completar el cuarteto psicométrico y alimentar el modelo Random Forest entrenado sobre 43.744 muestras.
