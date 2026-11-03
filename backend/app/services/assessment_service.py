from uuid import uuid4

from fastapi import HTTPException, status

from app.schemas.game_schema import AssessmentSubmission, GameResultSubmission
from app.services.model_inference import inference_service


GAME_SCORE_KEYS = {
    "introversion": "Introversion Score",
    "sensing": "Sensing Score",
    "thinking": "Thinking Score",
    "judging": "Judging Score",
}

MBTI_NAMES = {
    "ISTJ": "El Inspector / Logista", "ISFJ": "El Defensor / Protector",
    "INFJ": "El Consejero / Abogado", "INTJ": "El Arquitecto / Estratega",
    "ISTP": "El Virtuoso / Artesano", "ISFP": "El Aventurero / Artista",
    "INFP": "El Mediador / Soñador", "INTP": "El Lógico / Pensador",
    "ESTP": "El Emprendedor / Dinámico", "ESFP": "El Animador / Espontáneo",
    "ENFP": "El Activista / Campeón", "ENTP": "El Innovador / Polemista",
    "ESTJ": "El Ejecutivo / Organizador", "ESFJ": "El Cónsul / Colaborador",
    "ENFJ": "El Protagonista / Líder", "ENTJ": "El Comandante / Director",
}


class AssessmentService:
    """Orquesta resultados de minijuegos e inferencia para una evaluación."""

    def __init__(self) -> None:
        self._sessions: dict[str, dict] = {}

    def create_session(self) -> str:
        session_id = str(uuid4())
        self._sessions[session_id] = {"results": {}, "raw_results": {}}
        return session_id

    def save_game_result(self, session_id: str, result: GameResultSubmission) -> float:
        session = self._sessions.get(session_id)
        if session is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sesión de evaluación no encontrada")

        session["results"][result.game_id] = result.score
        session["raw_results"][result.game_id] = {
            "score": result.score,
            "metrics": result.metrics,
            "answers": result.answers,
        }
        return result.score

    def predict(self, submission: AssessmentSubmission) -> tuple[str, dict[str, float], dict]:
        session_id = submission.session_id or self.create_session()
        if session_id not in self._sessions:
            self._sessions[session_id] = {"results": {}, "raw_results": {}}

        for result in submission.game_results:
            self.save_game_result(session_id, result)

        scores = dict(self._sessions[session_id]["results"])
        scores.update({key: value for key, value in submission.scores.items()})
        missing = [game_id for game_id in GAME_SCORE_KEYS if game_id not in scores]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"message": "Faltan resultados de minijuegos", "missing_games": missing},
            )

        features = {
            "Age": submission.age,
            "Gender": submission.gender,
            "Education": submission.education,
            "Introversion Score": scores["introversion"],
            "Sensing Score": scores["sensing"],
            "Thinking Score": scores["thinking"],
            "Judging Score": scores["judging"],
            "Interest": submission.interest,
        }
        prediction = inference_service.predict_with_metadata(features)
        if prediction is None:
            code = "".join([
                "E" if scores["introversion"] >= 5 else "I",
                "S" if scores["sensing"] >= 5 else "N",
                "T" if scores["thinking"] >= 5 else "F",
                "J" if scores["judging"] >= 5 else "P",
            ])
            prediction = {
                "predicted_mbti": code,
                "personality_name": MBTI_NAMES.get(code, "Personalidad MBTI"),
                "confidence": None,
                "source": "Fallback analítico de puntuación continua",
            }
        else:
            prediction["personality_name"] = MBTI_NAMES.get(
                prediction["predicted_mbti"], "Personalidad MBTI"
            )
        self._sessions[session_id]["profile"] = {
            "age": submission.age,
            "gender": submission.gender,
            "education": submission.education,
            "interest": submission.interest,
        }
        self._sessions[session_id]["prediction"] = prediction
        return session_id, scores, prediction


assessment_service = AssessmentService()
