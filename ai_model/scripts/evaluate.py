"""
Script de evaluación y generación de reporte de métricas del modelo entrenado.
"""
import os
import argparse
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from train import find_dataset, NUMERICAL_COLS, CATEGORICAL_COLS, TARGET_COL, evaluate_mbti_axes

def evaluate_model(model_path: str = None, data_path: str = None):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if not model_path:
        model_path = os.path.join(base_dir, "..", "models", "modelo_rf.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"No se encontró el modelo en: {model_path}. Entrena primero con train.py.")

    dataset_path = find_dataset(data_path)
    print(f"[*] Evaluando modelo: {model_path}")
    print(f"[*] Con dataset: {dataset_path}")

    model = joblib.load(model_path)
    df = pd.read_csv(dataset_path)

    X = df[NUMERICAL_COLS + CATEGORICAL_COLS]
    y_true = df[TARGET_COL]

    y_pred = model.predict(X)

    print("\n" + "="*70)
    print("INFORME DE CLASIFICACIÓN DETALLADO:")
    print("="*70)
    print(classification_report(y_true, y_pred, digits=4))

    print("\n" + "="*70)
    print("PRECISIÓN POR EJE MBTI:")
    print("="*70)
    axis_metrics = evaluate_mbti_axes(y_true, y_pred)
    for k, v in axis_metrics.items():
        print(f"  {v['axis']} ({v['name']}): {v['accuracy_pct']}")
    print("="*70 + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluar modelo exportado")
    parser.add_argument("--model-path", type=str, default=None, help="Ruta al modelo .pkl")
    parser.add_argument("--data-path", type=str, default=None, help="Ruta al dataset")
    args = parser.parse_args()
    evaluate_model(args.model_path, args.data_path)

