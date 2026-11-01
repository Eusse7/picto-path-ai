# Minijuego 1: Percepción Sensorial (Sensing Game)

- **Eje evaluado:** Sensorial ($S$) vs Intuición ($N$).
- **Variable generada:** `Sensing Score` (rango $0.0$ a $10.0$).
- **Dinámica:** Desafío de agilidad visual "Encuentra las 5 Diferencias" con 4 escenarios dinámicos, cronómetro de alta resolución y penalización por demora.
- **Fórmula Psicométrica:**
  $$\text{Sensing Score} = \max\Big(0, \min\big(10, (\text{aciertos} \times 2) - (\text{errores} \times 0.5) - 0.45 \times \max(0, \text{tiempo} - 4.0)\big)\Big)$$

---

## Estructura del Minijuego (Estándar Modular)

Sigue la misma estructura estándar de `games/introversion_game`:

```text
games/sensing_game/
├── package.json              # Configuración de dependencias (React 18 + Lucide)
├── vite.config.ts            # Configuración de Vite dev server y build
├── tsconfig.json             # Configuración de TypeScript/JSX
├── index.html                # Entry point HTML para Vite
├── public/
│   └── favicon.svg           # Ícono del minijuego
├── src/
│   ├── App.jsx               # Componente principal interactivo del juego
│   ├── main.tsx              # Montaje de React DOM
│   └── index.css             # Estilos y animaciones del juego
│
├── formula.py                # Módulo de cálculo matemático de Sensing Score
├── classifier.py             # Módulo de inferencia y decodificación MBTI (16 tipos)
├── rag_advice.py             # Módulo RAG con recomendaciones clínicas basadas en evidencia
├── schemas.py                # Modelos de validación Pydantic
├── router.py                 # Router FastAPI con endpoints listos para consumir
├── cli.py                    # Script de verificación por terminal (python games/sensing_game/cli.py)
└── sensing_all_in_one.html   # Build autónomo independiente para jugar con doble clic sin npm
```

---

## Cómo Correr este Minijuego

### Opción 1: Con Vite (Igual a `introversion_game`)
```bash
cd games/sensing_game
npm install
npm run dev
```
Abre en: `http://localhost:5174`

### Opción 2: Standalone sin dependencias
Abre directamente [`sensing_all_in_one.html`](file:///d:/Documents/U/semestre5/ia/proyecto/games/sensing_game/sensing_all_in_one.html) en tu navegador.

### Opción 3: Pruebas del Backend / Lógica Psicométrica en Python
```bash
python games/sensing_game/cli.py
```
