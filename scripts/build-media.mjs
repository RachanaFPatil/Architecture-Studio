// Builds all web-ready media from the original supplied files.
//   node scripts/build-media.mjs [sourceDir]      (default: photos-inbox/originals)
// Photos  -> src/assets/photos/<slug>-<1-4>.jpg (1600w) and -sm.jpg (800w)
// Videos  -> public/media/<name>.mp4 (720p), <name>-sm.mp4 (480p), <name>-poster.jpg  (silent, 8s max)
// Every crop is a region (fractions of the source) so one source can serve several gallery slots.
import sharp from 'sharp';
import { mkdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const SRC = process.argv[2] || 'photos-inbox/originals';
const OUT = 'src/assets/photos';
const VID = 'public/media';
const TMP = '/tmp/ff-stills';
mkdirSync(OUT, { recursive: true }); mkdirSync(VID, { recursive: true }); mkdirSync(TMP, { recursive: true });

// Still frames pulled from videos (used as photos): name -> [video, second]
const STILLS = {
  'cafe-still': ['cafe.mp4', 8],
  'garden-still-a': ['garden.mp4', 3],
  'garden-still-b': ['garden.mp4', 10],
  'terrace-still': ['terrace.mp4', 4],
  'hillside-still': ['hillside.mp4', 5],
};
for (const [name, [file, t]] of Object.entries(STILLS)) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', join(SRC, file), '-frames:v', '1', '-q:v', '2', `${TMP}/${name}.jpg`]);
}
const src = (f) => (STILLS[f] ? `${TMP}/${f}.jpg` : join(SRC, f));

// slug-N : [source file (or still name), crop {l,t,w,h} fractions | null, flag]
// flag 'wm' = source is a watermarked preview that must be replaced before public launch.
const MAP = {
  'cedar-house-1': ['cedar.jpg', { l: 0, t: 0.14, w: 1, h: 0.75 }],
  'cedar-house-2': ['loft3.jpg'],
  'cedar-house-3': ['terrace2.jpg'],
  'cedar-house-4': ['cedar.jpg', { l: 0.3, t: 0.45, w: 0.7, h: 0.5 }],

  'courtyard-residence-1': ['court card.jpg', { l: 0, t: 0.08, w: 1, h: 0.75 }],
  'courtyard-residence-2': ['court.jpg'],
  'courtyard-residence-3': ['court card.jpg', { l: 0, t: 0, w: 1, h: 0.6 }],
  'courtyard-residence-4': ['loft3.jpg', { l: 0, t: 0.1, w: 0.55, h: 0.8 }],

  'atelier-loft-1': ['loft2.jpg'],
  'atelier-loft-2': ['loft3.jpg'],
  'atelier-loft-3': ['loft2.jpg', { l: 0.25, t: 0, w: 0.75, h: 0.6 }],
  'atelier-loft-4': ['loft2.jpg', { l: 0.2, t: 0.4, w: 0.7, h: 0.6 }],

  'garden-extension-1': ['court.jpg'],
  'garden-extension-2': ['garden-still-a'],
  'garden-extension-3': ['court.jpg', { l: 0.35, t: 0.35, w: 0.65, h: 0.65 }],
  'garden-extension-4': ['garden-still-b'],

  'terrace-home-1': ['terrace.jpg'],
  'terrace-home-2': ['terrace2.jpg'],
  'terrace-home-3': ['terrace.jpg', { l: 0, t: 0, w: 0.8, h: 0.5 }],
  'terrace-home-4': ['terrace-still'],

  'linen-cafe-1': ['cafe-still'],
  'linen-cafe-2': ['cafe-still', { l: 0, t: 0, w: 0.55, h: 0.6 }],
  'linen-cafe-3': ['cafe-still', { l: 0.45, t: 0, w: 0.55, h: 0.6 }],
  'linen-cafe-4': ['cafe-still', { l: 0.15, t: 0.4, w: 0.7, h: 0.6 }],

  'harbour-offices-1': ['office.jpg', null, 'wm'],
  'harbour-offices-2': ['office2.jpg', null, 'wm'],
  'harbour-offices-3': ['exibition.jpg', { l: 0.5, t: 0.1, w: 0.5, h: 0.7 }],
  'harbour-offices-4': ['exibition.jpg', { l: 0, t: 0.15, w: 0.6, h: 0.7 }],

  'hillside-retreat-1': ['hillside.jpg'],
  'hillside-retreat-2': ['terrace2.jpg', { l: 0.1, t: 0.2, w: 0.8, h: 0.65 }],
  'hillside-retreat-3': ['hillside.jpg', { l: 0.4, t: 0, w: 0.6, h: 0.6 }],
  'hillside-retreat-4': ['hillside-still'],

  'maple-studio-1': ['exibition.jpg'],
  'maple-studio-2': ['exibition.jpg', { l: 0, t: 0.2, w: 0.55, h: 0.7 }],
  'maple-studio-3': ['loft3.jpg', { l: 0.25, t: 0.05, w: 0.6, h: 0.6 }],
  'maple-studio-4': ['exibition.jpg', { l: 0.45, t: 0.05, w: 0.55, h: 0.6 }],
};

const kb = (p) => `${Math.round(statSync(p).size / 1024)} KB`;
for (const [key, [file, crop]] of Object.entries(MAP)) {
  const input = src(file);
  const meta = await sharp(input).rotate().metadata();
  let img = sharp(input).rotate();
  if (crop) {
    const W = meta.orientation > 4 ? meta.height : meta.width, H = meta.orientation > 4 ? meta.width : meta.height;
    const left = Math.floor(crop.l * W), top = Math.floor(crop.t * H);
    const width = Math.min(Math.floor(crop.w * W), W - left), height = Math.min(Math.floor(crop.h * H), H - top);
    img = sharp(await sharp(input).rotate().extract({ left, top, width, height }).toBuffer());
  }
  const buf = await img.toBuffer();
  await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toFile(`${OUT}/${key}.jpg`);
  await sharp(buf).resize({ width: 800, withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toFile(`${OUT}/${key}-sm.jpg`);
  console.log(`${key.padEnd(24)} <- ${file.padEnd(16)} ${kb(`${OUT}/${key}.jpg`)}`);
}

// Videos: name -> [source, start second]
const VIDEOS = {
  cedar: ['cedar.mp4', 3], garden: ['garden.mp4', 2], terrace: ['terrace.mp4', 0], cafe: ['cafe.mp4', 4], hillside: ['hillside.mp4', 2],
};
for (const [name, [file, ss]] of Object.entries(VIDEOS)) {
  const base = ['-v', 'error', '-y', '-ss', String(ss), '-t', '8', '-i', join(SRC, file), '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'veryfast', '-movflags', '+faststart'];
  execFileSync('ffmpeg', [...base, '-vf', 'scale=1280:-2,fps=24', '-crf', '30', `${VID}/${name}.mp4`]);
  execFileSync('ffmpeg', [...base, '-vf', 'scale=640:-2,fps=24', '-crf', '32', `${VID}/${name}-sm.mp4`]);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(ss + 1), '-i', join(SRC, file), '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '4', `${VID}/${name}-poster.jpg`]);
  console.log(`video ${name.padEnd(9)} ${kb(`${VID}/${name}.mp4`)} / ${kb(`${VID}/${name}-sm.mp4`)}`);
}
