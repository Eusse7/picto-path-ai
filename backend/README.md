# Backend - Picto-Path AI

Servicio API desarrollado en **FastAPI**, encargado de orquestar la lógica de negocio, endpoints del test, inferencia de modelos de ML y conectores preparados para PostgreSQL y ChromaDB.

## Estructura de Directorios

```text
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/       # Routers para salud y flujo del test
│   │   └── api_v1.py        # Agrupador de rutas API v1
│   ├── core/
│   │   └── config.py        # Configuración y variables de entorno
│   ├── db/
│   │   ├── postgres.py      # Conexión SQLAlchemy a PostgreSQL
│   │   ├── chromadb_client.py # Conexión a ChromaDB (vector store)
│   ├── models/              # Modelos ORM relacionales
│   ├── schemas/             # Esquemas Pydantic de entrada/salida
│   ├── services/
│   │   ├── mock_service.py  # Mocks para desbloquear el desarrollo de Frontend
│   │   └── model_inference.py # Servicio para cargar modelos exportados (.pkl / .pt)
│   └── main.py              # Punto de entrada de la aplicación FastAPI
├── Dockerfile
├── requirements.txt
└── README.md
```

## Ejecución

### Opción 1: Con Docker Compose (Recomendada)
Desde la raíz del repositorio:
```bash
docker compose up backend --build
```
La API estará disponible en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`. PostgreSQL se publica en el puerto `5433` para evitar conflictos con instalaciones locales; dentro de Docker continúa usando `5432`.

El servicio Docker no incluye el frontend. Para usar la aplicación completa, ejecuta el frontend en otra terminal:
```bash
cd frontend
npm install
npm run dev
```

## Flujo de resultados de los minijuegos

El backend expone un flujo común para acumular los cuatro puntajes y ejecutar una única inferencia:

1. `POST /api/v1/test/sessions` crea un `session_id`.
2. `POST /api/v1/games/{game_id}/results?session_id=...` recibe un resultado normalizado de `introversion`, `sensing`, `thinking` o `judging`.
3. `POST /api/v1/test/submit-results` recibe los datos del participante y los resultados acumulados, valida que estén los cuatro puntajes y ejecuta el modelo.

También existen adaptadores de cálculo:

- `POST /api/v1/games/sensing/calculate`
- `POST /api/v1/games/judging/submit`

La respuesta final contiene `predicted_mbti`, `personality_name`, `confidence`, `source` y los cuatro puntajes usados. Si `modelo_rf.pkl` no está disponible, se devuelve explícitamente el fallback analítico y no se presenta como inferencia del modelo.

### Opción 2: Entorno Local (Python 3.11+)
```bash
cd backend
python -m venv venv
# Activar entorno (Windows: venv\Scripts\activate | Unix: source venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Si `ai_model/models/modelo_rf.pkl` no existe, la API funciona con el fallback analítico y lo indica en la respuesta mediante el campo `source`.
