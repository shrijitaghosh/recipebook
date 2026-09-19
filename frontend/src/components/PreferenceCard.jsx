export default function PreferenceCard({ emoji, label, active, onClick }) {
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
    gap: 10,
    padding: '24px 16px',
    background: 'var(--white)',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card)',
    transition: 'border-color 0.15s ease, transform 0.1s ease, background-color 0.15s ease',
    minWidth: 0,
  },
  cardActive: {
    borderColor: 'var(--terracotta)',
    background: 'var(--terracotta-light)',
  },
  emoji: {
    fontSize: '2rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: 'var(--charcoal)',
    textAlign: 'center',
  },
}
