import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './McaEmailLogo.css'

const EMAIL_HREF = 'mailto:hello@quietobjects.ie?subject=Collaborate'
const TRACE_DURATION_MS = 320

export function McaEmailLogo({ className = '' }) {
  const reducedMotion = useReducedMotion()
  const [tracing, setTracing] = useState(false)

  useEffect(() => {
    if (!tracing) return undefined

    const timer = window.setTimeout(() => {
      setTracing(false)
      window.location.href = EMAIL_HREF
    }, TRACE_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [tracing])

  const handleClick = (event) => {
    if (reducedMotion) return

    event.preventDefault()
    if (!tracing) setTracing(true)
  }

  return (
    <footer className={`mca-email-credit ${className}`.trim()}>
      <a
        className={`mca-email-credit__link ${tracing ? 'mca-email-credit__link--tracing' : ''}`}
        href={EMAIL_HREF}
        aria-label="Email MCA"
        onClick={handleClick}
      >
        <span className="mca-email-credit__mark" aria-hidden="true">
          <img
            className="mca-email-credit__logo"
            src="/assets/mca-logo-white.svg"
            alt=""
          />
          <span className="mca-email-credit__trace" />
        </span>
        <span className="mca-email-credit__caption">Website by MCA</span>
      </a>
    </footer>
  )
}
