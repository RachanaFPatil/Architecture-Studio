import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import ArtImage from '../components/ArtImage';
import CtaBand from '../components/CtaBand';
import Reveal from '../components/Reveal';
import AmbientVideo from '../components/AmbientVideo';
import NotFound from './NotFound';
import usePageTitle from '../hooks/usePageTitle';
import { getProject, nextProject, toneAt, TYPE_LABELS } from '../data/projects';
import { imagesFor, videoFor } from '../data/photos';
import './ProjectDetail.css';

// Split the design intent into a short statement (first sentence) and the rest.
function splitIntent(text) {
  const i = text.indexOf('. ');
  if (i === -1) return { statement: text, rest: '' };
  return { statement: text.slice(0, i + 1), rest: text.slice(i + 2) };
}

function Pic({ project, offset, step = 0, className, label, src, priority = false }) {
  return (
    <Reveal variant={priority ? 'hero' : 'image'} className={`media ${className}`}>
      <ArtImage seed={project.seed + offset} tone={toneAt(project.tone, step)} kind={project.kind} src={src} priority={priority} sizes="(min-width: 1200px) 1200px, 100vw" label={label} />
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);
  usePageTitle(project ? project.name : 'Project not found');
  if (!project) return <NotFound />;

  const next = nextProject(slug);
  const { statement, rest } = splitIntent(project.intent);
  const enquiry = `/contact?type=${project.type}&project=${project.slug}`;
  const imgs = imagesFor(project.slug); // [main, gallery1, gallery2, gallery3]
  const film = videoFor(project.slug);

  const info = [
    ['Location', project.location],
    ['Type', TYPE_LABELS[project.type]],
    ['Size', project.size],
    ['Year', project.year],
    ['Status', project.status],
  ];

  return (
    <>
      {/* TITLE */}
      <header className="detail-head container">
        <TextLink to="/projects" direction="back">Back to Projects</TextLink>
        <span className="eyebrow detail-head__meta">
          {TYPE_LABELS[project.type]} · {project.location}
        </span>
        <h1 className="detail-head__title">{project.name}</h1>
      </header>

      <div className="container">
        <Pic project={project} offset={0} src={imgs[0]} priority className="detail-hero" label={`${project.name}, main view`} />
      </div>

      {/* OVERVIEW + INFO */}
      <section className="detail-body" aria-label="Project summary">
        <div className="container detail-body__grid">
          <div className="detail-text">
            <Reveal className="detail-block">
              <h2 className="eyebrow">Overview</h2>
              <p className="detail-overview">{project.overview}</p>
            </Reveal>
            <Reveal className="detail-block" delay={100}>
              <h2 className="eyebrow">Design intent</h2>
              <p className="detail-statement">{statement}</p>
              {rest && <p className="detail-rest">{rest}</p>}
            </Reveal>
          </div>

          <aside className="info-card" aria-label="Project information">
            <h2 className="eyebrow">Project information</h2>
            <dl className="info-card__list">
              {info.map(([k, v]) => (
                <div key={k} className="info-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <Button to={enquiry} block arrow>Discuss a Similar Project</Button>
          </aside>
        </div>
      </section>

      {film && (
        <section className="detail-film container" aria-label="Short film">
          <AmbientVideo name={film} label={`${project.name}, short film`} />
        </section>
      )}

      {/* GALLERY */}
      <section className="section gallery" aria-labelledby="gallery-title">
        <div className="container">
          <h2 id="gallery-title">Gallery</h2>
          <div className="gallery__grid">
            <Pic project={project} offset={1000} src={imgs[1]} className="gallery__wide" label={`${project.name}, exterior`} />
            <Pic project={project} offset={2000} step={1} src={imgs[2]} className="gallery__half" label={`${project.name}, detail`} />
            <Pic project={project} offset={3000} step={2} src={imgs[3]} className="gallery__half" label={`${project.name}, setting`} />
          </div>
          <p className="detail-note">
            Imagery is royalty-free stock photography and video used for illustration. {project.name} is a fictional project.
          </p>
        </div>
      </section>

      {/* NEXT PROJECT */}
      <nav className="next-strip container" aria-label="More projects">
        <TextLink to="/projects" direction="back">Back to Projects</TextLink>
        <TextLink to={`/projects/${next.slug}`}>Next project: {next.name}</TextLink>
      </nav>

      <CtaBand heading="Planning something similar?" text="Tell us about your project and the studio will get back to you by email." to={enquiry} />
    </>
  );
}
