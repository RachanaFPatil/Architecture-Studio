# Photos and video

The imagery is now integrated. To change it: edit the MAP in `scripts/build-media.mjs` (or replace files in `photos-inbox/originals/`) and run `npm run media`.
Credits and the list of watermarked files to replace: see `PHOTO-CREDITS.md`.
The older `npm run photos` (drop `<slug>-<1-4>.jpg` into `photos-inbox/`) still works for simple swaps, but `npm run media` also regenerates the 800w versions.
