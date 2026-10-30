import Button from '../components/Button';

export default function NotFound() {
  return (
    <section className="section container" style={{ minHeight: '55vh' }}>
      <span className="eyebrow">Error 404</span>
      <h1 style={{ marginTop: 'var(--space-2)' }}>This page could not be found.</h1>
      <p className="lead" style={{ margin: 'var(--space-3) 0 var(--space-4)', maxWidth: '44ch' }}>
        The link may be out of date. Head back to the homepage or browse the studio's projects.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button to="/">Back to Home</Button>
        <Button to="/projects" variant="secondary">View Projects</Button>
      </div>
    </section>
  );
}
