// Resizes and compresses original photos from /photos-inbox into src/assets/photos/ as web-ready JPEGs.
// Name originals like: cedar-house-1.jpg  (slug-number, number 1..4)  then run:  npm run photos
import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

const IN = 'photos-inbox';
const OUT = 'src/assets/photos';
const SLUGS = ['cedar-house', 'courtyard-residence', 'atelier-loft', 'garden-extension', 'terrace-home', 'linen-cafe', 'harbour-offices', 'hillside-retreat', 'maple-studio'];

mkdirSync(OUT, { recursive: true });
const files = readdirSync(IN).filter((f) => /\.(jpe?g|png|webp|avif|heic)$/i.test(f));
if (!files.length) {
  console.log(`No images found in ${IN}/. Add files like cedar-house-1.jpg and run again.`);
  process.exit(0);
}

for (const f of files) {
  const { name } = parse(f);
  const key = name.toLowerCase();
  const m = key.match(/^(.*)-([1-4])$/);
  if (!m || !SLUGS.includes(m[1])) {
    console.warn(`SKIPPED ${f}: name must be <project-slug>-<1-4>, e.g. cedar-house-1.jpg`);
    continue;
  }
  const dest = join(OUT, `${key}.jpg`);
  await sharp(join(IN, f)).rotate().resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toFile(dest);
  console.log(`ok  ${f} -> ${dest} (${Math.round(statSync(dest).size / 1024)} KB)`);
}
