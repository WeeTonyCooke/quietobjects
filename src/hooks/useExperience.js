import { useCallback, useEffect, useRef, useState } from 'react'
import { snapshotAt, TIMELINE_END } from '../experience/timeline'

const RECOVERY_SEEN_KEY = 'quiet-objects:recovery-seen'

function hasSeenRecovery() {
  try {
    return window.localStorage.getItem(RECOVERY_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function rememberRecovery() {
  try {
    window.localStorage.setItem(RECOVERY_SEEN_KEY, '1')
  } catch {
    // Storage can be unavailable in private browsing; the experience still works.
  }
}

export function useExperience(reducedMotion) {
  const skipIntro = useRef(reducedMotion || hasSeenRecovery())
  const contactRequested = useRef(false)
  const contactStartedAt = useRef(null)
  const latest = useRef(snapshotAt(skipIntro.current ? TIMELINE_END : 0, { reducedMotion }))
  const [experience, setExperience] = useState(latest.current)
  const [contactRun, setContactRun] = useState(0)
  const contactChoreographySeconds = 4.2

  const revealContact = useCallback(() => {
    if (contactRequested.current) return
    contactRequested.current = true
    if (latest.current.contactAvailable) contactStartedAt.current = performance.now()
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
    if (skipIntro.current) return undefined

    const startedAt = performance.now()
    let frame

    const update = (now) => {
      const elapsed = reducedMotion ? TIMELINE_END : (now - startedAt) / 1000
      const contactElapsed = contactStartedAt.current
        ? (now - contactStartedAt.current) / 1000
        : 0
      if (contactRequested.current && latest.current.contactAvailable && !contactStartedAt.current) {
        contactStartedAt.current = now
      }
      const next = snapshotAt(elapsed, {
        contactElapsed,
        contactRequested: contactRequested.current,
        reducedMotion,
      })
      latest.current = next
      setExperience(next)

      if (!reducedMotion && elapsed < TIMELINE_END) {
        frame = requestAnimationFrame(update)
      } else {
        rememberRecovery()
      }
    }

    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [reducedMotion])

  useEffect(() => {
    if (contactRun === 0) return undefined

    let frame
    const updateContact = (now) => {
      const contactElapsed = contactStartedAt.current
        ? (now - contactStartedAt.current) / 1000
        : 0
      const next = snapshotAt(latest.current.elapsed, {
        contactElapsed,
        contactRequested: true,
        reducedMotion,
      })
      latest.current = next
      setExperience(next)

      if (!contactStartedAt.current || contactElapsed < contactChoreographySeconds) {
        frame = requestAnimationFrame(updateContact)
      }
    }

    frame = requestAnimationFrame(updateContact)
    return () => cancelAnimationFrame(frame)
  }, [contactRun, reducedMotion])

  return { experience, revealContact }
}
