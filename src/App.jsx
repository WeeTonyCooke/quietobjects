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
    '--signal-outline-opacity': Math.min(
      1,
      experience.signal.outline * 0.68 + experience.signal.rupture * 0.58,
    ),
    '--signal-shift-x': `${experience.signal.rupture * experience.signal.ruptureDirection * 18}px`,
    '--signal-shift-y': `${experience.signal.rupture * -5}px`,
    '--signal-skew': `${experience.signal.rupture * experience.signal.ruptureDirection * 2.2}deg`,
    '--signal-outline-shift-x': `${experience.signal.ruptureDirection * (2 + experience.signal.rupture * 17)}px`,
    '--signal-outline-scale': 1.004 + experience.signal.rupture * 0.018,
    '--signal-contrast': 1 + experience.signal.rupture * 1.45,
    '--logo-shift-x': `${experience.signal.rupture * experience.signal.ruptureDirection * -16}px`,
    '--logo-shift-y': `${experience.signal.rupture * 4}px`,
    '--logo-skew': `${experience.signal.rupture * experience.signal.ruptureDirection * -2}deg`,
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
