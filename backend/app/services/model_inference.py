import os
import joblib
from app.core.config import settings

class ModelInferenceService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """Carga el modelo exportado desde ai_model/models."""
        if os.path.exists(settings.MODEL_PATH):
            try:
                self.model = joblib.load(settings.MODEL_PATH)
                print(f"[Info] Modelo cargado exitosamente desde {settings.MODEL_PATH}")
            except Exception as e:
                print(f"[Error] Falló la carga del modelo en {settings.MODEL_PATH}: {e}")
        else:
            print(f"[Aviso] Archivo de modelo no encontrado en {settings.MODEL_PATH}. Usando modo fallback/mock.")

    def predict(self, feature_vector):
        """Ejecuta inferencia si el modelo está disponible; en caso contrario devuelve None."""
        if self.model is not None:
            return self.model.predict([feature_vector])[0]
        return None

inference_service = ModelInferenceService()
