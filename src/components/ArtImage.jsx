/**
 * ArtImage: original, procedurally drawn architectural "elevation" illustrations.
 * They stand in for photography so the site looks finished with no stock images.
 * To use a real photo later, pass `src` and it renders an <img> instead.
 *
 * props: seed (number), tone (dawn | forest | dusk | stone), kind (house | tower | pavilion | courtyard)
 */
const PALETTES = {
  dawn:   { sky: ['#EBDCC9', '#F6F2E9'], far: '#DCCBB3', ground: '#B9A98F', a: '#C17A58', b: '#F4F0E7', c: '#263A32', glow: '#FFF6E4' },
  forest: { sky: ['#C9D3C6', '#EEF0E6'], far: '#8FA392', ground: '#4F6657', a: '#263A32', b: '#E9E3D6', c: '#C17A58', glow: '#FFF9EC' },
  dusk:   { sky: ['#2F4A40', '#D3A583'], far: '#3B5A4D', ground: '#1B2B25', a: '#F4F0E7', b: '#C17A58', c: '#263A32', glow: '#FBE3B8' },
  stone:  { sky: ['#E3E6E0', '#F7F5EF'], far: '#C8CCC3', ground: '#A7A99D', a: '#6E7468', b: '#F4F0E7', c: '#C17A58', glow: '#FFFFFF' },
};

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 800;
const H = 600;

function Windows({ x, y, w, h, cols, rows, fill, opacity = 0.85, pad = 10 }) {
  const cw = (w - pad * (cols + 1)) / cols;
  const rh = (h - pad * (rows + 1)) / rows;
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push(<rect key={`${r}-${c}`} x={x + pad + c * (cw + pad)} y={y + pad + r * (rh + pad)} width={cw} height={rh} fill={fill} opacity={opacity} />);
    }
  }
  return <g>{out}</g>;
}

function Building({ kind, r, P, hz }) {
  const x0 = 140 + r() * 90;
  const w = 360 + r() * 140;
  const parts = [];

  if (kind === 'tower') {
    const bw = 190 + r() * 40;
    const bx = x0 + 90;
    parts.push(<rect key="b1" x={bx} y={hz - 250} width={bw} height={250} fill={P.b} />);
    parts.push(<rect key="b2" x={bx - 60} y={hz - 130} width={bw + 120} height={130} fill={P.a} />);
    parts.push(<rect key="b3" x={bx + 40} y={hz - 340} width={bw - 80} height={100} fill={P.c} />);
    parts.push(<Windows key="w1" x={bx} y={hz - 250} w={bw} h={250} cols={4} rows={5} fill={P.c} opacity={0.7} />);
    parts.push(<Windows key="w2" x={bx - 60} y={hz - 130} w={bw + 120} h={130} cols={6} rows={2} fill={P.glow} opacity={0.8} />);
    parts.push(<rect key="r" x={bx - 70} y={hz - 140} width={bw + 140} height={10} fill={P.c} />);
  } else if (kind === 'pavilion') {
    parts.push(<rect key="slab" x={x0 - 30} y={hz - 190} width={w + 60} height={22} fill={P.c} />);
    parts.push(<rect key="core" x={x0 + w * 0.55} y={hz - 168} width={w * 0.3} height={168} fill={P.a} />);
    parts.push(<rect key="glass" x={x0} y={hz - 168} width={w * 0.55} height={168} fill={P.glow} opacity={0.55} />);
    for (let i = 0; i <= 6; i++) {
      parts.push(<rect key={`m${i}`} x={x0 + (i * (w * 0.55)) / 6 - 2} y={hz - 168} width={4} height={168} fill={P.c} />);
    }
    parts.push(<rect key="plinth" x={x0 - 30} y={hz - 8} width={w + 60} height={8} fill={P.c} opacity={0.6} />);
  } else if (kind === 'courtyard') {
    const wing = w * 0.34;
    parts.push(<rect key="l" x={x0} y={hz - 170} width={wing} height={170} fill={P.b} />);
    parts.push(<rect key="r" x={x0 + w - wing} y={hz - 200} width={wing} height={200} fill={P.a} />);
    parts.push(<rect key="roof" x={x0 - 10} y={hz - 182} width={w + 20} height={12} fill={P.c} />);
    parts.push(<Windows key="wl" x={x0} y={hz - 170} w={wing} h={170} cols={3} rows={2} fill={P.c} opacity={0.75} />);
    parts.push(<Windows key="wr" x={x0 + w - wing} y={hz - 200} w={wing} h={200} cols={3} rows={3} fill={P.glow} opacity={0.8} />);
    parts.push(<rect key="gap" x={x0 + wing} y={hz - 150} width={w - 2 * wing} height={150} fill={P.glow} opacity={0.4} />);
  } else {
    // house: two stacked volumes with a deep cantilever
    parts.push(<rect key="low" x={x0} y={hz - 150} width={w} height={150} fill={P.b} />);
    parts.push(<rect key="up" x={x0 + w * 0.22} y={hz - 262} width={w * 0.62} height={112} fill={P.a} />);
    parts.push(<rect key="cant" x={x0 + w * 0.7} y={hz - 262} width={w * 0.3} height={14} fill={P.c} />);
    parts.push(<rect key="roof" x={x0 - 12} y={hz - 160} width={w * 0.3} height={10} fill={P.c} />);
    parts.push(<rect key="glass" x={x0 + w * 0.08} y={hz - 130} width={w * 0.5} height={130} fill={P.c} opacity={0.85} />);
    for (let i = 1; i < 6; i++) {
      parts.push(<rect key={`g${i}`} x={x0 + w * 0.08 + (i * w * 0.5) / 6 - 1.5} y={hz - 130} width={3} height={130} fill={P.glow} opacity={0.5} />);
    }
    parts.push(<Windows key="uw" x={x0 + w * 0.22} y={hz - 262} w={w * 0.62} h={112} cols={5} rows={1} fill={P.glow} opacity={0.75} pad={14} />);
    parts.push(<rect key="door" x={x0 + w * 0.68} y={hz - 100} width={34} height={100} fill={P.a} />);
  }

  // long soft shadow on the ground
  parts.push(<polygon key="sh" points={`${x0},${hz} ${x0 + w + 40},${hz} ${x0 + w + 150},${hz + 26} ${x0 + 60},${hz + 26}`} fill="#000" opacity={0.14} />);
  return <g>{parts}</g>;
}

