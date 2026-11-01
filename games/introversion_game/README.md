# Minijuego 2: Buscador de Reliquias (Relic Hunter / Abyss)

Evaluación psicométrica conductual del rasgo **Extroversión vs Introversión** ($0.0$ a $10.0$) sin sesgo de deseabilidad social mediante análisis del comportamiento espacial y atencional del usuario durante una sesión de **40 segundos de batería**.

---

## 1. Dilema Conductual Diseñado

El juego sitúa al usuario ante dos rutas estratégicas contrastadas:

1. **Arrecife Superficial (Patrón Extrovertido):**
   - Múltiples gemas distribuidas por el mapa que desaparecen al contacto.
   - Recompensas inmediatas de bajo valor (+10, +15, +20, +25 créditos).
   - Induce alta frecuencia motriz, hiperactividad de clics y saltos constantes de atención espacial.

2. **Cueva Profunda (Patrón Introvertido):**
   - Entorno oscuro que requiere navegación con lámpara focal.
   - Contiene un **único cofre central** de alto valor (+500 créditos).
   - Desafío de concentración: el dron debe permanecer **exactamente 8 segundos absolutamente inmóvil** sobre él.
   - **Mecánica de reinicio:** Cualquier clic en la pantalla durante ese lapso reinicia el contador de concentración a cero.

---

## 2. Telemetría en Tiempo Real (Estados Ocultos)

| Variable Conductual | Tipo / Rango | Descripción y Mecánica |
| :--- | :--- | :--- |
| **Frecuencia Motriz (`frecuenciaMotriz`)** | Entero $\ge 0$ | Conteo acumulado de todos los clics de desplazamiento y órdenes motoras emitidas. |
| **Área Explorada (`areaExplorada`)** | Decimal $[0.0, 1.0]$ | La pantalla se divide en una cuadrícula virtual de **10x10 (100 celdas)**. Se calcula el porcentaje decimal de celdas únicas transitadas por el dron. |
| **Estabilidad Sostenida (`estabilidadSostenida`)** | Segundos $\ge 0$ | Registro del periodo máximo continuo de inmovilidad absoluta del dron sin recibir ningún comando. |

---

## 3. Algoritmo y Fórmula de Calificación

$$\text{Puntaje Final} = 5.0 + (\text{frecuenciaMotriz} \times 0.08) + (\text{areaExplorada} \times 3.0) - (\text{estabilidadSostenida} \times 0.35)$$

$$\text{Puntaje Entregado} = \max\Big(0.0, \min\big(10.0, \text{Puntaje Final}\big)\Big)$$

- **$\ge 5.0$**: Clasificado como **Extroversión ($E$)**.
- **$< 5.0$**: Clasificado como **Introversión ($I$)**.

---

## 4. Estructura del Código

- **`src/App.tsx`**: Componente funcional principal en React/TypeScript con el ciclo de juego completo (instrucciones, briefing, selección de ruta, juego y pantalla de resultados).
- **`src/index.css`**: Hoja de estilos con animaciones submarinas, burbujas, iluminación de cueva y telemetría visual.
- **`src/main.tsx`**: Punto de entrada de Vite.
