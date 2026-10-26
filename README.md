# Picto-Path AI 🧭🎨

**Picto-Path AI** es un sistema inteligente de orientación vocacional que reemplaza los cuestionarios de texto tradicionales por un test interactivo de estímulos visuales. Analiza las elecciones visuales del usuario para clasificar rasgos de personalidad, mapearlos con marcos psicológicos validados y recomendar perfiles profesionales afines mediante grafos de conocimiento y similitud vectorial.

---

## 🏗️ Estructura del Repositorio

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

## 🚀 Inicio Rápido con Docker Compose

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

## 🌿 Estrategia de Ramas (Trunk-Based Modificado)

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

## 📅 Cronograma de Ejecución (14 Días)

Plan de trabajo estructurado en 4 fases secuenciales:

| Fase | Días | Enfoque | Objetivos Principales |
| :--- | :---: | :--- | :--- |
| **Fase 1: Cimientos Paralelos** | **1 - 4** | Desarrollo desacoplado y contratos de datos | • Entrenar un modelo base/funcional preliminar.<br>• Definir y entregar la matriz de mapeo psicológico y dataset estructurado.<br>• Levantar la API en FastAPI exponiendo contratos y datos simulados (*mocks*).<br>• Diseñar y maquetar las pantallas principales consumiendo los mocks de la API. |
| **Fase 2: El Ensamble** | **5 - 8** | Integración extremo a extremo | • Integrar el modelo de machine learning en el pipeline real de la API.<br>• Conectar el frontend a los endpoints verdaderos en reemplazo de los mocks.<br>• Validar el flujo continuo: Selección de imágenes ➡️ Predicción ➡️ Resultados. |
| **Fase 3: Bases de Datos Complejas** | **9 - 11** | Enriquecimiento con Grafos y Vectores | • Conectar y poblar Neo4j para mapear relaciones entre habilidades, comportamientos y profesiones.<br>• Integrar ChromaDB para búsqueda semántica/vectorial de compatibilidad vocacional.<br>• Habilitar almacenamiento persistente de historial en PostgreSQL. |
| **Fase 4: Congelamiento de Código** | **12 - 14** | Calidad, Estabilidad y Cierre (*Code Freeze*) | • **Cero funcionalidades nuevas**.<br>• Corrección exhaustiva de bugs y pruebas de integración.<br>• Refinamiento visual, tiempos de respuesta y accesibilidad.<br>• Documentación final, manuales de despliegue y preparación de la presentación. |
