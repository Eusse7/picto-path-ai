# Frontend - Picto-Path AI

Módulo de interfaz de usuario para el test interactivo vocacional basado en estímulos visuales.

## Estructura de Directorios

```text
frontend/
├── public/
│   └── gallery/              # Banco de imágenes y estímulos visuales curados para el test
│       └── manifest.sample.json # Metadatos de los pares/grupos de imágenes
├── src/
│   ├── assets/               # Recursos estáticos (iconos, fuentes, estilos)
│   ├── components/           # Componentes visuales reutilizables (tarjetas de imagen, visor de resultados)
│   ├── pages/                # Vistas principales (Inicio, Test Interactivo, Resultados)
│   ├── services/             # Clientes de API para consumir endpoints (mocks y backend real)
│   ├── hooks/                # Hooks personalizados para gestión de estado del test
│   ├── App.jsx / App.tsx
│   └── main.jsx / main.tsx
├── package.json
└── README.md
```

## Flujo de Trabajo
1. **Ejecución:** `npm install` y `npm run dev` levantan el hub React en `http://localhost:5173`.
2. **Minijuegos:** El hub monta Introversion, Sensing, Judging y Thinking desde la única carpeta `games/thinking_game`.
3. **Thinking:** Vite lo sirve automáticamente en `/thinking_game`; no requiere una segunda terminal ni un segundo servidor.
4. **Predicción:** El frontend usa `VITE_API_BASE_URL` si está definida; por defecto consume `http://localhost:8000/api/v1/test/predict-mbti`.
