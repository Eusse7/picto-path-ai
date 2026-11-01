# Minijuegos Psicométricos - Picto-Path AI

Cada minijuego evalúa una dimensión cognitiva del marco MBTI y genera un puntaje continuo (de 0.0 a 10.0) que alimenta el modelo de Machine Learning (`modelo_rf.pkl`):

| Minijuego / Carpeta | Eje MBTI Evaluado | Variable que alimenta en el Modelo |
| :--- | :--- | :--- |
| **`sensing_game/`** | **Percepción:** Sensorial ($S$) vs Intuición ($N$) | `Sensing Score` |
| **`introversion_game/`** | **Energía:** Extroversión ($E$) vs Introversión ($I$) | `Introversion Score` |
| **`thinking_game/`** | **Juicio:** Pensamiento ($T$) vs Sentimiento ($F$) | `Thinking Score` |
| **`judging_game/`** | **Estilo de Vida:** Juicio ($J$) vs Percepción ($P$) | `Judging Score` |

---

## Estructura de Directorios

- **`sensing_game/`**: Minijuego de percepción visual ("Encuentra las Diferencias") con cronómetro y penalizaciones.
- **`introversion_game/`**: Minijuego destinado a medir la dinámica de interacción/energía.
- **`thinking_game/`**: Minijuego orientado a dilemas analíticos vs empáticos.
- **`judging_game/`**: Minijuego orientado a preferencia por estructura, orden y cierre vs exploración abierta.

