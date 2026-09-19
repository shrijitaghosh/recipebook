import { SORT_OPTIONS } from '../data/quickAddIngredients'

export default function FilterBar({ sortBy, onChange }) {
  return (
    <div style={styles.bar} role="group" aria-label="Sort recipes">
      {SORT_OPTIONS.map((opt) => {
        const active = sortBy === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            style={{
              ...styles.option,
              ...(active ? styles.optionActive : {}),
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

const styles = {
  bar: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  option: {
    background: 'var(--white)',
    border: '1.5px solid var(--border)',
    borderRadius: 999,
    padding: '8px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--charcoal-soft)',
    transition: 'border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease',
  },
  optionActive: {
    background: 'var(--charcoal)',
    borderColor: 'var(--charcoal)',
    color: 'var(--white)',
  },
}