import { srcSetFor } from '../data/photos';

export default function ArtImage({ seed = 1, tone = 'dawn', kind = 'house', label = '', src, alt = '', priority = false, sizes = '100vw' }) {
  if (src) {
    return (
      <img
        src={src}
        srcSet={srcSetFor(src)}
        sizes={sizes}
        alt={alt || label}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  const P = PALETTES[tone] ?? PALETTES.dawn;
  const r = rng(seed * 9973 + 17);
  const hz = 400 + Math.floor(r() * 30);
  const sunX = 110 + r() * 560;
  const gid = `sky-${seed}-${tone}`;

  const trees = [0, 1, 2].map((i) => {
    const tx = i === 0 ? 40 + r() * 70 : i === 1 ? 640 + r() * 100 : 90 + r() * 600;
    const tr = 26 + r() * 22;
    return (
      <g key={i} opacity={i === 2 ? 0.45 : 0.9}>
        <rect x={tx - 2} y={hz - tr * 1.2} width={4} height={tr * 1.2} fill={P.c} />
        <circle cx={tx} cy={hz - tr * 1.5} r={tr} fill={P.c} opacity={0.82} />
      </g>
    );
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%" role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.sky[0]} />
          <stop offset="1" stopColor={P.sky[1]} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${gid})`} />
      <circle cx={sunX} cy={150 + r() * 40} r={48} fill={P.glow} opacity={0.9} />
      <path d={`M0 ${hz - 40} C 180 ${hz - 120 + r() * 40}, 420 ${hz - 20 - r() * 30}, 800 ${hz - 80} L800 ${hz} L0 ${hz} Z`} fill={P.far} opacity={0.75} />
      <rect y={hz} width={W} height={H - hz} fill={P.ground} />
      <rect y={hz} width={W} height={3} fill={P.c} opacity={0.25} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} y={hz + 36 + i * 38} x={0} width={W} height={1} fill={P.c} opacity={0.1} />
      ))}
      {trees}
      <Building kind={kind} r={r} P={P} hz={hz} />
    </svg>
  );
}
