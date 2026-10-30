import { useEffect, useRef, useState } from 'react';
import './AmbientVideo.css';

/**
 * Short silent looping video with a poster image.
 * - Loads only when scrolled into view (nothing downloads before that).
 * - Phones (<=700px) get the smaller file.
 * - Reduced motion or Data Saver: poster only, until the visitor presses Play.
 * - Always has a Pause/Play button (WCAG: moving content over 5s must be pausable).
 * Files: /media/<name>.mp4, /media/<name>-sm.mp4, /media/<name>-poster.jpg
 */
export default function AmbientVideo({ name, label, className = '' }) {
  const box = useRef(null);
  const video = useRef(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPlayed, setUserPlayed] = useState(false);
  const [paused, setPaused] = useState(false);

  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData;
  const blocked = (reduce || saveData) && !userPlayed;
  const small = typeof matchMedia === 'function' && matchMedia('(max-width: 700px)').matches;
  const active = visible && !blocked;

  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) return setVisible(true);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // play while visible, pause when scrolled away or paused by the visitor
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active && !paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [active, paused]);

  const toggle = () => {
    if (blocked || !video.current) { setUserPlayed(true); setPaused(false); return; }
    setPaused((p) => !p);
  };
  const isRunning = playing && !paused && !blocked;

  return (
    <div ref={box} className={`ambient media ${className}`}>
      <img src={`/media/${name}-poster.jpg`} alt={label} loading="lazy" decoding="async" />
      {(active || userPlayed) && (
        <video
          ref={video}
          className={playing ? 'is-playing' : ''}
          src={`/media/${name}${small ? '-sm' : ''}.mp4`}
          poster={`/media/${name}-poster.jpg`}
          muted loop playsInline preload="metadata"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
      <button type="button" className="ambient__toggle" onClick={toggle} aria-label={isRunning ? `Pause video: ${label}` : `Play video: ${label}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          {isRunning ? <path d="M3 2h3v10H3zM8 2h3v10H8z" fill="currentColor" /> : <path d="M3 1.5v11l9-5.5z" fill="currentColor" />}
        </svg>
        <span>{isRunning ? 'Pause' : 'Play'}</span>
      </button>
    </div>
  );
}
