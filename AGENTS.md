# Quiet Objects

Single-screen animated landing page (Vite + React). See `README.md` for the product
overview and `MANIFESTO.md` before changing pacing, interaction, or visual language.

## Cursor Cloud specific instructions

- Stack: Vite 6 + React 18, static site. Standard scripts live in `package.json`
  (`npm run dev`, `npm run build`, `npm run preview`). No test or lint scripts exist.
- Dev server: `npm run dev` serves on `http://localhost:5173`. Run it from a long-lived
  session (e.g. tmux) since it is a foreground watcher.
- The landing page is time-driven: after load it runs an acquire/lock animation and only
  reveals the `hello@quietobjects.ie` contact link at ~7.6s. Wait for the full sequence
  before judging whether the page "finished".
- Each visit randomly picks a variant (~80% `halo`, ~20% `object`). Force one while
  testing with `?variant=halo` or `?variant=object`. Reduced-motion mode skips the
  animation and shows the locked/contact state immediately.
- Video/image assets under `public/assets/` are committed to the repo; no external
  fetch or credentials are required to run or build.
