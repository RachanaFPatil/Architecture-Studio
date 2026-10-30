import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from './Button';
import './Header.css';

function Wordmark() {
  return (
    <Link to="/" className="wordmark" aria-label="Form & Frame, home">
      FORM <span aria-hidden="true">&amp;</span> FRAME
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const onContact = pathname.startsWith('/contact');

  // close the mobile menu whenever the page changes
  useEffect(() => setOpen(false), [pathname]);

  // lock page scroll + Escape to close while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Wordmark />

        {/* Desktop navigation */}
        <nav className="site-nav" aria-label="Main">
          <NavLink to="/projects" className="site-nav__link">Projects</NavLink>
          <Button to="/contact" size="sm" variant={onContact ? 'primary' : 'secondary'}>Contact</Button>
        </nav>

        {/* Mobile: persistent Enquire button + menu toggle */}
        <div className="site-header__mobile">
          <Button to="/contact" size="sm">Enquire</Button>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={'menu-toggle__icon' + (open ? ' is-open' : '')} aria-hidden="true">
              <i /><i /><i />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <nav aria-label="Mobile" className="container mobile-menu__nav">
            <NavLink to="/projects" className="mobile-menu__link">Projects</NavLink>
            <NavLink to="/contact" className="mobile-menu__link">Contact</NavLink>
          </nav>
          <div className="container mobile-menu__cta">
            <Button to="/contact" block arrow>Start a Consultation</Button>
          </div>
        </div>
      )}
    </header>
  );
}
