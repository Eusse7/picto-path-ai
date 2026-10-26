/**
 * Cliente HTTP y funciones para interactuar con la API de FastAPI.
 * Durante los primeros días de desarrollo, se pueden alternar endpoints mock y reales.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function fetchVisualQuestions() {
  const response = await fetch(`${API_BASE_URL}/test/questions`);
  if (!response.ok) {
    throw new Error('Error al cargar preguntas de estímulo visual');
  }
  return response.json();
}

export async function submitTestResults(payload) {
  const response = await fetch(`${API_BASE_URL}/test/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Error al procesar el test vocacional');
  }
  return response.json();
}
