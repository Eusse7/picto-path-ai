# Guía Técnica: Minijuego de Juicio vs Percepción (Judging Game)
## Picto-Path AI — Eje J vs P en Orientación Vocacional

---

### 1. Resumen Ejecutivo y Marco Psicométrico

El **Judging Game** evalúa la cuarta dimensión de la personalidad según la tipología psicológica de Jung y Myers-Briggs:
- **Juicio ($J$ — Estructura / Planificación):** Preferencia por el orden, la previsión metódica, la finalización de metas preestablecidas y el apego a un plan sin desviarse ante distracciones.
- **Percepción ($P$ — Flexibilidad / Adaptación):** Preferencia por la exploración espontánea, la apertura a nuevas oportunidades, la improvisación en tiempo real y la adaptabilidad ante imprevistos.

En lugar de cuestionarios auto-declarados tradicionales (donde el usuario suele responder según lo que "cree que debería responder"), el Judging Game sitúa al usuario dentro de un **entorno visual interactivo de laberinto** y **mide objetivamente sus patrones motores y de toma de decisiones**.

---

### 2. Arquitectura de Archivos del Juego

La carpeta [`picto-path-ai/games/judging_game/`](file:///c:/Universidad/@Semestre5/IA/picto-path-ai/games/judging_game/) contiene los módulos del juego:

| Archivo | Rol | Descripción |
| :--- | :--- | :--- |
| `scenarios.ts` | Configuración | Define los 4 escenarios (Misión Rescate, Búnker, Ruinas Piratas, Jardín Místico), personajes, metas y priors. |
| `types.ts` | Definiciones TypeScript | Interfaces de datos (`Cell`, `Point`, `Scenario`, `Metrics`, `ScoreBreakdown`, etc.). |
| `MazeGenerator.ts` | Generador Algorítmico | Algoritmo DFS (Depth-First Search) con backtrack recursivo para crear laberintos solubles garantizados. |
| `BehaviorTracker.ts` | Telemetría Conductual | Registra tiempos de planificación, posiciones visitadas, celdas repetidas, direcciones y bonos recolectados. |
| `JudgingFormula.ts` | Motor Matemático (TS) | Implementa la fórmula psicométrica de 6 variables y la Entropía de Shannon en el cliente. |
| `MazeGame.ts` | Motor de Renderizado | Bucle de pintado en HTML5 Canvas a 60 FPS con animaciones, niebla de guerra opcional y colisiones. |
| `UI.ts` | Capa Visual Clásica | Interfaz auxiliar y controles para modo standalone. |
| `formula.py` | Motor Matemático (Python) | Réplica idéntica de la fórmula en Python para validación en backend. |
| `schemas.py` | Pydantic Schemas | Modelos de datos para el API FastAPI (`JudgingMetrics`, `JudgingResult`). |
| `router.py` | FastAPI Router | Endpoint REST (`POST /api/v1/judging/calculate`) para procesar métricas en servidor. |

---

### 3. La Fórmula Psicométrica ($0.0$ a $10.0$)

El puntaje final se normaliza en la escala $[0.0, 10.0]$:

$$\text{Judging Score} = 10 \times \left( 0.20 \cdot P + 0.20 \cdot E + 0.15 \cdot C + 0.15 \cdot F + 0.10 \cdot O + 0.20 \cdot S \right)$$

Donde cada componente está acotado en $[0, 1]$:

#### Componente 1: Planificación ($P$, Peso: $20\%$)
$$P = \min\left(1.0, \frac{t_{\text{planificación}}}{15\,\text{segundos}}\right)$$
- **Fundamento:** Los perfiles $J$ dedican tiempo a observar el laberinto, identificar la salida y trazar mentalmente su ruta antes de dar el primer paso. Los perfiles $P$ tienden a reaccionar impulsivamente y empezar a moverse de inmediato.

#### Componente 2: Eficiencia de Ruta ($E$, Peso: $20\%$)
$$E = \min\left(1.0, \frac{\text{Pasos Óptimos}}{\text{Pasos Reales}}\right)$$
- **Fundamento:** Se calcula la distancia mínima (camino crítico) mediante búsqueda en anchura (BFS). Un valor cercano a $1.0$ indica ejecución precisa y sin desvíos.

#### Componente 3: Compromiso de Dirección ($C$, Peso: $15\%$)
$$C = 1.0 - \frac{\text{Celdas Revisitadas}}{\text{Pasos Totales}}$$
- **Fundamento:** Mide el titubeo o backtracking. Los individuos $J$ mantienen la convicción en su trayectoria elegida; los perfiles $P$ exploran ramales y regresan sobre sus pasos para reevaluar opciones.

#### Componente 4: Foco vs Distracción ($F$, Peso: $15\%$)
$$F = 1.0 - \frac{\text{Bonos Opcionales Recolectados}}{\text{Bonos Totales en el Mapa}}$$
- **Fundamento:** En el mapa se colocan ítems secundarios fuera del camino directo. Un jugador enfocado en la meta principal ignora las distracciones ($F \to 1.0$). Un explorador que prefiere recoger todo se orienta a Percepción ($F \to 0.0$).

#### Componente 5: Orden Direccional — Entropía de Shannon ($O$, Peso: $10\%$)
$$H = -\sum_{d \in \{\uparrow, \downarrow, \leftarrow, \rightarrow\}} p(d) \cdot \log_2 p(d)$$
$$O = \max\left(0.0, 1.0 - \frac{H}{2.0}\right)$$
- **Fundamento:** Con 4 direcciones posibles, la entropía máxima teórica es $\log_2(4) = 2.0$ bits (distribución uniforme o caótica). Un movimiento planificado tiene patrones rítmicos y estructurados, reduciendo la entropía.

#### Componente 6: Sesgo de Escenario ($S$, Peso: $20\%$)
$$S = \text{Prior del Escenario Elegido}$$
- **Fundamento:** La elección previa del reto revela la predisposición natural del participante:
  - *Misión Rescate (Protocolo estricto 1-2-3):* Prior $0.85$ (Alta estructura).
  - *Búnker Cuántico (Contrarreloj):* Prior $0.65$ (Estructura moderada).
  - *Ruinas Piratas (Orden libre):* Prior $0.35$ (Flexibilidad moderada).
  - *Jardín Místico (Exploración relajada):* Prior $0.15$ (Alta espontaneidad).

---

### 4. Interpretación del Resultado

| Rango de Score | Rasgo Dominante | Características Vocacionales |
| :---: | :---: | :--- |
| **$7.5 - 10.0$** | **Juicio Marcado ($J$)** | Planificador riguroso, metódico, excelente en gestión de proyectos, cronogramas y cumplimiento de estándares. |
| **$5.0 - 7.4$** | **Juicio Moderado ($J$)** | Estructurado pero capaz de adaptarse a contingencias operativas. |
| **$2.5 - 4.9$** | **Percepción Moderada ($P$)** | Adaptable, flexible, trabaja bien en ambientes dinámicos y sin procedimientos rígidos. |
| **$0.0 - 2.4$** | **Percepción Marcada ($P$)** | Explorador nato, altamente creativo, enfocado en descubrir alternativas y romper esquemas establecidos. |

