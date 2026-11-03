import os
try:
    import joblib
except ImportError:
    joblib = None
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
        if target_path and joblib is not None:
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
        result = self.predict_with_metadata(features)
        return result["predicted_mbti"] if result else None

    def predict_with_metadata(self, features):
        if self.model is None:
            return None

        try:
            frame = self._to_frame(features)
            prediction = str(self.model.predict(frame)[0])
            confidence = None
            if hasattr(self.model, "predict_proba"):
                probabilities = self.model.predict_proba(frame)[0]
                confidence = round(float(max(probabilities)), 4)
            return {
                "predicted_mbti": prediction,
                "confidence": confidence,
                "source": "RandomForestClassifier (modelo_rf.pkl)",
            }
        except (ValueError, TypeError, KeyError) as error:
            print(f"[Error] Fallo de validación en inferencia: {error}")
            return None

    def _to_frame(self, features):
        if isinstance(features, dict):
            return pd.DataFrame([features])
        if isinstance(features, pd.DataFrame):
            return features
        columns = ['Age', 'Education', 'Introversion Score', 'Sensing Score', 'Thinking Score', 'Judging Score', 'Gender', 'Interest']
        if isinstance(features, (list, tuple)) and len(features) == len(columns):
            return pd.DataFrame([features], columns=columns)
        return pd.DataFrame([features])

inference_service = ModelInferenceService()
