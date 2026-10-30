// Automatic photo lookup.
// Optimised photos live in src/assets/photos/ as `<project-slug>-<1-4>.jpg` (1600w) plus `-sm.jpg` (800w).
// They are generated from the original supplied files by `npm run media` (see scripts/build-media.mjs).
//   -1 = main image, -2 / -3 / -4 = gallery images.
// Any project with no photos keeps its generated illustration.
const files = import.meta.glob('../assets/photos/*.jpg', { eager: true, query: '?url', import: 'default' });

const byName = {};
for (const [path, url] of Object.entries(files)) {
  byName[path.split('/').pop().replace(/\.\w+$/, '').toLowerCase()] = url;
}

// full-size url -> responsive srcset (800w + 1600w)
const srcSets = {};
for (const [name, url] of Object.entries(byName)) {
  if (name.endsWith('-sm')) continue;
  const sm = byName[`${name}-sm`];
  if (sm) srcSets[url] = `${sm} 800w, ${url} 1600w`;
}

export const hasPhotos = Object.keys(byName).length > 0;

/** Returns 4 image URLs for a project (or undefined entries when it has no photos). */
export function imagesFor(slug) {
  const found = [1, 2, 3, 4].map((n) => byName[`${slug}-${n}`]).filter(Boolean);
  return Array.from({ length: 4 }, (_, i) => (found.length ? found[i % found.length] : undefined));
}

export const srcSetFor = (url) => srcSets[url];

// Short ambient videos in /public/media (name.mp4, name-sm.mp4 for phones, name-poster.jpg).
const VIDEO_BY_PROJECT = {
  'cedar-house': 'cedar',
  'garden-extension': 'garden',
  'terrace-home': 'terrace',
  'linen-cafe': 'cafe',
  'hillside-retreat': 'hillside',
};
export const videoFor = (slug) => VIDEO_BY_PROJECT[slug];
