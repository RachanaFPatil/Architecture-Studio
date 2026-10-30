# FORM & FRAME: PROGRESS (resume here)

Fictional architecture studio. UI/UX portfolio project with a deployed responsive React + Vite site.
**Deadline:** about 4 hours from Fri 30 Oct 2026, 12:56 IST (so roughly 17:00 IST).
Earlier completed work (do not regenerate): `/home/claude/wireframes/*.svg` (10 low-fi frames, already imported in Figma), `wireframe-plan.md`, brief and sitemap (in chat).

## Locked design decisions (do not revisit)
- Colours: forest `#263A32`, linen `#F4F0E7`, clay `#C17A58`, white. Extras in `src/styles/tokens.css`.
- Type: DM Serif Display (headings), Inter (body/UI), self-hosted via @fontsource.
- 8px spacing scale, 1200px container, side margin 24px (mobile) to 120px (1440 desktop), 12-col desktop idea.
- Sharp 2px corners, thin hairline borders, generous whitespace, no shadows.
- Buttons: primary = solid forest, secondary = outline, light = on dark backgrounds. 56px tall (44px small).
- Imagery: original generated architectural illustrations (`ArtImage.jsx`), swap for real photos later by passing `src`.
- Routing: BrowserRouter. SPA fallback files exist: `public/_redirects` (Netlify) and `vercel.json` (Vercel).
- Breakpoint: desktop nav from 900px; below that: Enquire button + hamburger + full-screen menu.
- Form types: new-home, renovation, commercial, not-sure (see `src/data/projects.js`).

## File map
```
form-and-frame/
  PROGRESS.md              <- this file
  index.html, vite.config.js, package.json, vercel.json
  public/_redirects, favicon.svg
  scripts/export-art.mjs   -> writes design-assets/images/*.svg (27 files, Figma-importable)
  design-assets/images/    -> 9 projects x 3 illustrations (SVG, 800x600)
  src/
    main.jsx, App.jsx      
    styles/tokens.css, base.css
    data/projects.js       (9 fictional projects, categories, form options, helpers)
    components/
      Button, Header (desktop nav + mobile menu), Footer, CtaBand, ArtImage, ScrollToTop
    pages/
      Stub.jsx (temporary), NotFound.jsx (done)
```

## Stage log
- [x] Stage 0: inspected files (Node 22 present, no host CLI, no photos on disk).
- [x] Stage 1: scaffold, tokens, base CSS, Button, Header (+mobile menu), Footer, CtaBand, ArtImage, data, NotFound, deploy config, 27 exported images. `npm run build` passes.

- [x] Stage 2 (done 13:30 IST): Home page (hero with featured-project caption, services, 3 featured cards, CTA), `ProjectCard`, `TextLink`, `usePageTitle`, Projects page. Filter is URL-synced (`/projects?type=renovation`), uses `aria-pressed` chips and a live count. Verified at 1440 and 390 with screenshots; filter tested in browser.

- [x] Stage 3 (done 13:45 IST): `ProjectDetail` page: back link, title, hero image, overview, design intent (first sentence shown as serif statement), sticky info card (desktop), 3-image gallery (tone shifts per image), back/next strip, closing CTA, 404 for unknown slug. Enquiry buttons link to `/contact?type=<type>&project=<slug>` (**Stage 4 must read these two params**). Fixed: eyebrow font bleed, instant scroll-to-top on route change. `export-art.mjs` now exports 4 images per project (36 files: -1 main, -2/-3/-4 gallery).
  - Deferred: sticky bottom enquiry bar on mobile detail pages (header Enquire button already persists).

- [x] Imagery pipeline (13:55 IST): the build environment cannot download from Unsplash/Pexels (network allowlist), so photos could NOT be fetched here. Site is wired to use real photos automatically: put `<slug>-<1-4>.jpg` in `photos-inbox/`, run `npm run photos` (sharp resize/compress to `src/assets/photos/`), then build. Projects without photos keep the generated illustration; footer note about stock photography appears once any photo exists. Pipeline tested with temporary images (removed). **USER ACTION STILL NEEDED: add the photos. See `PHOTOS.md` (shot list, file names, sourcing rules) and fill `PHOTO-CREDITS.md`.**
- [x] Stage 4 (done 14:05 IST): `Contact` page + `Field` component. Prefill via `/contact?type=<type>&project=<slug>` (type select, description starter text, "Based on <project>" note; bad/unknown params ignored; form remounts when params change). Validation: required fields, email format, description min 10 chars; errors show on blur and on submit, clear live as you fix them; error summary with jump links; focus moves to first invalid field; typed values kept. Submit simulates sending (900 ms) then a confirmation view (focus to heading, summary of entered details, Back to Home / View Projects). No email is really sent. Fixed: blur validation shifting the button and cancelling taps (mousedown preventDefault). Tested: empty submit, invalid email, live clearing, valid submit, prefill from detail page and CTA band, header Contact reset, bogus params, Enter key, touch tap, no console errors.

