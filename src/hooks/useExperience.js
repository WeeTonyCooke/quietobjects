import { useCallback, useEffect, useRef, useState } from 'react'
import { EXPERIENCE_END, getExperienceSnapshot } from '../experience/timeline'

export function useExperience(reducedMotion) {
  const contactRequested = useRef(false)
  const latest = useRef(getExperienceSnapshot(0, { reducedMotion }))
  const [experience, setExperience] = useState(latest.current)

  const requestContact = useCallback(() => {
    contactRequested.current = true
    const next = getExperienceSnapshot(latest.current.elapsed, {
      reducedMotion,
      contactRequested: true,
    })
    latest.current = next
    setExperience(next)
  }, [reducedMotion])

  useEffect(() => {
    const startedAt = performance.now()
    let frame

    const update = (now) => {
      const elapsed = reducedMotion ? EXPERIENCE_END : (now - startedAt) / 1000
      const next = getExperienceSnapshot(elapsed, {
        reducedMotion,
        contactRequested: contactRequested.current,
      })

      latest.current = next
      setExperience(next)

      if (!reducedMotion && elapsed < EXPERIENCE_END) {
        frame = requestAnimationFrame(update)
      }
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [reducedMotion])

  return { experience, requestContact }
}
