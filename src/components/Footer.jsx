import { Link } from 'react-router-dom';
import { hasPhotos } from '../data/photos';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <p className="site-footer__logo">FORM <span>&amp;</span> FRAME</p>
          <p className="site-footer__tagline">Architecture for homes and commercial spaces, made to be lived in.</p>
        </div>

        <nav aria-label="Footer" className="site-footer__col">
          <h2 className="site-footer__heading">Navigate</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Studio</h2>
          <ul>
            <li><a href="mailto:studio@formandframe.example">studio@formandframe.example</a></li>
            <li>Studio address placeholder</li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__legal">
        <p>
          © 2026 Form &amp; Frame. A fictional studio created for a UI/UX portfolio project.
          {hasPhotos && ' Photographs and video are royalty-free stock imagery, not studio work.'}
        </p>
      </div>
    </footer>
  );
}
