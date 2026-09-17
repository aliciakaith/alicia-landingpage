# Jason — landing page

One static route, built with Astro + plain CSS, deployed to Vercel. Recreated from
`../project/design_handoff_jason_landing/` (the `.dc.html` there is the design reference).

## Run

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # -> dist/
npm run preview
```

## Deploy to Vercel

Import the repo in Vercel and set the **Root Directory** to `jason-landing`. The Astro preset is
auto-detected (`astro build`, output `dist/`). `vercel.json` adds immutable cache headers for
hashed assets. Once the domain is known, set `site` in `astro.config.mjs` for the canonical URL.

## Content still to fill

Everything the handoff lists as open lives in [`src/content/site.ts`](src/content/site.ts):

| Key                 | What it is                                             | Currently             |
| ------------------- | ------------------------------------------------------ | --------------------- |
| `email`             | Both `Email me` CTAs and the dock's `Let's talk`       | set                   |
| `resumeUrl`         | Resume pill in the close section and the dock          | `/Alicia-Wibawa-Resume.pdf` (in `public/`) |
| `linkedinUrl`       | LinkedIn button in the dock                            | set                   |
| `migrationBaseline` | The `[X]` before-figure in "The AI question"           | `[X]`                 |
| `reduceMotion`      | Force reduced motion (OS preference is always honoured) | `false`              |
| `work`              | Work card names, pill qualifiers, links, crop anchors, `featured.pan` | Komo and Study Vision need URLs |

## Imagery

Sized crops live in `src/assets/` and are mapped to slots in [`src/content/images.ts`](src/content/images.ts).
Originals (full-page captures, device mockups, screen recordings) are in `raw-assets/`, which is
git-ignored. A slot left undefined renders the striped placeholder with its mono caption.

The `Media` component emits `<picture>` with AVIF + WebP sources, explicit `width`/`height`,
`loading="lazy"` below the fold and `fetchpriority="high"` for the hero. `position` sets the
cover crop anchor; `pan` slowly pans a tall page capture inside its frame (on for the featured card).

All slots are filled: hero fan ×4 (device mockups) · hero note thumb · work featured (Study Vision,
panning) · work grid ×6 · arc ×6 · process ×5 (mockups + Glue Club) · dock photo and avatar.

## Where things are

```
src/
  pages/index.astro        section order
  layouts/Base.astro       head: fonts (preconnect + Latin subset, swap), meta, the js/reduced flag
  styles/global.css        tokens + every section's CSS, inlined at build
  scripts/page.ts          the single scroll module (one IntersectionObserver)
  components/
    Media.astro            placeholder / <picture> slot
    Hero, Intro, WhyMe, AiQuestion, Work, Process, Numbers, Close, Dock
  content/site.ts          copy and links to fill
  content/images.ts        image slot map
```

## Performance

Build output is a single HTML document: CSS (~4.7 KB gz) and the scroll module (~1.4 KB gz) are
inlined, so first paint needs only the fonts. No motion library, no client routing, no analytics.
Entrance states are gated on `html.js:not(.reduced)`, so the page is fully visible with JS off
and with `prefers-reduced-motion`. Counters reserve their final width before counting (CLS 0).
