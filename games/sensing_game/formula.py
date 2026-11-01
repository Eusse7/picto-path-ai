"""
Módulo de Cálculo Psicométrico: Sensing Score
=============================================
Implementa la función matemática que mapea el desempeño en el minijuego visual
("Encuentra las 5 Diferencias") a una escala continua de 0.0 a 10.0.

Fórmula:
    S = max(0, min(10, (A * 2) - (E * alpha) - beta * max(0, t - t_ideal)))
"""

from typing import Dict, Any

def calculate_sensing_score(
    hits: int,
    errors: int,
    time_seconds: float,
    ideal_time: float = 4.0,
    alpha: float = 0.5,
    beta: float = 0.45
) -> Dict[str, Any]:
    """
    Calcula el Sensing Score (0.0 a 10.0) a partir del desempeño en el test visual.
    
    Parámetros:
        hits: Cantidad de diferencias detectadas (0 a 5). Cada acierto suma 2.0 puntos base.
        errors: Clics fallidos en zonas sin diferencias. Cada error resta alpha puntos (0.5 pts).
        time_seconds: Tiempo total transcurrido en segundos.
        ideal_time: Umbral de tiempo ideal (4.0s). Después de este umbral se penaliza la demora.
        alpha: Factor de penalización por error (0.5 pts por fallo).
        beta: Factor de penalización continua por demora (0.45 pts por segundo extra).
    
    Retorna:
        Diccionario con el puntaje acotado, métricas detalladas y etiqueta de perfil.
    """
    hits_clamped = max(0, min(5, hits))
    errors_clamped = max(0, errors)
    time_clamped = max(0.0, time_seconds)

    base_points = hits_clamped * 2.0
    error_penalty = errors_clamped * alpha
    delay_time = max(0.0, time_clamped - ideal_time)
    time_penalty = beta * delay_time

    raw_score = base_points - error_penalty - time_penalty
    clamped_score = max(0.0, min(10.0, raw_score))
    rounded_score = round(clamped_score, 2)

    is_sensing = rounded_score >= 5.0
    time_loss_pct = round((time_penalty / max(0.1, base_points)) * 100, 1)

    profile_label = (
        "Percepción Sensorial Concreta (Sensing - S)" 
        if is_sensing 
        else "Percepción Intuitiva / Conceptual (Intuition - N)"
    )
    
    summary = (
        f"Aciertos: {hits_clamped}/5 (+{base_points:.1f} pts) | "
        f"Errores: {errors_clamped} (-{error_penalty:.2f} pts) | "
        f"Demora: {delay_time:.1f}s extra (-{time_penalty:.2f} pts) | "
        f"Score Final: {rounded_score}/10.0"
    )

    return {
        "sensing_score": rounded_score,
        "is_sensing_dominant": is_sensing,
        "profile_label": profile_label,
        "metrics": {
            "hits": hits_clamped,
            "errors": errors_clamped,
            "time_seconds": round(time_clamped, 2),
            "ideal_time_seconds": ideal_time,
            "delay_seconds": round(delay_time, 2),
            "base_points": base_points,
            "error_penalty": round(error_penalty, 2),
            "time_penalty": round(time_penalty, 2),
            "time_loss_percentage": time_loss_pct
        },
        "summary": summary
    }

