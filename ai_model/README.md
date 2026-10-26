# AI Model - Picto-Path AI

Espacio dedicado a la investigación, experimentación, entrenamiento y exportación de modelos de Machine Learning y Deep Learning para la clasificación vocacional a partir de selecciones pictóricas.

## Estructura de Directorios

```text
ai_model/
├── notebooks/          # Jupyter Notebooks de análisis exploratorio, prototipado y validación
├── scripts/            # Scripts reproducibles de entrenamiento, preprocesamiento y evaluación
│   ├── train.py        # Script para entrenar y exportar el modelo
│   └── evaluate.py     # Métricas y evaluación
├── models/             # Directorio de salida para artefactos exportados (modelo_rf.pkl, pesos.pt)
│                       # (Los archivos pesados de pesos se ignoran en Git via .gitignore)
├── requirements.txt    # Dependencias de ML/DL y notebooks
└── README.md
```

## Convención de Exportación
- **Modelos Scikit-Learn:** Exportar con `joblib.dump(model, "models/modelo_rf.pkl")`.
- **Modelos PyTorch:** Exportar pesos con `torch.save(model.state_dict(), "models/pesos.pt")` o `torch.save(model, "models/modelo.pt")`.
- La API de backend montará automáticamente la carpeta `ai_model/models/` para consumir los artefactos generados.
