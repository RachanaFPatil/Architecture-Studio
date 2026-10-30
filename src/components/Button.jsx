import { Link } from 'react-router-dom';
import './Button.css';

function Arrow() {
  return (
    <svg className="btn__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * variant: primary | secondary | light (for dark backgrounds)
 * size: md (56px) | sm (44px)
 * Pass `to` for an in-app link, `href` for an external link, otherwise it is a <button>.
 */
export default function Button({ to, href, variant = 'primary', size = 'md', block = false, arrow = false, className = '', children, ...rest }) {
  const cls = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block', className].filter(Boolean).join(' ');
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{content}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{content}</a>;
  return <button type={rest.type ?? 'button'} className={cls} {...rest}>{content}</button>;
}
