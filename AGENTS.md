# AGENTS.md

Before changing pacing, interaction, or visual language, read [MANIFESTO.md](./MANIFESTO.md) and `docs/DESIGN-PRINCIPLES.md`.

## Cursor Cloud specific instructions

Quiet Objects is a single-page Vite + React 18 app (the animated MCA "Applied Signal Research" landing). Standard commands live in `package.json`:

- `npm run dev` — Vite dev server on http://localhost:5173 (hot reload).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built `dist/`.

Notes for future agents (dependencies are already installed by the startup update script):

- There are **no lint or test scripts** and no ESLint/Prettier/test config in this repo. "Checks" are limited to `npm run build` succeeding.
- The visit variant is chosen randomly (~80% `halo`, ~20% `object`). Force it while developing with `?variant=halo` or `?variant=object` (e.g. http://localhost:5173/?variant=object).
- The intro animation runs on real timers: the contact email + channel links only reveal ~7.6s after load. Under `prefers-reduced-motion` everything reveals immediately.
- Media in `public/assets/` (halo/signal video + object stills) is committed; the app fails visually if those files are missing.
