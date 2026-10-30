import { useEffect, useRef, useState } from 'react';

// One shared observer: adds "is-in" the first time an element scrolls into view.
let observer;
const callbacks = new WeakMap();
function observe(el, cb) {
  if (!('IntersectionObserver' in window)) return cb();
  observer ??= new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        callbacks.get(e.target)?.();
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  callbacks.set(el, cb);
  observer.observe(el);
}

/** Scroll-triggered reveal. variant: "up" (fade + rise) or "image" (wipe + settle). */
export default function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el) observe(el, () => setSeen(true));
    return () => observer?.unobserve(el);
  }, []);
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${seen ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
