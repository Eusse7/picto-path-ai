# AI Model - Picto-Path AI

Espacio dedicado a la investigación, experimentación, entrenamiento y exportación de modelos de Machine Learning y Deep Learning para la clasificación de personalidad MBTI y orientación vocacional a partir de selecciones pictóricas y métricas psicométricas.

## Estructura de Directorios

```text
ai_model/
├── notebooks/          # Jupyter Notebooks de análisis exploratorio, prototipado y validación
├── scripts/            # Scripts reproducibles de entrenamiento, preprocesamiento y evaluación
│   ├── train.py        # Script para entrenar y exportar el modelo
│   └── evaluate.py     # Métricas y evaluación detallada
├── models/             # Directorio de salida para artefactos exportados (modelo_rf.pkl, model_metadata.json)
├── requirements.txt    # Dependencias de ML/DL y notebooks
└── README.md
```

## Dataset de Entrenamiento (`data.csv`)

El modelo se entrena sobre el dataset psicométrico con **43,744 muestras balanceadas** (2,734 por cada uno de los 16 tipos MBTI):

- **Columnas Numéricas:**
  - `Age`: Edad del usuario.
  - `Education`: Nivel educativo codificado (0 / 1).
  - `Introversion Score`: Puntaje continuo del eje Extroversión / Introversión (E vs I).
  - `Sensing Score`: Puntaje continuo del test visual y percepción sensorial (S vs N).
  - `Thinking Score`: Puntaje continuo del eje Pensamiento / Sentimiento (T vs F).
  - `Judging Score`: Puntaje continuo del eje Juicio / Percepción (J vs P).
- **Columnas Categóricas:**
  - `Gender`: Género (`Female`, `Male`).
  - `Interest`: Área de interés preferente (`Arts`, `Technology`, `Sports`, `Others`, `Unknown`).
- **Target (`Personality`):**
  - 16 personalidades MBTI: `ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP, INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP`.

## Entrenamiento y Pipeline

El pipeline de Scikit-Learn incluye:
1. **`ColumnTransformer`**: Preprocesamiento con `OneHotEncoder` para variables categóricas y `passthrough` para variables numéricas.
2. **`RandomForestClassifier`**: Clasificador con 120 estimadores, balanceado y paralelizado (`n_jobs=-1`).

### Ejecución del entrenamiento:

```bash
# Desde la raíz del proyecto o desde ai_model:
python ai_model/scripts/train.py

# Parámetros opcionales:
python ai_model/scripts/train.py --data-path data.csv --n-estimators 150 --test-size 0.2
```

### Evaluación del modelo:

```bash
python ai_model/scripts/evaluate.py
```

## Métricas del Modelo Entrenado

- **Exactitud Global (Accuracy):** ~90.2% en conjunto de prueba independiente (8,749 muestras).
- **F1-Score Macro:** ~90.2%
- **Precisión por Eje Psicométrico:**
  - **Eje E/I (Energy):** 93.03%
  - **Eje S/N (Perception - Sensing):** 97.02%
  - **Eje T/F (Judgment):** 99.93%
  - **Eje J/P (Lifestyle):** 99.93%

## Consumo desde el Backend

El backend monta automáticamente el artefacto `ai_model/models/modelo_rf.pkl` mediante [model_inference.py](file:///c:/Users/afert/Desktop/PROYECTO%20IA/picto-path-ai/backend/app/services/model_inference.py) para realizar predicciones tanto en entorno Docker como en ejecución local.
