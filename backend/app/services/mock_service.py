from typing import List
from app.schemas.test_schema import (
    VisualQuestion,
    VisualOption,
    TestResultResponse,
    CareerRecommendation,
    TestSubmissionRequest
)

def get_mock_questions() -> List[VisualQuestion]:
    """Retorna preguntas con opciones de imágenes simuladas para desarrollo inicial."""
    return [
        VisualQuestion(
            id="stimulus-01",
            category="entorno_trabajo",
            title="¿En qué entorno te sentirías más inspirado?",
            options=[
                VisualOption(
                    option_id="opt-1a",
                    image_url="/gallery/workplace_tech_lab.jpg",
                    tag="investigacion_laboratorio"
                ),
                VisualOption(
                    option_id="opt-1b",
                    image_url="/gallery/workplace_outdoor_nature.jpg",
                    tag="campo_naturaleza"
                ),
                VisualOption(
                    option_id="opt-1c",
                    image_url="/gallery/workplace_creative_studio.jpg",
                    tag="estudio_creativo"
                )
            ]
        ),
        VisualQuestion(
            id="stimulus-02",
            category="estilo_resolucion",
            title="¿Qué tipo de problema prefieres abordar?",
            options=[
                VisualOption(
                    option_id="opt-2a",
                    image_url="/gallery/problem_data_patterns.jpg",
                    tag="logica_algoritmos"
                ),
                VisualOption(
                    option_id="opt-2b",
                    image_url="/gallery/problem_people_community.jpg",
                    tag="social_comunidad"
                )
            ]
        )
    ]

def generate_mock_results(submission: TestSubmissionRequest) -> TestResultResponse:
    """Genera una respuesta simulada con recomendaciones de carrera."""
    return TestResultResponse(
        user_id=submission.user_id or "anon_user",
        dominant_profile="Analítico-Creativo (Investigador Visual)",
        profile_description="Muestras fuerte inclinación hacia el pensamiento estructurado pero con alta apreciación por la síntesis visual y la resolución conceptual de problemas.",
        top_careers=[
            CareerRecommendation(
                career_name="Ingeniería de Software / IA",
                compatibility_score=0.92,
                description="Diseño y construcción de modelos y sistemas interactivos complejos.",
                related_skills=["Lógica", "Algoritmos", "Pensamiento Crítico"]
            ),
            CareerRecommendation(
                career_name="Diseño de Interacción (UX) & Human-Computer Interaction",
                compatibility_score=0.87,
                description="Unión de tecnología, investigación psicológica y experiencia visual.",
                related_skills=["Empatía de Usuario", "Prototipado", "Arquitectura de Información"]
            ),
            CareerRecommendation(
                career_name="Ciencia de Datos y Bioinformática",
                compatibility_score=0.81,
                description="Descubrimiento de patrones ocultos a partir de conjuntos de datos multidimensionales.",
                related_skills=["Estadística", "Visualización de Datos", "Metodología Científica"]
            )
        ],
        is_mock=True
    )
