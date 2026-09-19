export default function QuickAddIngredient({ emoji, name, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        ...styles.item,
        ...(selected ? styles.itemSelected : {}),
      }}
    >
      <span style={styles.emoji}>{emoji}</span>
      <span style={styles.name}>{name}</span>
    </button>
  )
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '14px 8px',
    background: 'var(--white)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    transition: 'border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease',
  },
  itemSelected: {
    borderColor: 'var(--green)',
    background: 'var(--green-light)',
  },
  emoji: {
    fontSize: '1.5rem',
  },
  name: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--charcoal)',
    textAlign: 'center',
  },
}
