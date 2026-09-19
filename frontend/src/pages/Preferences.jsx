import { useNavigate } from 'react-router-dom'
import { usePantry } from '../context/PantryContext'
import PreferenceCard from '../components/PreferenceCard'
import MealTypeCard from '../components/MealTypeCard'
import { DIET_OPTIONS, MEAL_TYPE_OPTIONS } from '../data/quickAddIngredients'

export default function Preferences() {
  const navigate = useNavigate()
  const { diet, setDiet, mealType, setMealType } = usePantry()

  const canContinue = Boolean(diet && mealType)

  return (
    <div className="page">
      <h1 style={styles.heading}>First, tell us about you</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionLabel}>Dietary preference</h2>
        <div style={styles.dietGrid}>
          {DIET_OPTIONS.map((opt) => (
            <PreferenceCard
              key={opt.value}
              emoji={opt.emoji}
              label={opt.label}
              active={diet === opt.value}
              onClick={() => setDiet(opt.value)}
            />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionLabel}>Meal type</h2>
        <div style={styles.mealGrid}>
          {MEAL_TYPE_OPTIONS.map((opt) => (
            <MealTypeCard
              key={opt.value}
              emoji={opt.emoji}
              label={opt.label}
              active={mealType === opt.value}
              onClick={() => setMealType(opt.value)}
            />
          ))}
        </div>
      </section>

      <button
        type="button"
        className="btn-primary"
        style={styles.continueBtn}
        disabled={!canContinue}
        onClick={() => navigate('/pantry')}
      >
        Continue →
      </button>
    </div>
  )
}

const styles = {
  heading: {
    fontSize: '2rem',
    textAlign: 'center',
    margin: '48px 0 40px',
  },
  section: {
    marginBottom: 40,
  },
  sectionLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--charcoal-soft)',
    marginBottom: 16,
  },
  dietGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 16,
  },
  mealGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 14,
  },
  continueBtn: {
    display: 'block',
    margin: '48px auto 0',
    fontSize: '1rem',
    padding: '15px 40px',
  },
}
