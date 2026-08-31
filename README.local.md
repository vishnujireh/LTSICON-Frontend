# LTSICON Chennai 2026 — React + Vite + Tailwind CSS v4

The site rebuilt on **Tailwind CSS v4**, styled to your official maroon + gold +
cream brand theme (from `style.css`). The old external stylesheet is gone — all
styling now flows through the Tailwind pipeline in `src/index.css`.

## How it's built (and why alignment is preserved)
- **Component JSX is unchanged** — same DOM, sections and elements as the working
  build (verified 1:1 earlier). Only the styling layer changed, so nothing shifts.
- `src/index.css` = `@import "tailwindcss"` + a `@theme` block exposing the brand
  palette as Tailwind utilities (`bg-maroon`, `text-gold-bright`, `border-line`,
  `font-head`, …) + the full design system.
- The design system is ported **verbatim** from your `style.css` (every padding,
  gap, radius, font-size and colour copied exactly) plus the approved redesign
  sections. Structural utilities use Tailwind `@apply` (`flex`, `grid`,
  `items-center`, `sticky`, …); bespoke bits (gradients, `::before/::after`,
  `nth-child` card colours, the kolam/heritage art) stay as exact declarations.

## Brand tokens (`@theme`) — usable as Tailwind utilities
`maroon #6E1A2B`, `maroon-deep #4A1220`, `gold #B58A1E`, `gold-dark #8A6A12`,
`gold-bright #C9A227`, `gold-soft #F3E7C6`, `cream #FBF5E9`, `sand #F4ECD9`,
`line #E7D9BB`, `muted #6E5C54` + fonts `font-head` (Playfair) / `font-body` (Inter).

## Run
```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/
npm run preview
```

## Images & fonts
Drop images into `public/assets/images/...` (same paths the markup uses).
Google Fonts are loaded in `index.html`.

## Interactivity
Countdown, hero slideshow, mobile hamburger menu and scroll-spy are React hooks
in `Hero.jsx` / `Header.jsx`.

## Verification status
- All 131 design classes resolve to a definition in `index.css`.
- Every `@apply` uses only core Tailwind utilities (flex, grid, absolute,
  font-body, etc.) — no unknown/arbitrary utilities, so the Tailwind compile is safe.
- `src/styles/supplemental.css` is now unused (kept only for reference); `main.jsx`
  imports `index.css`.
- A full `npm install && npm run build` could not be completed in the authoring
  sandbox (fresh package downloads were blocked/interrupted). Please run it once
  locally — the code uses only standard Tailwind v4 + the tokens above.
