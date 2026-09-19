import { useNavigate } from 'react-router-dom'
import MatchBadge from './MatchBadge'

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate()

  return (
    <div className="card" style={styles.card}>
      <div style={styles.top}>
        <span style={styles.emoji}>{recipe.emoji}</span>
        <MatchBadge percent={recipe.pantry_match} />
      </div>

      <h3 style={styles.title}>{recipe.name}</h3>
      <p style={styles.meta}>
        {recipe.calories} kcal · {recipe.time_minutes} min · {recipe.servings}{' '}
        {recipe.servings === 1 ? 'serving' : 'servings'}
      </p>

      {recipe.available_ingredients.length > 0 && (
        <p style={styles.haveLine}>
          <span style={styles.haveLabel}>You have: </span>
          {recipe.available_ingredients.join(' · ')}
        </p>
      )}

      {recipe.missing_ingredients.length > 0 && (
        <p style={styles.missingLine}>
          <span style={styles.missingLabel}>Missing: </span>
          {recipe.missing_ingredients.join(' · ')}
        </p>
      )}

      <button
        type="button"
        className="btn-primary"
        style={styles.viewBtn}
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        View Recipe →
      </button>
    </div>
  )
}

const styles = {
  card: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'box-shadow 0.15s ease, transform 0.1s ease',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  emoji: {
    fontSize: '2rem',
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: 2,
  },
  meta: {
    fontSize: '0.875rem',
    color: 'var(--charcoal-soft)',
  },
  haveLine: {
    fontSize: '0.825rem',
    color: 'var(--charcoal-soft)',
  },
  haveLabel: {
    fontWeight: 600,
    color: 'var(--green)',
  },
  missingLine: {
    fontSize: '0.825rem',
    color: 'var(--charcoal-soft)',
  },
  missingLabel: {
    fontWeight: 600,
    color: 'var(--terracotta-dark)',
  },
  viewBtn: {
    marginTop: 10,
    width: '100%',
    padding: '11px 20px',
    fontSize: '0.9rem',
  },
}
