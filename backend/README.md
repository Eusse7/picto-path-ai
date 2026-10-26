# Backend - Picto-Path AI

Servicio API desarrollado en **FastAPI**, encargado de orquestar la lógica de negocio, endpoints del test, inferencia de modelos de ML y persistencia de datos (PostgreSQL, ChromaDB y Neo4j).

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
│   │   └── neo4j_client.py  # Conexión al grafo Neo4j
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
La API estará disponible en `http://localhost:8000` y la documentación interactiva en `http://localhost:8000/docs`.

### Opción 2: Entorno Local (Python 3.11+)
```bash
cd backend
python -m venv venv
# Activar entorno (Windows: venv\Scripts\activate | Unix: source venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
