// Exports every project illustration as an SVG into design-assets/images/
// so they can be dragged into Figma. Run: node scripts/export-art.mjs
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync, writeFileSync } from 'node:fs';

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
  optimizeDeps: { noDiscovery: true, include: [] },
});
const { default: ArtImage } = await server.ssrLoadModule('/src/components/ArtImage.jsx');
const { projects, toneAt } = await server.ssrLoadModule('/src/data/projects.js');

mkdirSync('design-assets/images', { recursive: true });
for (const p of projects) {
  // gallery variants use different seeds so each detail page has varied images
  // 1 = main image, 2-4 = gallery (matches ProjectDetail.jsx)
  const variants = [[p.seed, 0], [p.seed + 1000, 0], [p.seed + 2000, 1], [p.seed + 3000, 2]];
  variants.forEach(([seed, step], i) => {
    const svg = renderToStaticMarkup(createElement(ArtImage, { seed, tone: toneAt(p.tone, step), kind: p.kind, label: p.name }))
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
      .replace('width="100%" height="100%"', 'width="800" height="600"');
    writeFileSync(`design-assets/images/${p.slug}-${i + 1}.svg`, svg);
  });
}
await server.close();
console.log('exported', projects.length * 4, 'images');
