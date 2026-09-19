export default function MealTypeCard({ emoji, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        ...styles.card,
        ...(active ? styles.cardActive : {}),
      }}
    >
      <span style={styles.emoji}>{emoji}</span>
      <span style={styles.label}>{label}</span>
    </button>
  )
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '18px 12px',
    background: 'var(--white)',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card)',
    transition: 'border-color 0.15s ease, background-color 0.15s ease',
  },
  cardActive: {
    borderColor: 'var(--green)',
    background: 'var(--green-light)',
  },
  emoji: {
    fontSize: '1.6rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--charcoal)',
  },
}
