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

  const [angleOne, angleTwo, angleThree, angleFour, angleFive, angleSix] = experience.object.angles

  const variables = {
    '--object-opacity': experience.object.opacity * (1 - experience.object.still),
    '--resolved-angle-one-opacity': angleOne * 0.92,
    '--resolved-angle-two-opacity': angleTwo * 0.92,
    '--resolved-angle-three-opacity': angleThree * 0.92,
    '--resolved-angle-four-opacity': angleFour * 0.92,
    '--resolved-angle-five-opacity': angleFive * 0.92,
    '--resolved-angle-six-opacity': angleSix * 0.92,
    '--resolved-still-opacity': experience.object.still * 0.96,
    '--screen-glitch-opacity': Math.min(1, experience.signal.screen * 0.86),
    '--screen-glitch-shift': `${experience.signal.screen * experience.signal.ruptureDirection * 22}px`,
    '--screen-glitch-shift-inverse': `${experience.signal.screen * experience.signal.ruptureDirection * -13}px`,
    '--resolved-angle-shift-x': `${experience.signal.screen * experience.signal.ruptureDirection * 8}px`,
    '--resolved-angle-skew': `${experience.signal.rupture * experience.signal.ruptureDirection * 1.4}deg`,
    '--glass-sweep-opacity': experience.object.glassSweep * 0.78,
    '--glass-sweep-x': `${-52 + experience.object.glassSweepProgress * 138}%`,
    '--noise-opacity': experience.crt.noise,
    '--scanline-opacity': experience.crt.scanlines,
    '--glitch-intensity': experience.crt.glitches,
    '--signal-pixel-opacity': Math.min(
      1,
      experience.signal.pixel * 0.46 + experience.signal.rupture * 0.24,
    ),
    '--signal-outline-opacity': Math.min(
      1,
      experience.signal.outline * 0.82 + experience.signal.rupture * 0.48,
    ),
    '--signal-colour-pixel-opacity': Math.min(
      1,
      experience.signal.colourPixel * 0.78 + experience.signal.rupture * 0.36,
    ),
    '--signal-shift-x': `${experience.signal.rupture * experience.signal.ruptureDirection * 8}px`,
    '--signal-shift-y': `${experience.signal.rupture * -2}px`,
    '--signal-skew': `${experience.signal.rupture * experience.signal.ruptureDirection * 0.9}deg`,
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
