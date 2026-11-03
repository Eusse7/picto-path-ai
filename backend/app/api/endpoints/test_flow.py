from typing import List
from fastapi import APIRouter, Depends
from app.schemas.test_schema import (
    VisualQuestion,
    TestSubmissionRequest,
    TestResultResponse,
    MBTIPredictionRequest,
    MBTIPredictionResponse
)
from app.services.mock_service import get_mock_questions, generate_mock_results
from app.services.model_inference import inference_service
from app.schemas.game_schema import AssessmentSubmission, AssessmentResponse
from app.services.assessment_service import assessment_service

router = APIRouter()

@router.post("/sessions", summary="Crear sesión para acumular resultados de minijuegos")
def create_assessment_session():
    return {"session_id": assessment_service.create_session()}


@router.post("/submit-results", response_model=AssessmentResponse, summary="Reunir juegos y ejecutar inferencia MBTI")
def submit_assessment(submission: AssessmentSubmission):
    session_id, scores, prediction = assessment_service.predict(submission)
    return AssessmentResponse(
        session_id=session_id,
        scores={key: scores[key] for key in ("introversion", "sensing", "thinking", "judging")},
        predicted_mbti=prediction["predicted_mbti"],
        personality_name=prediction["personality_name"],
        confidence=prediction.get("confidence"),
        source=prediction["source"],
    )

MBTI_TITLES = {
    "ISTJ": "El Inspector / Logista",
    "ISFJ": "El Defensor / Protector",
    "INFJ": "El Consejero / Abogado",
    "INTJ": "El Arquitecto / Estratega",
    "ISTP": "El Virtuoso / Artesano",
    "ISFP": "El Aventurero / Artista",
    "INFP": "El Mediador / Soñador",
    "INTP": "El Lógico / Pensador",
    "ESTP": "El Emprendedor / Dinámico",
    "ESFP": "El Animador / Espontáneo",
    "ENFP": "El Activista / Campeón",
    "ENTP": "El Innovador / Polemista",
    "ESTJ": "El Ejecutivo / Organizador",
    "ESFJ": "El Cónsul / Colaborador",
    "ENFJ": "El Protagonista / Líder",
    "ENTJ": "El Comandante / Director"
}

@router.get("/questions", response_model=List[VisualQuestion], summary="Obtener preguntas visuales del test")
def get_questions():
    """Retorna el conjunto de estímulos visuales para que el frontend renderice las preguntas."""
    return get_mock_questions()

@router.post("/submit", response_model=TestResultResponse, summary="Enviar respuestas y calcular perfil vocacional")
def submit_test(submission: TestSubmissionRequest):
    """
    Recibe las elecciones de estímulos del usuario y calcula las carreras recomendadas.
    """
    return generate_mock_results(submission)

@router.post("/predict-mbti", response_model=MBTIPredictionResponse, summary="Predecir personalidad MBTI con el modelo de ML")
def predict_mbti(req: MBTIPredictionRequest):
    """
    Ejecuta inferencia directa con el RandomForestClassifier entrenado sobre el dataset de 43,744 muestras.
    """
    features = {
        'Age': req.age,
        'Gender': req.gender,
        'Education': req.education,
        'Introversion Score': req.introversion_score,
        'Sensing Score': req.sensing_score,
        'Thinking Score': req.thinking_score,
        'Judging Score': req.judging_score,
        'Interest': req.interest
    }

    prediction = inference_service.predict(features)
    if prediction:
        mbti_code = str(prediction)
        return MBTIPredictionResponse(
            predicted_mbti=mbti_code,
            personality_name=MBTI_TITLES.get(mbti_code, "Personalidad MBTI"),
            source="RandomForestClassifier (modelo_rf.pkl)"
        )
    else:
        # Fallback analítico si no hay archivo de modelo
        e_or_i = "E" if req.introversion_score >= 5.0 else "I"
        s_or_n = "S" if req.sensing_score >= 5.0 else "N"
        t_or_f = "T" if req.thinking_score >= 5.0 else "F"
        j_or_p = "J" if req.judging_score >= 5.0 else "P"
        code = f"{e_or_i}{s_or_n}{t_or_f}{j_or_p}"
        return MBTIPredictionResponse(
            predicted_mbti=code,
            personality_name=MBTI_TITLES.get(code, "Personalidad MBTI"),
            source="Fallback analítico de puntuación continua"
        )
