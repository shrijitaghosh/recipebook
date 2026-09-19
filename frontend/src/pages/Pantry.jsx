import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePantry } from '../context/PantryContext'
import QuickAddIngredient from '../components/QuickAddIngredient'
import IngredientChip from '../components/IngredientChip'
import { QUICK_ADD_INGREDIENTS } from '../data/quickAddIngredients'

export default function Pantry() {
  const navigate = useNavigate()
  const {
    diet,
    mealType,
    ingredients,
    addIngredient,
    removeIngredient,
    onlyTheseIngredients,
    setOnlyTheseIngredients,
  } = usePantry()
  const [manualInput, setManualInput] = useState('')

  useEffect(() => {
    if (!diet || !mealType) {
      navigate('/preferences', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diet, mealType])

  const selectedLower = new Set(ingredients.map((i) => i.toLowerCase()))

  const handleQuickAddClick = (name) => {
    if (selectedLower.has(name.toLowerCase())) {
      removeIngredient(
        ingredients.find((i) => i.toLowerCase() === name.toLowerCase())
      )
    } else {
      addIngredient(name)
    }
  }

  const handleManualAdd = () => {
    if (!manualInput.trim()) return
    addIngredient(manualInput)
    setManualInput('')
  }

  const handleManualKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleManualAdd()
    }
  }

  const canFindRecipes = ingredients.length > 0

  return (
    <div className="page">
      <h1 style={styles.heading}>What&rsquo;s in your kitchen?</h1>
      <p style={styles.subtitle}>
        Add everything you have available. We&rsquo;ll handle the matching.
      </p>

      {ingredients.length > 0 && (
        <section style={styles.selectedSection}>
          <div style={styles.chipRow}>
            {ingredients.map((ing) => (
              <IngredientChip
                key={ing}
                name={ing}
                onRemove={() => removeIngredient(ing)}
              />
            ))}
          </div>
        </section>
      )}

      <section style={styles.section}>
        <h2 style={styles.sectionLabel}>Quick Add</h2>
        <div style={styles.quickGrid}>
          {QUICK_ADD_INGREDIENTS.map((item) => (
            <QuickAddIngredient
              key={item.name}
              emoji={item.emoji}
              name={item.name}
              selected={selectedLower.has(item.name.toLowerCase())}
              onClick={() => handleQuickAddClick(item.name)}
            />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionLabel}>Can&rsquo;t find something? Add it manually</h2>
        <div style={styles.manualRow}>
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={handleManualKeyDown}
            placeholder="Type an ingredient..."
            style={styles.manualInput}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleManualAdd}
            disabled={!manualInput.trim()}
          >
            + Add
          </button>
        </div>
      </section>

      <section style={styles.toggleSection}>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={onlyTheseIngredients}
            onChange={(e) => setOnlyTheseIngredients(e.target.checked)}
            style={styles.toggleCheckbox}
          />
          <span>I have only these ingredients</span>
        </label>
      </section>

      <button
        type="button"
        className="btn-primary"
        style={styles.findBtn}
        disabled={!canFindRecipes}
        onClick={() => navigate('/discover')}
      >
        ✨ Find My Recipes
      </button>
      {!canFindRecipes && (
        <p style={styles.hint}>Add at least one ingredient to continue.</p>
      )}
    </div>
  )
}

const styles = {
  heading: {
    fontSize: '2rem',
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--charcoal-soft)',
    marginBottom: 32,
  },
  selectedSection: {
    marginBottom: 32,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontFamily: 'var(--font-ui)',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--charcoal-soft)',
    marginBottom: 16,
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
    gap: 10,
  },
  manualRow: {
    display: 'flex',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    padding: '13px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-ui)',
    background: 'var(--white)',
    color: 'var(--charcoal)',
  },
  toggleSection: {
    marginBottom: 36,
    padding: '16px 20px',
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  toggleCheckbox: {
    width: 18,
    height: 18,
    accentColor: 'var(--green)',
    cursor: 'pointer',
  },
  findBtn: {
    display: 'block',
    margin: '0 auto',
    fontSize: '1.05rem',
    padding: '16px 40px',
    width: '100%',
    maxWidth: 360,
  },
  hint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: '0.85rem',
    color: 'var(--charcoal-soft)',
  },
}
