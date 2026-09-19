import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePantry } from '../context/PantryContext'
import { fetchRecipeDetail, ApiError } from '../api/client'
import MatchBadge from '../components/MatchBadge'
import RecipeDetails from '../components/RecipeDetails'

export default function RecipeDetailsPage() {
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const { ingredients } = usePantry()

  const [recipe, setRecipe] = useState(null)
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetchRecipeDetail(recipeId, ingredients)
      .then((data) => {
        if (cancelled) return
        setRecipe(data)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        const message =
          err instanceof ApiError
            ? err.message
            : 'Could not load this recipe. Check your connection and try again.'
        setErrorMessage(message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [recipeId, ingredients])

  if (status === 'loading') {
    return (
      <div className="page">
        <p style={styles.loadingText}>Loading recipe...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="page">
        <div style={styles.emptyState}>
          <span style={styles.emptyEmoji}>⚠️</span>
          <h2 style={styles.emptyTitle}>Recipe not found</h2>
          <p style={styles.emptyBody}>{errorMessage}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/discover')}
          >
            Back to Recipes
          </button>
        </div>
      </div>
    )
  }

  const hasPantryMatch = recipe.pantry_match !== null && recipe.pantry_match !== undefined
  const matchMessage =
    recipe.pantry_match === 100
      ? 'You already have everything needed!'
      : recipe.missing_ingredients.length > 0
      ? `You're missing ${recipe.missing_ingredients.length} ingredient${
          recipe.missing_ingredients.length > 1 ? 's' : ''
        }.`
      : null

  return (
    <div className="page">
      <div style={styles.hero}>
        <span style={styles.heroEmoji}>{recipe.emoji}</span>
        <h1 style={styles.title}>{recipe.name}</h1>

        <div style={styles.metaRow}>
          <span className="chip">{recipe.calories} kcal</span>
          <span className="chip">{recipe.time_minutes} min</span>
          <span className="chip">
            {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
          </span>
          <span className="chip">{recipe.diet}</span>
        </div>

        {hasPantryMatch && (
          <div style={styles.matchRow}>
            <MatchBadge percent={recipe.pantry_match} size="md" />
          </div>
        )}

        {matchMessage && (
          <p
            style={{
              ...styles.matchMessage,
              color:
                recipe.pantry_match === 100
                  ? 'var(--green)'
                  : 'var(--terracotta-dark)',
            }}
          >
            {matchMessage}
          </p>
        )}
      </div>

      <RecipeDetails recipe={recipe} />

      <button
        type="button"
        className="btn-secondary"
        style={styles.tryAnother}
        onClick={() => navigate('/discover')}
      >
        🔄 Try Another Recipe
      </button>
    </div>
  )
}

const styles = {
  loadingText: {
    textAlign: 'center',
    padding: '80px 0',
    color: 'var(--charcoal-soft)',
    fontSize: '1rem',
  },
  hero: {
    textAlign: 'center',
    paddingTop: 40,
  },
  heroEmoji: {
    fontSize: '3.5rem',
    display: 'block',
    marginBottom: 12,
  },
  title: {
    fontSize: '2rem',
    marginBottom: 18,
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  matchRow: {
    marginBottom: 10,
  },
  matchMessage: {
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  tryAnother: {
    display: 'block',
    margin: '48px auto 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 20px',
    maxWidth: 440,
    margin: '0 auto',
  },
  emptyEmoji: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: '1.4rem',
    marginBottom: 12,
  },
  emptyBody: {
    color: 'var(--charcoal-soft)',
    marginBottom: 24,
    lineHeight: 1.6,
  },
}
