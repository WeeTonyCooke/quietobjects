# Quiet Objects

A single-screen React landing page with a TouchDesigner video layer, slow CRT signal recovery, terminal typewriter, and minimal contact interaction. The procedural Three.js ribbon is a temporary fallback until the final video exports are supplied.

Before changing the behaviour, pacing, interaction, or visual language of this project, read [MANIFESTO.md](./MANIFESTO.md).

## Run locally

```bash
npm install
npm run dev
```

## Customise

Replace `hello@yourdomain.com` in `src/components/ContactReveal.jsx` when the final contact address is available.

Add the TouchDesigner renders as `public/assets/signal.webm` and `public/assets/signal.mp4`. Until then, the colour transition runs from roughly 9–46 seconds in the procedural fallback. Motion, video playback, typewriter timing, CRT overlays, and mobile layout respect `prefers-reduced-motion` and viewport size.

## Deploy to Netlify

Connect the repository in Netlify. The included `netlify.toml` builds with `npm run build` and publishes `dist`.
