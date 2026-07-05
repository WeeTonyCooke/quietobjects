# Quiet Objects

A full-screen digital installation built with React, Three.js, and a central recovery timeline.

Before changing behaviour, pacing, interaction, or visual language, read [MANIFESTO.md](./MANIFESTO.md).

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Adjust pacing

All state boundaries, terminal message timings, typewriter speed, sculpture recovery, colour recovery, and contact availability live in `src/experience/timeline.js`.

The contact email is currently the placeholder `hello@yourdomain.com` in `src/components/Terminal.jsx`.
