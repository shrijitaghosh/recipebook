// In dev (frontend and backend run as separate servers), set
// VITE_API_BASE_URL to the backend's URL, e.g. http://localhost:8000.
// In production, when FastAPI serves this build itself (see backend/main.py),
// leave it unset -- an empty base means requests go to the same origin the
// page was served from, which is exactly right for a single deployed service.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function parseErrorResponse(response) {
  try {
    const data = await response.json()
    if (data && data.message) return data.message
    if (data && data.detail && data.detail.message) return data.detail.message
  } catch {
    // fall through to generic message
  }
  return `Request failed with status ${response.status}`
}

export async function fetchRecommendations({
  diet,
  mealType,
  ingredients,
  onlyTheseIngredients,
  sortBy,
}) {
  const response = await fetch(`${API_BASE_URL}/api/recipes/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      diet,
      meal_type: mealType,
      ingredients,
      only_these_ingredients: onlyTheseIngredients,
      sort_by: sortBy,
    }),
  })

  if (!response.ok) {
    throw new ApiError(await parseErrorResponse(response), response.status)
  }

  return response.json()
}

export async function fetchRecipeDetail(recipeId, ingredients = []) {
  const params = new URLSearchParams()
  if (ingredients.length > 0) {
    params.set('ingredients', ingredients.join(','))
  }
  const query = params.toString() ? `?${params.toString()}` : ''

  const response = await fetch(
    `${API_BASE_URL}/api/recipes/${encodeURIComponent(recipeId)}${query}`
  )

  if (!response.ok) {
    throw new ApiError(await parseErrorResponse(response), response.status)
  }

  return response.json()
}

export { ApiError, API_BASE_URL }
