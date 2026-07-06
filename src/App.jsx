import { useEffect } from 'react'
import { CrtOverlay } from './components/CrtOverlay'
import { SignalArtwork } from './components/SignalArtwork'
import { Terminal } from './components/Terminal'
import { useExperience } from './hooks/useExperience'
import { useReducedMotion } from './hooks/useReducedMotion'
import './App.css'

function App() {
  const reducedMotion = useReducedMotion()
  const { experience, revealContact } = useExperience(reducedMotion)
  useEffect(() => {
    const interact = (event) => {
      if (event.type === 'keydown' && ['Alt', 'Control', 'Meta', 'Shift'].includes(event.key)) return
      revealContact()
    }
    window.addEventListener('pointerdown', interact)
    window.addEventListener('keydown', interact)

    return () => {
      window.removeEventListener('pointerdown', interact)
      window.removeEventListener('keydown', interact)
    }
  }, [reducedMotion, revealContact])

  const variables = {
    '--object-opacity': experience.object.opacity,
    '--noise-opacity': experience.crt.noise,
    '--scanline-opacity': experience.crt.scanlines,
    '--glitch-intensity': experience.crt.glitches,
    '--signal-pixel-opacity': Math.min(
      1,
      experience.signal.pixel * 0.84 + experience.signal.rupture * 0.42,
    ),
    '--signal-outline-opacity': Math.min(
      1,
      experience.signal.outline * 0.82 + experience.signal.rupture * 0.48,
    ),
    '--signal-colour-pixel-opacity': Math.min(
      1,
      experience.signal.colourPixel * 0.78 + experience.signal.rupture * 0.36,
    ),
    '--signal-shift-x': `${experience.signal.rupture * experience.signal.ruptureDirection * 18}px`,
    '--signal-shift-y': `${experience.signal.rupture * -6}px`,
    '--signal-skew': `${experience.signal.rupture * experience.signal.ruptureDirection * 2.6}deg`,
    '--signal-pixel-shift-x': `${experience.signal.ruptureDirection * (3 + experience.signal.rupture * 26)}px`,
    '--signal-pixel-shift-y': `${experience.signal.rupture * 7}px`,
    '--signal-outline-shift-x': `${experience.signal.ruptureDirection * (2 + experience.signal.rupture * 20)}px`,
    '--signal-outline-scale': 1.004 + experience.signal.rupture * 0.022,
    '--signal-colour-pixel-shift-x': `${experience.signal.ruptureDirection * (-2 - experience.signal.rupture * 15)}px`,
    '--signal-contrast': 1 + experience.signal.rupture * 1.45,
    '--logo-shift-x': `${experience.signal.rupture * experience.signal.ruptureDirection * -18}px`,
    '--logo-shift-y': `${experience.signal.rupture * 5}px`,
    '--logo-skew': `${experience.signal.rupture * experience.signal.ruptureDirection * -2.4}deg`,
    '--logo-contrast': 1 + experience.signal.rupture * 1.8,
    '--logo-clip-top': `${experience.signal.rupture * 3}%`,
    '--logo-clip-bottom': `${experience.signal.rupture * 5}%`,
    '--object-filter-saturation': 0.08 + experience.object.saturation * 1.25,
    '--object-filter-brightness': 0.72 + experience.object.brightness * 0.34,
    '--object-blur': `${experience.object.blur}px`,
  }

  return (
    <main className="installation" data-state={experience.state} style={variables}>
      <SignalArtwork experience={experience} reducedMotion={reducedMotion} />
      <Terminal experience={experience} />
      <CrtOverlay />
    </main>
  )
}

export default App
