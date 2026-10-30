import { Link } from 'react-router-dom';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import ArtImage from '../components/ArtImage';
import ProjectCard from '../components/ProjectCard';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import AmbientVideo from '../components/AmbientVideo';
import usePageTitle from '../hooks/usePageTitle';
import { projects, getProject } from '../data/projects';
import { imagesFor } from '../data/photos';
import './Home.css';

const SERVICES = [
  { n: '01', title: 'New Homes', text: 'From first sketch to a finished home, designed around how your household lives.' },
  { n: '02', title: 'Renovations', text: 'Reworking existing homes with more light, better flow and room to grow.' },
  { n: '03', title: 'Commercial Spaces', text: 'Offices, shops and hospitality interiors that feel considered and welcoming.' },
];

const HEADLINE = 'Considered homes and spaces, made to be lived in.';

export default function Home() {
  usePageTitle('');
  const hero = getProject('cedar-house');
  const featured = projects.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__text">
          <span className="eyebrow" style={{ '--i': 0 }}>Architecture Studio</span>
          <h1 id="hero-title" className="hero__title">
            {HEADLINE.split(' ').map((w, i) => (
              <span key={i}><span className="word"><span style={{ '--w': i }}>{w}</span></span>{' '}</span>
            ))}
          </h1>
          <p className="lead hero__lead" style={{ '--i': 2 }}>
            We design new homes, renovations and commercial spaces. Browse our work, then tell us about your project.
          </p>
          <div className="hero__actions" style={{ '--i': 3 }}>
            <Button to="/contact" arrow>Start a Consultation</Button>
            <Button to="/projects" variant="secondary">View Projects</Button>
          </div>
        </div>

        <div className="hero__media media">
          <ArtImage seed={hero.seed} tone={hero.tone} kind={hero.kind} src={imagesFor(hero.slug)[0]} priority sizes="(min-width: 900px) 56vw, 100vw" label={`${hero.name}, ${hero.location}`} />
          <Link to={`/projects/${hero.slug}`} className="hero__caption">
            <span className="hero__caption-label">Featured</span>
            <span>{hero.name}, {hero.location}</span>
          </Link>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section services" aria-labelledby="services-title">
        <div className="container">
          <Reveal><span className="eyebrow">Services</span>
          <h2 id="services-title" className="services__title">What we do</h2></Reveal>
          <ul className="services__grid">
            {SERVICES.map((s, i) => (
              <Reveal as="li" delay={i * 120} key={s.n} className="service">
                <span className="service__num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FILM */}
      <section className="film" aria-label="Film: Cedar House from above">
        <AmbientVideo name="cedar" label="Aerial view of a house and garden, Cedar House" className="film__video" />
        <Reveal className="film__caption container">
          <span className="eyebrow">Seen from above</span>
          <Link to="/projects/cedar-house" className="film__link">Cedar House, Riverside</Link>
        </Reveal>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section featured" aria-labelledby="featured-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="featured-title">Selected Projects</h2>
            <TextLink to="/projects">View all projects</TextLink>
          </Reveal>
          <div className="featured__grid">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}><ProjectCard project={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
