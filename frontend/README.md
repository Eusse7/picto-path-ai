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
1. **Fase de Mocks:** Consumir los datos simulados provistos por la API en `/api/v1/test/questions` y `/api/v1/test/submit-mock`.
2. **Galería de Estímulos:** La carpeta `public/gallery/` almacena las imágenes organizadas por categorías de estímulos para la toma de decisiones visuales del usuario.
3. **Conexión Real:** Transición a los endpoints de producción una vez integrados el modelo de clasificación y las bases de datos.
