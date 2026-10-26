from typing import List
from fastapi import APIRouter, Depends
from app.schemas.test_schema import VisualQuestion, TestSubmissionRequest, TestResultResponse
from app.services.mock_service import get_mock_questions, generate_mock_results

router = APIRouter()

@router.get("/questions", response_model=List[VisualQuestion], summary="Obtener preguntas visuales del test")
def get_questions():
    """
    Retorna el conjunto de estímulos visuales para que el frontend renderice las preguntas.
    """
    return get_mock_questions()

@router.post("/submit", response_model=TestResultResponse, summary="Enviar respuestas y calcular perfil vocacional")
def submit_test(submission: TestSubmissionRequest):
    """
    Recibe las elecciones de estímulos del usuario y calcula las carreras recomendadas.
    En la fase inicial devuelve datos simulados (mocks) para no bloquear al frontend.
    Posteriormente, invoca el modelo entrenado y consultas a ChromaDB/Neo4j.
    """
    return generate_mock_results(submission)
