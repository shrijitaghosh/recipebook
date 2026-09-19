import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandMark}>🍲</span>
          <span style={styles.brandName}>RecipeBook</span>
        </Link>
      </div>
    </header>
  )
}

const styles = {
  header: {
    borderBottom: '1px solid var(--border)',
    background: 'var(--cream)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  inner: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    fontSize: '1.5rem',
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.3rem',
    color: 'var(--charcoal)',
  },
}
