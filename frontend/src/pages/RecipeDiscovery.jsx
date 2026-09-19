import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePantry } from '../context/PantryContext'
import { fetchRecommendations, ApiError } from '../api/client'
import RecipeCard from '../components/RecipeCard'
import FilterBar from '../components/FilterBar'
import { DIET_OPTIONS, MEAL_TYPE_OPTIONS } from '../data/quickAddIngredients'

export default function RecipeDiscovery() {
  const navigate = useNavigate()
  const { diet, mealType, ingredients, onlyTheseIngredients } = usePantry()

  const [sortBy, setSortBy] = useState('best_match')
  const [recipes, setRecipes] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!diet || !mealType || ingredients.length === 0) {
      navigate('/preferences', { replace: true })
      return
    }
    loadRecipes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diet, mealType, ingredients, onlyTheseIngredients, sortBy])

  async function loadRecipes() {
    setStatus('loading')
    setErrorMessage('')
    try {
      const data = await fetchRecommendations({
        diet,
        mealType,
        ingredients,
        onlyTheseIngredients,
        sortBy,
      })
      setRecipes(data.recipes)
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not reach the kitchen. Check your connection and try again.'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  const dietLabel = DIET_OPTIONS.find((d) => d.value === diet)?.label
  const mealLabel = MEAL_TYPE_OPTIONS.find((m) => m.value === mealType)?.label

  return (
    <div className="page">
      <h1 style={styles.heading}>Here&rsquo;s what you can cook!</h1>

      <div style={styles.prefChips}>
        {dietLabel && <span className="chip">{dietLabel}</span>}
        {mealLabel && <span className="chip">{mealLabel}</span>}
        {ingredients.slice(0, 4).map((i) => (
          <span className="chip" key={i}>
            {i}
          </span>
        ))}
        {ingredients.length > 4 && (
          <span className="chip">+{ingredients.length - 4} more</span>
        )}
      </div>

      <div style={styles.filterRow}>
        <FilterBar sortBy={sortBy} onChange={setSortBy} />
      </div>

      {status === 'loading' && <LoadingState />}

      {status === 'error' && (
        <ErrorState message={errorMessage} onRetry={loadRecipes} />
      )}

      {status === 'success' && recipes.length === 0 && (
        <EmptyState onEditPantry={() => navigate('/pantry')} />
      )}

      {status === 'success' && recipes.length > 0 && (
        <>
          <div style={styles.grid}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <section style={styles.whySection}>
            <h2 style={styles.whyTitle}>Why these recipes?</h2>
            <p style={styles.whyBody}>
              RecipeBook prioritizes meals that use the ingredients you
              already have.
            </p>
          </section>
        </>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div style={styles.grid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card" style={styles.skeletonCard}>
          <div style={{ ...styles.skeletonBlock, width: 40, height: 40 }} />
          <div style={{ ...styles.skeletonBlock, width: '70%', height: 20 }} />
          <div style={{ ...styles.skeletonBlock, width: '50%', height: 14 }} />
          <div style={{ ...styles.skeletonBlock, width: '90%', height: 40, marginTop: 12 }} />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onEditPantry }) {
  return (
    <div style={styles.emptyState}>
      <span style={styles.emptyEmoji}>🍽️</span>
      <h2 style={styles.emptyTitle}>No recipes match yet</h2>
      <p style={styles.emptyBody}>
        Try adding a few more ingredients, or turn off &ldquo;I have only
        these ingredients&rdquo; to see recipes you&rsquo;re close to making.
      </p>
      <button type="button" className="btn-primary" onClick={onEditPantry}>
        Edit Pantry
      </button>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div style={styles.emptyState}>
      <span style={styles.emptyEmoji}>⚠️</span>
      <h2 style={styles.emptyTitle}>Couldn&rsquo;t load recipes</h2>
      <p style={styles.emptyBody}>{message}</p>
      <button type="button" className="btn-primary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}

const styles = {
  heading: {
    fontSize: '2rem',
    marginTop: 48,
    marginBottom: 16,
    textAlign: 'center',
  },
  prefChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 32,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  skeletonCard: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  skeletonBlock: {
    background: 'var(--cream-deep)',
    borderRadius: 8,
    animation: 'pulse 1.4s ease-in-out infinite',
  },
  whySection: {
    marginTop: 48,
    textAlign: 'center',
    padding: '32px 20px',
    background: 'var(--green-light)',
    borderRadius: 'var(--radius-md)',
  },
  whyTitle: {
    fontSize: '1.3rem',
    marginBottom: 8,
  },
  whyBody: {
    color: 'var(--charcoal-soft)',
    fontSize: '0.95rem',
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
