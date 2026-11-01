import os
import joblib
import pandas as pd
from app.core.config import settings

class ModelInferenceService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _resolve_model_path(self):
        if os.path.exists(settings.MODEL_PATH):
            return settings.MODEL_PATH
        # Fallback para desarrollo local fuera del contenedor Docker
        local_dev_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "ai_model", "models", "modelo_rf.pkl")
        )
        if os.path.exists(local_dev_path):
            return local_dev_path
        return None

    def _load_model(self):
        """Carga el modelo exportado desde ai_model/models."""
        target_path = self._resolve_model_path()
        if target_path:
            try:
                self.model = joblib.load(target_path)
                print(f"[Info] Modelo cargado exitosamente desde {target_path}")
            except Exception as e:
                print(f"[Error] Falló la carga del modelo en {target_path}: {e}")
        else:
            print(f"[Aviso] Archivo de modelo no encontrado en {settings.MODEL_PATH}. Usando modo fallback/mock.")

    def predict(self, features):
        """
        Ejecuta inferencia recibiendo:
        - dict con las características del usuario (Age, Gender, Education, Scores, Interest)
        - pd.DataFrame de 1 fila
        - lista/array
        Devuelve la clase predicha (ej. 'ENTP', 'INTJ') o None si no hay modelo disponible.
        """
        if self.model is None:
            return None

        try:
            if isinstance(features, dict):
                df = pd.DataFrame([features])
                return self.model.predict(df)[0]
            elif isinstance(features, pd.DataFrame):
                return self.model.predict(features)[0]
            elif isinstance(features, (list, tuple)):
                cols = ['Age', 'Education', 'Introversion Score', 'Sensing Score', 'Thinking Score', 'Judging Score', 'Gender', 'Interest']
                if len(features) == len(cols):
                    df = pd.DataFrame([features], columns=cols)
                    return self.model.predict(df)[0]
                return self.model.predict([features])[0]
            else:
                return self.model.predict([features])[0]
        except Exception as e:
            print(f"[Error] Fallo en inferencia del modelo: {e}")
            return None

inference_service = ModelInferenceService()