- [x] Stage 5 (done 30 Oct 2026): Responsive + accessibility QA. Automated checks (Playwright/Chromium) on Home, Projects, Project detail, Contact, 404 at 1440 / 768 / 390, plus 320 for overflow. Passed: no horizontal overflow (after fix), one `h1` and one `main` per page, `lang="en"`, unique page titles, skip link, all images have `alt`, all form fields labelled, no unnamed links/buttons, visible 2px focus ring on every tab stop, `prefers-reduced-motion` handled, mobile menu opens/closes (button + Esc), no console errors. Fixed: (1) project detail page overflowed sideways at 320px (grid children now `min-width: 0`); (2) tap targets under 44px: wordmark, desktop nav links, footer links (padding only, no visual redesign).
  - Not done (needs a real device/screen reader): VoiceOver/TalkBack pass, mobile-menu focus trap (menu closes on Esc; focus is not trapped), zoom-to-200% check on a real browser.

- [x] FINAL ENHANCEMENT (30 Oct 2026):
  - **Imagery:** `photos.zip` (19 photos + 8 videos) inspected, mapped to the 9 projects and optimised by `npm run media` (`scripts/build-media.mjs`, originals in `photos-inbox/originals/`, not shipped). 36 JPEGs (1600w + 800w srcset, ~7.5 MB total) in `src/assets/photos/`; 5 silent videos (720p + 480p phone version + poster, ~2.9 MB) in `public/media/`. SVG illustrations are no longer used by any page (component kept as fallback). Where a project lacked variety, gallery slots reuse crops of the closest assets (see `scripts/build-media.mjs` MAP).
  - **Flags:** harbour-offices-1/-2 are watermarked iStock previews (replace before public launch). garden2.jpg and court.mp4 unusable; 9 watermarked photos + 2 videos not used. Linen Café's video is almost static, so its gallery is crops of one frame. See `PHOTO-CREDITS.md`.
  - **Video:** `AmbientVideo` (Home "Seen from above" band + short film on Cedar House, Garden Extension, Terrace Home, Linen Café, Hillside Retreat). Loads only when scrolled into view, phones get the small file, reduced-motion/Data Saver = poster only until Play, always has Pause/Play. (Headless Chromium has no H.264, so playback itself was verified by request logs + ffprobe, not on screen.)
  - **Motion:** hero headline word reveal + image wipe, scroll reveals (`Reveal.jsx`, one shared IntersectionObserver), image wipe in galleries, card hover zoom + "View project" tab (always visible on touch), page entrance transition, existing animated underlines kept. All off under `prefers-reduced-motion`. No 3D effect added: judged not worth the weight for this site.
  - **Enquiries:** Formspree via `src/lib/enquiry.js`, endpoint from `VITE_FORMSPREE_ENDPOINT` (`.env.example`, setup in `README-ENQUIRIES.md`). Loading, validation, server-field (422) errors, 5xx, network, 15 s timeout and "not configured" states tested with mocked responses; success only on a real 2xx. Prefill from `?type=&project=` preserved, honeypot added. **Needs the user's Formspree account.**
  - **Responsive:** tested 320 / 390 / 430 / 768 / 1440 on Home, Projects, 3 project pages, Contact: no horizontal overflow, no broken images, no 4xx, no console errors, mobile menu usable, tap targets >= 44px. Fixed: reveal never firing for clipped gallery images, wordmark wrapping at 320, small link targets.

## Remaining stages (in order)
- [ ] **Stage 6 (~20 min):** Deploy (GitHub + Vercel or Netlify). Needs the user's account login.
- [ ] **Stage 7 (~40 min):** Figma hi-fi assets: design-system sheet SVG, page screenshots as 1440/390 frames, Figma prototype wiring notes.
- [ ] **Stage 8 (~30 min):** Case study (markdown/doc) with process, decisions, assumptions, screenshots.

## Commands
```
cd /home/claude/form-and-frame
npm install          # only if node_modules missing
npm run dev          # local dev server
npm run build        # production build to dist/
node scripts/export-art.mjs   # re-export illustration SVGs
```

## Notes / assumptions to mention in case study
- All studio, project, location and size details are fictional placeholders.
- No real client feedback, research or testimonials were used or invented.
- Form does not send email (prototype only). Reply promises are placeholders to validate.
