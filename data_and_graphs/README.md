# Data and Graphs - Picto-Path AI

Espacio central para la gestión de datasets limpios, ontologías de mapeo psicológico y scripts de ingesta/consulta para la base de datos de grafos (Neo4j).

## Estructura de Directorios

```text
data_and_graphs/
├── data/                 # Datasets limpios (ej. profesiones, rasgos, habilidades)
│   ├── riasec_dataset.csv # Dataset con 315 respuestas al inventario RIASEC (q1 a q30)
│   └── sample_professions.csv # Catálogo de profesiones y habilidades requeridas
├── mappings/             # Diccionarios de mapeo psicológico (Holland RIASEC, Big Five, etc.)
│   ├── psychological_dimensions.json
│   └── riasec_mapping.json
├── neo4j_scripts/        # Scripts de ingesta de nodos, relaciones y consultas Cypher
│   ├── ingest_graph.py   # Script de carga hacia Neo4j
│   └── queries.cql       # Consultas Cypher modelo
├── requirements.txt      # Dependencias para manipulación de datos y cliente Neo4j
└── README.md
```

## Flujo de Carga a Neo4j
1. Asegurarse de que el contenedor de Neo4j esté corriendo (`docker compose up neo4j -d`).
2. Configurar las variables en `.env` (`NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`).
3. Ejecutar el script de ingesta:
   ```bash
   python neo4j_scripts/ingest_graph.py
   ```
