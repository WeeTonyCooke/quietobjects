import { useCallback, useEffect, useRef, useState } from 'react'
import { snapshotAt, TIMELINE_END } from '../experience/timeline'

export function useExperience(reducedMotion) {
  const contactRequested = useRef(false)
  const contactStartedAt = useRef(null)
  const latest = useRef(snapshotAt(0, { reducedMotion }))
  const [experience, setExperience] = useState(latest.current)
  const [contactRun, setContactRun] = useState(0)
  const contactChoreographySeconds = 4.2

  const revealContact = useCallback(() => {
    if (!latest.current.contactAvailable || contactRequested.current) return
    contactRequested.current = true
    contactStartedAt.current = performance.now()
    const next = snapshotAt(latest.current.elapsed, {
      contactElapsed: 0,
      contactRequested: true,
      reducedMotion,
    })
    latest.current = next
    setExperience(next)
    setContactRun((run) => run + 1)
  }, [reducedMotion])

  useEffect(() => {
    const startedAt = performance.now()
    let frame

    const update = (now) => {
      const elapsed = reducedMotion ? TIMELINE_END : (now - startedAt) / 1000
      const contactElapsed = contactStartedAt.current
        ? (now - contactStartedAt.current) / 1000
        : 0
      const next = snapshotAt(elapsed, {
        contactElapsed,
        contactRequested: contactRequested.current,
        reducedMotion,
      })
      latest.current = next
      setExperience(next)

      if (!reducedMotion && elapsed < TIMELINE_END) frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [reducedMotion])

  useEffect(() => {
    if (contactRun === 0) return undefined

    let frame
    const updateContact = (now) => {
      const contactElapsed = (now - contactStartedAt.current) / 1000
      const next = snapshotAt(latest.current.elapsed, {
        contactElapsed,
        contactRequested: true,
        reducedMotion,
      })
      latest.current = next
      setExperience(next)

      if (contactElapsed < contactChoreographySeconds) frame = requestAnimationFrame(updateContact)
    }

    frame = requestAnimationFrame(updateContact)
    return () => cancelAnimationFrame(frame)
  }, [contactRun, reducedMotion])

  return { experience, revealContact }
}
