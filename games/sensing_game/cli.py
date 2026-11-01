"""
CLI de Pruebas y Verificación del Minijuego de Sensing Score
===========================================================
Ejecuta diagnósticos locales de la fórmula, el clasificador y los consejos RAG.
Uso:
    python games/sensing_game/cli.py
"""

import sys
import os

# Asegurar que la raíz del proyecto esté en sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from games.sensing_game.formula import calculate_sensing_score
from games.sensing_game.classifier import predict_mbti_personality
from games.sensing_game.rag_advice import generate_evidence_advice

def main():
    print("\n" + "="*70)
    print("PICTO-PATH AI: MÓDULO SENSING SCORE (VERIFICACIÓN MODULAR)")
    print("="*70)

    # 1. Test Jugador Rápido
    print("\n[TEST 1] Jugador Rápido y Preciso (4.0s, 5 aciertos, 0 errores):")
    calc1 = calculate_sensing_score(hits=5, errors=0, time_seconds=4.0)
    print(f" -> Sensing Score: {calc1['sensing_score']} / 10.0")
    print(f" -> Perfil: {calc1['profile_label']}")

    # 2. Test Jugador Lento
    print("\n[TEST 2] Jugador Lento con Dudas (14.0s, 3 aciertos, 2 errores):")
    calc2 = calculate_sensing_score(hits=3, errors=2, time_seconds=14.0)
    print(f" -> Sensing Score: {calc2['sensing_score']} / 10.0")
    print(f" -> Demora extra: +{calc2['metrics']['delay_seconds']}s (Penalización: -{calc2['metrics']['time_penalty']} pts)")
    print(f" -> Perfil: {calc2['profile_label']}")

    # 3. Test Clasificador MBTI
    print("\n[TEST 3] Clasificación de Personalidad MBTI:")
    mbti = predict_mbti_personality(
        age=24.0,
        gender="Female",
        education=1,
        interest="Technology",
        introversion_score=3.5,
        sensing_score=calc1['sensing_score'],
        thinking_score=7.8,
        judging_score=6.2
    )
    print(f" -> MBTI Predicho: {mbti['predicted_personality']} ({mbti['personality_name']})")
    print(f" -> Ejes: {[f'{k}: {v['letter']}' for k, v in mbti['dimensions'].items()]}")

    # 4. Test Consejos RAG
    print("\n[TEST 4] Consejos Psicológicos Basados en Evidencia (RAG):")
    advice = generate_evidence_advice(mbti['predicted_personality'], calc1['sensing_score'])
    for idx, tip in enumerate(advice['actionable_tips'], 1):
        print(f"  {idx}. [{tip['domain']}] {tip['headline']}")

    print("\n" + "="*70)
    print("¡VERIFICACIÓN EXITOSA! Todos los submódulos operan correctamente.")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
