export default function IngredientChip({ name, onRemove }) {
  return (
    <span className="chip" style={styles.chip}>
      {name}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        style={styles.removeBtn}
      >
        ×
      </button>
    </span>
  )
}

const styles = {
  chip: {
    background: 'var(--terracotta-light)',
    borderColor: 'var(--terracotta)',
    color: 'var(--terracotta-dark)',
    paddingRight: 8,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--terracotta-dark)',
    fontSize: '1.1rem',
    lineHeight: 1,
    padding: '0 2px',
    fontWeight: 700,
  },
}
