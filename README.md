# Mello — A brighter kind of coffee break

Pixel-accurate React + TypeScript implementation of the **Mello** specialty
coffee landing page: hero, product grid, full menu, mood wheel, opening hours,
philosophy receipt, atmosphere explorer, testimonials carousel and visit/footer
sections, with the same layout and motion as the reference design.

## Stack

- **Vite 7** + **React 19** + **TypeScript 5.9**
- **Tailwind CSS 3** for design tokens (layout is hand-written CSS)
- Self-hosted fonts: Londrina Solid, Gochi Hand, Inter

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm run preview    # preview the build
```

## Project structure

```
src/
  app/App.tsx          page composition (sections + tickers)
  sections/            one component per page section
  components/Marquee   CSS-driven infinite marquee used by the tickers
  hooks/useMediaQuery  shared breakpoint hook
  styles/index.css     design tokens, @font-face, base reset
  styles/sections.css  all section layout, responsive and motion CSS
  assets/              self-hosted fonts and section artwork
```

## Responsive & motion

- Breakpoints: mobile `<= 767.98px`, tablet `768–1199.98px`, desktop `>= 1200px`.
- Entrance and scroll-reveal animations are driven by `IntersectionObserver`
  (`.is-in` classes).
- Everything is neutralised under `prefers-reduced-motion: reduce`.

## Deployment

The build honours a configurable base path so it can be served from a
subdirectory:

```bash
BASE=/mello/ npm run build
# copy the emitted files (default: dist/) to your web root
```

## A note on the Git history

This repository was reconstructed from a single working snapshot. The commits
are organised by feature and concern for readability and review, but their
order and timestamps reflect the reconstruction, **not** the original
chronological development of the project. See `docs/reconstruction-notes.md`.

## License

Proprietary. All rights reserved.
