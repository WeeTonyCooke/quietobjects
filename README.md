# Quiet Objects

Single-screen landing for MCA Applied Signal Research: soft signal recovery, CRT acquire, MCA calibration, and a quiet contact reveal.

Each visit picks a weighted sequence:

- **Halo** (~80%) — soft spectral halo that keeps its micro-breath after lock
- **Object** (~20%) — quiet-object still recovery

Force either path while developing with `?variant=halo` or `?variant=object`.

Before changing pacing, interaction, or visual language, read [MANIFESTO.md](./MANIFESTO.md).

## Run locally

```bash
npm install
npm run dev
```

## Assets

Required files in `public/assets/`:

- `halo.webm` / `halo.mp4` / `halo-still.png` — primary spectral halo sequence
- `signal.webm` / `signal.mp4` — quiet-object soft underlayer
- `quiet-object-black-*.png` — hi-fi stills for the object acquire / lock path

## Deploy

Connect the repository in Netlify. `netlify.toml` builds with `npm run build` and publishes `dist`.
