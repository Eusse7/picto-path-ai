# Picto-Path AI 

**Picto-Path AI** es un sistema inteligente de orientación vocacional que reemplaza los cuestionarios de texto tradicionales por un test interactivo de estímulos visuales. Analiza las elecciones visuales del usuario para clasificar rasgos de personalidad, mapearlos con marcos psicológicos validados y recomendar perfiles profesionales afines mediante grafos de conocimiento y similitud vectorial.

---

## Estructura del Repositorio

El proyecto está organizado de forma modular para permitir el trabajo en paralelo de los diferentes componentes:

```text
picto-path-ai/
├── frontend/             # Interfaz de usuario (React / Web UI) y galería de estímulos visuales
├── backend/              # API REST con FastAPI, lógica de negocio y conectores de bases de datos
├── ai_model/             # Notebooks de experimentación, scripts de entrenamiento y modelos exportados
├── data_and_graphs/      # Datasets limpios, scripts de carga a Neo4j y mapeos psicológicos
├── docker-compose.yml    # Orquestación de contenedores locales (API + PostgreSQL + ChromaDB + Neo4j)
├── .env.example          # Plantilla con variables de entorno para servicios y bases de datos
├── .gitignore            # Exclusión de pesos pesados, datasets masivos, entornos virtuales y vms
└── README.md             # Documentación general del proyecto y flujo de trabajo
```

### Detalle de Módulos

* **`/frontend`**: Código de la aplicación cliente, componentes visuales reutilizables, pantallas del flujo de evaluación y catálogo de imágenes/estímulos en `public/gallery/`.
* **`/backend`**: Endpoints en FastAPI, modelos ORM de persistencia, integración con el modelo de ML y conectores a PostgreSQL, ChromaDB y Neo4j.
* **`/ai_model`**: Entorno de Machine Learning / Deep Learning, notebooks exploratorios, scripts reproducibles (`train.py`, `evaluate.py`) y carpeta `models/` para los artefactos exportados (`modelo_rf.pkl`, `pesos.pt`).
* **`/data_and_graphs`**: Archivos estructurados (CSVs limpios), diccionarios de ontologías psicológicas (RIASEC / Big Five) y scripts Cypher/Python para poblar Neo4j.

---

##  Inicio Rápido con Docker Compose

Para levantar el entorno completo de desarrollo con un solo comando:

1. **Copiar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Levantar los servicios (FastAPI, PostgreSQL, ChromaDB y Neo4j):**
   ```bash
   docker compose up --build
   ```

3. **Acceder a los servicios locales:**
   - **API Backend & Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL:** `localhost:5432` (DB: `picto_path_db`)
   - **ChromaDB:** [http://localhost:8001](http://localhost:8001)
   - **Neo4j Browser:** [http://localhost:7474](http://localhost:7474) (Credenciales en `.env`)

---

## Estrategia de Ramas

Para garantizar un ritmo ágil y evitar conflictos de integración:

* **`main`**: Rama protegida y de producción. El código aquí **siempre debe compilar y funcionar**. Nunca se realizan commits directos a `main`.
* **Ramas por tarea (Feature/Fix branches)**: Ramas de vida corta enfocadas en una única funcionalidad o corrección, utilizando prefijos claros por área o tarea:
  * `feat/ui-test-stimuli`
  * `feat/api-mock-endpoints`
  * `feat/model-baseline-rf`
  * `feat/neo4j-graph-loader`
  * `fix/model-weights-tuning`
* **Integración continua**: Cada rama se fusiona mediante Pull Request (PR) a `main` cada **1 o 2 días**. No se deben acumular cambios aislados por más tiempo para prevenir colisiones de código y dependencias rotas.

---
