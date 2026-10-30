import Button from './Button';
import './CtaBand.css';

export default function CtaBand({ heading = 'Planning a home or a project?', text = 'Tell us what you have in mind and the studio will take it from there.', to = '/contact', label = 'Start a Consultation' }) {
  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <div className="container cta-band__inner">
        <h2 id="cta-heading">{heading}</h2>
        <p className="lead">{text}</p>
        <Button to={to} arrow>{label}</Button>
      </div>
    </section>
  );
}
