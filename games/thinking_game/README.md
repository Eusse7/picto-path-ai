# Cosecha de Lunaverde

## Propósito del juego

**Cosecha de Lunaverde** es el minijuego del eje exploratorio **Thinking (T) /
Feeling (F)** de Picto-Path AI. En cuatro rondas, el jugador debe distribuir un
número limitado de cestas entre los habitantes de una aldea.

Cada personaje tiene iconos que representan circunstancias visibles, por
ejemplo trabajo, hambre, enfermedad, familia, necesidad o cumpleaños. La
decisión del jugador consiste en elegir a quién entregar cada cesta y puede
corregir una asignación antes de cerrar la ronda.

La versión que usa el panel principal está implementada como un componente
React en `frontend/src/components/ThinkingGame.jsx`. Esta carpeta conserva los
assets, estilos y la implementación original del juego para que React pueda
servirlos desde `/thinking_game`.

## Estructura de la carpeta

```text
games/thinking_game/
├── assets/
│   ├── backgrounds/   # Fondos visuales de las cuatro rondas.
│   ├── baskets/       # Imagen de las cestas que se distribuyen.
│   ├── characters/   # Imágenes de los habitantes de Lunaverde.
│   └── icons/        # Iconos de las circunstancias de cada personaje.
├── index.html         # Documento HTML de la versión independiente.
├── main.js            # Lógica original del juego y sus interacciones.
├── style.css          # Estilos visuales del juego.
└── README.md          # Documentación, fórmulas e instrucciones.
```

Los archivos de esta carpeta proporcionan los recursos visuales y estilos que
el componente React reutiliza. La lógica que se ejecuta desde el panel
principal está en `frontend/src/components/ThinkingGame.jsx`; `main.js` se
conserva como referencia de la implementación independiente y no requiere un
servidor adicional cuando se juega desde el panel.

## Cómo se juega

1. Se inicia una partida y se muestra la primera escena.
2. El jugador selecciona una cesta y pulsa un personaje, o arrastra la cesta
   hasta él.
3. Se pueden entregar varias cestas al mismo personaje.
4. Una cesta entregada se puede pulsar para devolverla y reasignarla.
5. La ronda solo se puede finalizar cuando todas sus cestas fueron asignadas.
6. Al terminar la cuarta ronda se calcula el resultado global y se envía al
   backend.

Las cuatro rondas tienen escenas, personajes, iconos y cantidades de cestas
distintas. No se asigna un valor fijo por nombre de personaje: los valores
dependen exclusivamente de sus iconos.

## Pesos de los iconos

Cada icono tiene un peso `T` y un peso `F`:

| Icono | T | F | Interpretación exploratoria |
|---|---:|---:|---|
| Trabajo | 0.60 | 0.40 | Contribución y criterios de acción |
| Hambre | 0.40 | 0.60 | Necesidad inmediata y cuidado |
| Enfermedad | 0.40 | 0.60 | Vulnerabilidad y bienestar |
| Cumpleaños | 0.45 | 0.55 | Circunstancia personal |
| Familia | 0.45 | 0.55 | Responsabilidad hacia otros |
| Necesidad | 0.40 | 0.60 | Situación personal urgente |

Si un personaje tiene varios iconos, su valor se obtiene promediando los pesos
de todos sus iconos:

```text
T_i = (T_i1 + T_i2 + ... + T_in) / n
F_i = (F_i1 + F_i2 + ... + F_in) / n
```

Si no tiene iconos reconocidos, sus valores son `T_i = 0` y `F_i = 0`; no se
inventan pesos.

## Fórmula del puntaje por ronda

Sea:

- `x_i`: número de cestas asignadas al personaje `i`.
- `T_i`: valor Thinking promedio del personaje.
- `F_i`: valor Feeling promedio del personaje.
- `B_r`: total de cestas disponibles en la ronda `r`.

Las cestas ponderan proporcionalmente la contribución de cada personaje:

```text
T_r = suma(x_i × T_i) / B_r
F_r = suma(x_i × F_i) / B_r
```

Después se calcula el puntaje de la ronda:

```text
S_r = 50 + 50 × ((T_r - F_r) / (T_r + F_r))
```

Si `T_r + F_r` es cero, el puntaje neutral es `50`. El resultado se limita al
intervalo `0` a `100`.

El puntaje global de la partida es el promedio de las cuatro rondas:

```text
S_global = (S_1 + S_2 + S_3 + S_4) / 4
```

Finalmente, el valor que recibe el modelo externo se convierte a escala de
`0` a `10`:

```text
modelScore = S_global / 10
```

También se conserva `S_global` en escala `0` a `100` para análisis.

### Ejemplo

Supongamos una ronda con `B_r = 2` cestas:

- Personaje A: `T_i = 0.50`, `F_i = 0.50`, recibe 1 cesta.
- Personaje B: `T_i = 0.40`, `F_i = 0.60`, recibe 1 cesta.

```text
T_r = (1 × 0.50 + 1 × 0.40) / 2 = 0.45
F_r = (1 × 0.50 + 1 × 0.60) / 2 = 0.55

S_r = 50 + 50 × ((0.45 - 0.55) / (0.45 + 0.55))
S_r = 45
```

Un personaje sin cestas tiene `x_i = 0`, por lo tanto no contribuye al
numerador. El score solo se calcula cuando el jugador pulsa **Terminar
reparto**, no mientras todavía puede modificar sus decisiones.

## Relación con Thinking y Feeling

La relación es una **aproximación exploratoria de diseño**, no una medición
psicológica oficial:

- **Thinking (T)** representa, dentro de este juego, mayor peso relativo de
  indicadores asociados con contribución, trabajo y criterios generales.
- **Feeling (F)** representa mayor peso relativo de indicadores asociados con
  necesidades, bienestar, vulnerabilidad y responsabilidades personales.

El jugador no recibe una respuesta correcta o incorrecta. El resultado depende
de cómo distribuye las cestas y de los iconos de los personajes elegidos. Por
eso, entregar más cestas a un personaje aumenta proporcionalmente su
contribución al resultado de la ronda.

El juego no diagnostica personalidad, no clasifica oficialmente MBTI y no es
una escala validada. Su resultado es un indicador de preferencias de decisión
para el proyecto académico.

## Registro y envío

Cada partida genera un identificador y registra, por ronda:

- personaje e iconos visibles;
- pesos `T` y `F` de cada icono;
- valores promedio `T_i` y `F_i`;
- cestas asignadas y cestas disponibles;
- `scoreT`, `scoreF` y `score100`;
- promedio global y `modelScore`.

Cuando el backend está disponible, el resultado se envía a:

```text
POST http://localhost:8000/api/v1/games/thinking/results
```

El frontend envía `modelScore`, que siempre está limitado entre `0` y `10`.
Si el backend no está disponible, el juego conserva el resultado local y
permite regresar al panel.

## Ejecución

Desde la raíz del proyecto:

```powershell
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173` y seleccionar **Jugar pensamiento**. No es
necesario iniciar un segundo servidor para Thinking.
