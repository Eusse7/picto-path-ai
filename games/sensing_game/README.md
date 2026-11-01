# Minijuego 1: Percepción Sensorial (Sensing Game)

- **Eje evaluado:** Sensorial ($S$) vs Intuición ($N$).
- **Variable generada:** `Sensing Score` (rango $0.0$ a $10.0$).
- **Dinámica:** Juego de agilidad visual "Encuentra las 5 Diferencias" con cronómetro (15s límite, 4s tiempo ideal).
- **Fórmula Psicométrica:**
  $$\text{Sensing Score} = \max\Big(0, \min\big(10, (\text{aciertos} \times 2) - (\text{errores} \times 0.5) - 0.45 \times \max(0, \text{tiempo} - 4.0)\big)\Big)$$

## Archivos Incluidos
- `SensingMBTI_AllInOne.jsx`: Componente completo en React con los 4 escenarios gráficos.
- `sensing_all_in_one.html`: Build interactivo autónomo listo para abrir y jugar en el navegador.
- `sensing_mbti_all_in_one.py`: Motor psicométrico, router FastAPI y CLI interactivo.

