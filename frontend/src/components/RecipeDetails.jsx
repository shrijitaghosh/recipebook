import { useState } from 'react'

export default function RecipeDetails({ recipe }) {
  const [checked, setChecked] = useState({})

  const missingSet = new Set(
    (recipe.missing_ingredients || []).map((m) => m.toLowerCase())
  )

  const toggle = (name) => {
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div>
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Ingredients</h3>
        <ul style={styles.ingredientList}>
          {recipe.ingredients.map((ing) => {
            const isMissing = missingSet.has(ing.name.toLowerCase())
            return (
              <li key={ing.name} style={styles.ingredientRow}>
                <label style={styles.ingredientLabel}>
                  <input
                    type="checkbox"
                    checked={!!checked[ing.name]}
                    onChange={() => toggle(ing.name)}
                    style={styles.checkbox}
                  />
                  <span
                    style={{
                      ...styles.ingredientName,
                      textDecoration: checked[ing.name] ? 'line-through' : 'none',
                      opacity: checked[ing.name] ? 0.5 : 1,
                    }}
                  >
                    {ing.name}
                    {ing.quantity ? (
                      <span style={styles.quantity}> — {ing.quantity}</span>
                    ) : null}
                  </span>
                </label>
                {isMissing && <span style={styles.missingTag}>Missing</span>}
              </li>
            )
          })}
        </ul>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Instructions</h3>
        <ol style={styles.stepList}>
          {recipe.instructions.map((step, idx) => (
            <li key={idx} style={styles.stepRow}>
              <span style={styles.stepNumber}>{idx + 1}</span>
              <p style={styles.stepText}>{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

const styles = {
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: '1.4rem',
    marginBottom: 16,
  },
  ingredientList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  ingredientRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
  },
  ingredientLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    accentColor: 'var(--green)',
    cursor: 'pointer',
  },
  ingredientName: {
    fontSize: '0.95rem',
    color: 'var(--charcoal)',
  },
  quantity: {
    color: 'var(--charcoal-soft)',
    fontSize: '0.875rem',
  },
  missingTag: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--terracotta-dark)',
    background: 'var(--terracotta-light)',
    padding: '3px 10px',
    borderRadius: 999,
  },
  stepList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  stepRow: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--terracotta)',
    minWidth: 36,
    lineHeight: 1,
  },
  stepText: {
    fontSize: '0.975rem',
    color: 'var(--charcoal)',
    paddingTop: 4,
    lineHeight: 1.6,
  },
}
