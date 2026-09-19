import { useNavigate } from 'react-router-dom'

const STEPS = [
  { num: 1, title: 'Tell us what you have', desc: 'Add the ingredients sitting in your kitchen right now.' },
  { num: 2, title: 'Choose your meal', desc: 'Breakfast, lunch, dinner or a snack — your call.' },
  { num: 3, title: 'Discover recipes', desc: 'See exactly what you can cook, ranked by match.' },
]

const WHY_CARDS = [
  { emoji: '🥘', title: 'Cook with what you have', desc: 'No more grocery runs for a recipe you saw online.' },
  { emoji: '🎯', title: 'Personalized to you', desc: 'Matched to your diet, your meal, your pantry.' },
  { emoji: '⏱️', title: 'Calories & time at a glance', desc: 'Know what you\u2019re getting before you start cooking.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>What&rsquo;s in your kitchen?</h1>
        <p style={styles.heroSub}>Turn what you have into something delicious.</p>
        <p style={styles.heroBody}>
          Add the ingredients you already have and discover meals you can
          actually make.
        </p>
        <button
          type="button"
          className="btn-primary"
          style={styles.cta}
          onClick={() => navigate('/preferences')}
        >
          🍳 Start Cooking
        </button>
      </section>

      <section style={styles.steps}>
        {STEPS.map((step) => (
          <div key={step.num} style={styles.stepCard}>
            <span style={styles.stepNum}>{step.num}</span>
            <h3 style={styles.stepTitle}>{step.title}</h3>
            <p style={styles.stepDesc}>{step.desc}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 style={styles.whyTitle}>Why RecipeBook?</h2>
        <div style={styles.whyGrid}>
          {WHY_CARDS.map((card) => (
            <div key={card.title} className="card" style={styles.whyCard}>
              <span style={styles.whyEmoji}>{card.emoji}</span>
              <h3 style={styles.whyCardTitle}>{card.title}</h3>
              <p style={styles.whyCardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const styles = {
  hero: {
    textAlign: 'center',
    padding: '72px 0 56px',
    maxWidth: 620,
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
    marginBottom: 16,
  },
  heroSub: {
    fontSize: '1.25rem',
    color: 'var(--terracotta-dark)',
    fontWeight: 600,
    marginBottom: 16,
  },
  heroBody: {
    fontSize: '1.05rem',
    color: 'var(--charcoal-soft)',
    marginBottom: 32,
    lineHeight: 1.6,
  },
  cta: {
    fontSize: '1.05rem',
    padding: '17px 36px',
  },
  steps: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
    marginBottom: 64,
  },
  stepCard: {
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 24,
    textAlign: 'left',
  },
  stepNum: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--green-light)',
    color: 'var(--green)',
    fontWeight: 700,
    fontSize: '0.9rem',
    marginBottom: 14,
  },
  stepTitle: {
    fontSize: '1.05rem',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: '0.9rem',
    color: 'var(--charcoal-soft)',
    lineHeight: 1.5,
  },
  whyTitle: {
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: 28,
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
  },
  whyCard: {
    padding: 28,
    textAlign: 'center',
  },
  whyEmoji: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: 14,
  },
  whyCardTitle: {
    fontSize: '1.05rem',
    marginBottom: 8,
  },
  whyCardDesc: {
    fontSize: '0.9rem',
    color: 'var(--charcoal-soft)',
    lineHeight: 1.5,
  },
}
