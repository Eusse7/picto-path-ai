# Módulo de Percepción Sensorial (Sensing Game Backend)

- **Eje evaluado:** Sensorial ($S$) vs Intuición ($N$).
- **Variable generada:** `Sensing Score` (rango $0.0$ a $10.0$).
- **Fórmula Psicométrica:**
  $$\text{Sensing Score} = \max\Big(0, \min\big(10, (\text{aciertos} \times 2) - (\text{errores} \times 0.5) - 0.45 \times \max(0, \text{tiempo} - 4.0)\big)\Big)$$

---

## Estructura Modular del Módulo Python

Este módulo contiene la lógica matemática, psicométrica, inferencia MBTI y recomendaciones para el minijuego de Percepción Sensorial:

```text
games/sensing_game/
├── formula.py         # Cálculo matemático calibrado del Sensing Score (penalización por demora y errores)
├── classifier.py      # Motor de inferencia y decodificación MBTI para los 16 tipos de personalidad
├── rag_advice.py      # Generador RAG con recomendaciones clínicas y vocacionales basadas en evidencia
├── schemas.py         # Modelos de validación de datos Pydantic (Request / Response)
├── router.py          # Router FastAPI con endpoints listos para conectar (/calculate-score, /predict, /advice)
├── cli.py             # Script de verificación por consola
└── __init__.py        # Exportaciones del paquete
```

---

## Verificación Local

Para verificar el correcto funcionamiento de toda la lógica psicométrica y matemática desde la consola:

```bash
python games/sensing_game/cli.py
```

## Endpoints para Integración Frontend Unificada

El router de este módulo expone los siguientes endpoints listos para montar en el backend principal:

* `POST /api/v1/sensing/calculate-score`: Recibe `{ hits, errors, elapsed_time }` y devuelve `{ sensing_score, is_sensing, penalty_time, penalty_errors }`.
* `POST /api/v1/sensing/predict`: Clasifica el perfil MBTI completo recibiendo demográficos y los 4 puntajes.
* `POST /api/v1/sensing/advice`: Genera recomendaciones personalizadas vocacionales y de manejo del estrés.
