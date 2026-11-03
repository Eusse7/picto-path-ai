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
├── data.csv              # Dataset usado para entrenar el clasificador MBTI
├── docker-compose.yml    # Orquestación local de API + PostgreSQL + ChromaDB
├── .env.example          # Plantilla con variables de entorno para servicios y bases de datos
├── .gitignore            # Exclusión de pesos pesados, datasets masivos, entornos virtuales y vms
└── README.md             # Documentación general del proyecto y flujo de trabajo
```

### Detalle de Módulos

* **`/frontend`**: Código de la aplicación cliente, componentes visuales reutilizables, pantallas del flujo de evaluación y catálogo de imágenes/estímulos en `public/gallery/`.
* **`/backend`**: Endpoints en FastAPI, integración con el modelo de ML y conectores preparados para PostgreSQL y ChromaDB.
* **`/ai_model`**: Entorno de Machine Learning / Deep Learning, notebooks exploratorios, scripts reproducibles (`train.py`, `evaluate.py`) y carpeta `models/` para los artefactos exportados (`modelo_rf.pkl`, `pesos.pt`).
* **`/data.csv`**: Dataset de entrenamiento del clasificador Random Forest.

---

##  Inicio Rápido con Docker Compose

Para levantar el entorno completo de desarrollo con un solo comando:

1. **Copiar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Levantar los servicios (FastAPI, PostgreSQL y ChromaDB):**
   ```bash
   docker compose up --build
   ```

3. **Acceder a los servicios locales:**
   - **API Backend & Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL:** `localhost:5433` (DB: `picto_path_db`; dentro de Docker usa `5432`)
   - **ChromaDB:** [http://localhost:8001](http://localhost:8001)

4. **Levantamiento frontend (Abre una nueva temrinal)**

     ```bash
   cd picto-path-ai
   ```

      ```bash
   cd frontend
   ```
     
   ```bash
   npm install
      ```
   
   ```bash
   npm run dev
      ```

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
