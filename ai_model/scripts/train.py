"""
Script de entrenamiento y exportación del modelo de clasificación de personalidad MBTI
para Picto-Path AI utilizando el dataset psicométrico (data.csv - 43,744 registros).
"""
import os
import sys
import json
import argparse
from datetime import datetime, timezone
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score

NUMERICAL_COLS = ['Age', 'Education', 'Introversion Score', 'Sensing Score', 'Thinking Score', 'Judging Score']
CATEGORICAL_COLS = ['Gender', 'Interest']
TARGET_COL = 'Personality'

MBTI_AXES = {
    0: ("Energy", "E", "I"),
    1: ("Perception", "S", "N"),
    2: ("Judgment", "T", "F"),
    3: ("Lifestyle", "J", "P")
}

def find_dataset(custom_path=None) -> str:
    """Busca el archivo de dataset en rutas candidatas si no se pasa de forma explícita."""
    if custom_path and os.path.exists(custom_path):
        return os.path.abspath(custom_path)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, "..", "..", "data.csv"),
        os.path.join(base_dir, "..", "data.csv"),
        os.path.join(base_dir, "data.csv"),
        os.path.join(base_dir, "..", "..", "data_and_graphs", "data", "data.csv"),
        os.path.abspath("data.csv")
    ]

    for cand in candidates:
        if os.path.exists(cand):
            return os.path.abspath(cand)

    raise FileNotFoundError(
        "No se pudo encontrar el archivo 'data.csv'. "
        "Por favor especifícalo mediante el argumento --data-path."
    )

def build_pipeline(n_estimators: int = 120, max_depth: int = 20, random_state: int = 42) -> Pipeline:
    """Construye un Pipeline de scikit-learn con preprocesamiento y clasificador RandomForest."""
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', NUMERICAL_COLS),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_COLS)
        ]
    )

    clf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        random_state=random_state,
        n_jobs=-1
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', clf)
    ])

    return pipeline

def evaluate_mbti_axes(y_true, y_pred) -> dict:
    """Calcula la precisión por cada uno de los 4 ejes independientes de MBTI."""
    axis_metrics = {}
    true_list = list(y_true)
    pred_list = list(y_pred)
    n = len(true_list)
    for idx, (axis_name, char_a, char_b) in MBTI_AXES.items():
        correct = sum(1 for t, p in zip(true_list, pred_list) if len(t) == 4 and len(p) == 4 and t[idx] == p[idx])
        acc = float(correct / n) if n > 0 else 0.0
        axis_metrics[f"{axis_name}_{char_a}_vs_{char_b}"] = {
            "axis": f"{char_a}/{char_b}",
            "name": axis_name,
            "accuracy": round(acc, 4),
            "accuracy_pct": f"{acc * 100:.2f}%"
        }
    return axis_metrics

def train_and_export(
    data_path: str = None,
    output_dir: str = None,
    n_estimators: int = 120,
    test_size: float = 0.2,
    random_state: int = 42
):
    dataset_file = find_dataset(data_path)
    print(f"[*] Cargando dataset desde: {dataset_file}")
    df = pd.read_csv(dataset_file)
    print(f"[*] Dataset cargado exitosamente: {df.shape[0]} filas, {df.shape[1]} columnas.")

    # Validar columnas requeridas
    expected_cols = set(NUMERICAL_COLS + CATEGORICAL_COLS + [TARGET_COL])
    if not expected_cols.issubset(set(df.columns)):
        missing = expected_cols - set(df.columns)
        raise ValueError(f"Faltan columnas requeridas en el dataset: {missing}")

    X = df[NUMERICAL_COLS + CATEGORICAL_COLS]
    y = df[TARGET_COL]

    print(f"[*] Clases únicas detectadas ({len(y.unique())}): {sorted(y.unique().tolist())}")

    # Train / Test split estratificado
    print(f"[*] Dividiendo en conjuntos de entrenamiento ({(1-test_size)*100:.0f}%) y prueba ({test_size*100:.0f}%)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )

    pipeline = build_pipeline(n_estimators=n_estimators, random_state=random_state)

    print(f"[*] Entrenando RandomForestClassifier (n_estimators={n_estimators})...")
    start_time = datetime.now()
    pipeline.fit(X_train, y_train)
    training_duration = (datetime.now() - start_time).total_seconds()
    print(f"[OK] Entrenamiento completado en {training_duration:.2f} segundos.")

    print("[*] Evaluando en conjunto de prueba...")
    y_pred = pipeline.predict(X_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    f1_macro = float(f1_score(y_test, y_pred, average='macro'))
    f1_weighted = float(f1_score(y_test, y_pred, average='weighted'))
    axis_accuracy = evaluate_mbti_axes(y_test, y_pred)

    print("\n" + "="*60)
    print("MÉTRICAS DE RENDIMIENTO (16 CLASES MBTI)")
    print("="*60)
    print(f"Exactitud Global (Accuracy): {accuracy * 100:.2f}%")
    print(f"F1-Score Macro:              {f1_macro * 100:.2f}%")
    print(f"F1-Score Ponderado:          {f1_weighted * 100:.2f}%")
    print("-" * 60)
    print("Precisión por Eje MBTI:")
    for key, data in axis_accuracy.items():
        print(f"  - Eje {data['axis']} ({data['name']}): {data['accuracy_pct']}")
    print("="*60 + "\n")

    report_dict = classification_report(y_test, y_pred, output_dict=True)

    # Directorio de salida
    if not output_dir:
        output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    os.makedirs(output_dir, exist_ok=True)

    model_path = os.path.join(output_dir, "modelo_rf.pkl")
    metadata_path = os.path.join(output_dir, "model_metadata.json")

    print(f"[*] Exportando modelo entrenado a: {model_path}...")
    joblib.dump(pipeline, model_path)

    metadata = {
        "model_type": "RandomForestClassifier",
        "pipeline_steps": ["ColumnTransformer", "RandomForestClassifier"],
        "dataset_source": os.path.basename(dataset_file),
        "total_samples": int(len(df)),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "numerical_features": NUMERICAL_COLS,
        "categorical_features": CATEGORICAL_COLS,
        "target": TARGET_COL,
        "classes": sorted(y.unique().tolist()),
        "metrics": {
            "accuracy": round(accuracy, 4),
            "f1_macro": round(f1_macro, 4),
            "f1_weighted": round(f1_weighted, 4),
            "axes_accuracy": axis_accuracy
        },
        "training_duration_seconds": round(training_duration, 2),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    print(f"[*] Guardando metadatos en: {metadata_path}...")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print("[OK] Modelo y metadatos exportados exitosamente.")
    return pipeline, metadata

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Entrenar modelo MBTI de Picto-Path AI")
    parser.add_argument("--data-path", type=str, default=None, help="Ruta al archivo data.csv")
    parser.add_argument("--output-dir", type=str, default=None, help="Directorio para guardar modelo_rf.pkl")
    parser.add_argument("--n-estimators", type=int, default=120, help="Número de árboles en RandomForest")
    parser.add_argument("--test-size", type=float, default=0.2, help="Proporción de test split (default 0.2)")
    args = parser.parse_args()

    train_and_export(
        data_path=args.data_path,
        output_dir=args.output_dir,
        n_estimators=args.n_estimators,
        test_size=args.test_size
    )
