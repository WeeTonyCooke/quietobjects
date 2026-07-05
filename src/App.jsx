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
