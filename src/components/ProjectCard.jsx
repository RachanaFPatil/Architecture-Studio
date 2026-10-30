import { Link } from 'react-router-dom';
import ArtImage from './ArtImage';
import { TYPE_LABELS } from '../data/projects';
import { imagesFor } from '../data/photos';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const { slug, name, location, type, kind, tone, seed } = project;
  const image = imagesFor(slug)[0];
  return (
    <article className="project-card">
      <Link to={`/projects/${slug}`} className="project-card__link">
        <div className="media project-card__media">
          <div className="project-card__zoom">
            <ArtImage seed={seed} tone={tone} kind={kind} src={image} sizes="(min-width: 900px) 33vw, 100vw" label={`${name}, ${location}`} />
          </div>
          <span className="project-card__view" aria-hidden="true">View project</span>
        </div>
        <div className="project-card__body">
          <h3 className="project-card__name">{name}</h3>
          <svg className="project-card__arrow" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="project-card__meta">
          {location} · {TYPE_LABELS[type]}
        </p>
      </Link>
    </article>
  );
}
