# Quiet Objects

Single-screen Vite + React landing site. Before changing pacing, interaction, or visual language, read `MANIFESTO.md` and `docs/DESIGN-PRINCIPLES.md`.

## Cursor Cloud specific instructions

Service: one Vite/React SPA. Scripts are in `package.json` (`dev`, `build`, `preview`). There is no lint or test script and no test suite.

- Dev server: `npm run dev` (Vite, serves on `http://localhost:5173`). This is the command to use during development — not `npm run build`.
- Production build / preview: `npm run build` then `npm run preview`.
- Node 22 works (repo has no `.nvmrc`; any modern Node 18+ is fine).
- The landing plays a timed CRT "acquire" animation (~8s) and then reveals the `hello@quietobjects.ie` contact link. Force a path while developing with `?variant=halo` or `?variant=object`. `prefers-reduced-motion` skips the animation and shows the locked state immediately.
- Media in `public/assets/` (halo/signal `.webm`/`.mp4`, `quiet-object-black-*.png`) is required for the animation; the served page is mostly blank without it.
