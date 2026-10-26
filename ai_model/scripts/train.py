"""
Script base de entrenamiento y exportación del modelo de clasificación vocacional.
"""
import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def train_and_export():
    output_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(output_dir, exist_ok=True)
    model_path = os.path.join(output_dir, "modelo_rf.pkl")

    print("[*] Generando datos de entrenamiento sintéticos/preliminares...")
    # X: vector de características de elecciones visuales (ejemplo 10 dimensiones)
    # y: clases de perfiles vocacionales (ejemplo 4 perfiles)
    np.random.seed(42)
    X_train = np.random.rand(100, 10)
    y_train = np.random.choice(["Tecnologico", "Creativo", "Social", "Empresarial"], size=100)

    print("[*] Entrenando modelo RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X_train, y_train)

    print(f"[*] Exportando modelo a {model_path}...")
    joblib.dump(clf, model_path)
    print("[✓] Modelo exportado correctamente.")

if __name__ == "__main__":
    train_and_export()
