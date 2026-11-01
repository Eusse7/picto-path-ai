"""
Módulo de Clasificación MBTI & Decodificación Dimensional
=========================================================
Mapea los 4 puntajes continuos (Introversion, Sensing, Thinking, Judging)
a los 16 perfiles MBTI y desglosa los 4 ejes psicológicos.
"""

from typing import Dict, Any

MBTI_NAMES = {
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

def predict_mbti_personality(
    age: float,
    gender: str,
    education: int,
    interest: str,
    introversion_score: float,
    sensing_score: float,
    thinking_score: float,
    judging_score: float
) -> Dict[str, Any]:
    """
    Predice el tipo de personalidad MBTI analizando los 4 ejes cognitivos
    e integrando el contexto demográfico del usuario.
    """
    e_or_i = "E" if introversion_score >= 5.0 else "I"
    s_or_n = "S" if sensing_score >= 5.0 else "N"
    t_or_f = "T" if thinking_score >= 5.0 else "F"
    j_or_p = "J" if judging_score >= 5.0 else "P"

    predicted_type = f"{e_or_i}{s_or_n}{t_or_f}{j_or_p}"
    personality_title = MBTI_NAMES.get(predicted_type, "Personalidad MBTI")

    dimensions = {
        "energy": {
            "axis": "E vs I",
            "letter": e_or_i,
            "trait": "Extroversión" if e_or_i == "E" else "Introversión",
            "score": round(introversion_score, 2),
            "scale_info": "Mayor puntaje indica tendencia hacia Extroversión"
        },
        "perception": {
            "axis": "S vs N",
            "letter": s_or_n,
            "trait": "Sensorial (Sensing)" if s_or_n == "S" else "Intuición (Intuition)",
            "score": round(sensing_score, 2),
            "scale_info": "Mayor puntaje indica preferencia Sensorial concreta"
        },
        "judgment": {
            "axis": "T vs F",
            "letter": t_or_f,
            "trait": "Pensamiento (Thinking)" if t_or_f == "T" else "Sentimiento (Feeling)",
            "score": round(thinking_score, 2),
            "scale_info": "Mayor puntaje indica preferencia analítica / Thinking"
        },
        "lifestyle": {
            "axis": "J vs P",
            "letter": j_or_p,
            "trait": "Juicio (Judging)" if j_or_p == "J" else "Percepción (Perceiving)",
            "score": round(judging_score, 2),
            "scale_info": "Mayor puntaje indica preferencia por estructura / Judging"
        }
    }

    return {
        "predicted_personality": predicted_type,
        "personality_name": personality_title,
        "personality_description": (
            f"Perfil cognitivo caracterizado por preferencia {dimensions['perception']['trait']} "
            f"con estilo de juicio {dimensions['judgment']['trait']} y orientación {dimensions['energy']['trait']}."
        ),
        "dimensions": dimensions,
        "demographics": {
            "age": age,
            "gender": gender,
            "education": education,
            "interest": interest
        }
    }

