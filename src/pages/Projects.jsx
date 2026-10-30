import { useSearchParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import ProjectCard from '../components/ProjectCard';
import CtaBand from '../components/CtaBand';
import usePageTitle from '../hooks/usePageTitle';
import { projects, CATEGORIES } from '../data/projects';
import './Projects.css';

export default function Projects() {
  usePageTitle('Projects');
  const [params, setParams] = useSearchParams();
  const requested = params.get('type');
  const active = CATEGORIES.some((c) => c.id === requested) ? requested : 'all';
  const list = projects.filter((p) => active === 'all' || p.type === active);

  const choose = (id) => setParams(id === 'all' ? {} : { type: id }, { replace: true });

  return (
    <>
      <section className="page-head container">
        <div className="page-head__title">
          <span className="eyebrow">Projects</span>
          <h1>Selected work</h1>
        </div>
        <p className="lead page-head__intro">
          Homes, renovations and commercial spaces. Filter by type to find work similar to your own.
        </p>
      </section>

      <div className="filters">
        <div className="container filters__inner">
          <div className="filters__row" role="group" aria-label="Filter projects by type">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={'chip' + (c.id === active ? ' is-active' : '')}
                aria-pressed={c.id === active}
                onClick={() => choose(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="filters__count" aria-live="polite">
            {list.length} {list.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
      </div>

      <section className="section project-list container" aria-label="Projects">
        <div className="project-grid" key={active}>
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 100}><ProjectCard project={p} /></Reveal>
          ))}
        </div>
      </section>

      <CtaBand heading="Have a project in mind?" text="Tell us about it and the studio will get back to you by email." />
    </>
  );
}
