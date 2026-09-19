export default function MatchBadge({ percent, size = 'md' }) {
  const tier = percent === 100 ? 'full' : percent >= 60 ? 'good' : 'partial'

  const tierColors = {
    full: { bg: 'var(--green-light)', fg: 'var(--green)' },
    good: { bg: 'var(--terracotta-light)', fg: 'var(--terracotta-dark)' },
    partial: { bg: 'var(--cream-deep)', fg: 'var(--charcoal-soft)' },
  }
  const colors = tierColors[tier]

  const sizeStyles = {
    sm: { fontSize: '0.75rem', padding: '4px 10px' },
    md: { fontSize: '0.85rem', padding: '6px 14px' },
  }

  return (
    <span
      style={{
        ...styles.badge,
        ...sizeStyles[size],
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {percent}% Pantry Match
    </span>
  )
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
}
