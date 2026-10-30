import { Link } from 'react-router-dom';
import './TextLink.css';

/** Understated link with an animated underline. direction: 'forward' (arrow right) or 'back' (arrow left). */
export default function TextLink({ to, direction = 'forward', children, className = '', ...rest }) {
  const back = direction === 'back';
  const arrow = (
    <svg className="text-link__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={back ? 'M14 8H3M7 4L3 8l4 4' : 'M2 8h11M9 4l4 4-4 4'}
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <Link to={to} className={`text-link ${back ? 'text-link--back' : ''} ${className}`} {...rest}>
      {back && arrow}
      <span>{children}</span>
      {!back && arrow}
    </Link>
  );
}
