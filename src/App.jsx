import { useEffect, useRef, useState } from 'react'
import { CrtOverlay } from './components/CrtOverlay'
import { useReducedMotion } from './hooks/useReducedMotion'

const MCA_PATHS = [
  'M327 197L297 252L228 105L102 381L0 381L181 9L275 9L279 13L345 151Z',
  'M366 381L267 381L267 376C300 300 340 150 420 70C460 30 510 0 562 0C630 0 690 30 726 58L726 62L672 120C650 102 610 80 562 81C530 82 500 110 483 137C460 175 420 280 366 381Z',
  'M625 310L641 303L669 272L789 13L793 9L884 9L1065 381L966 381L932 309L771 309L805 237L900 237L840 105L834 109L738 323L698 366L672 381L489 381L460 366L420 329L420 322L462 231L492 278L532 309L562 318L602 318Z',
]

/** Demo transmissions — industry labels, not portfolio chrome. */
const CHANNELS = [
  { label: 'GOLF', href: 'https://mossyglen-golf-demo.netlify.app' },
  { label: 'TAXI', href: 'https://quaycars-demo.netlify.app' },
  { label: 'TRADE', href: 'https://northshoredecorating-demo.netlify.app' },
]

/**
 * Soft signal plays, then:
 * glitch → brief movie flash → glitch → recovered mark.
 */
const ACQUIRE_AT = 2.0
const ACQUIRE_DURATION = 2.65
const MCA_CALIBRATION_DURATION = 3.4
const CONTACT_REVEAL_AT = 7.6
const HALO_WEIGHT = 0.8

function pickVariant() {
  if (typeof window === 'undefined') return 'halo'

  const forced = new URLSearchParams(window.location.search).get('variant')
  if (forced === 'halo' || forced === 'object') return forced

  return Math.random() < HALO_WEIGHT ? 'halo' : 'object'
}

function McaTraceLogo() {
  const svgRef = useRef(null)

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('.mca-logo__trace-path')

    paths?.forEach((path) => {
      path.style.setProperty('--path-length', String(path.getTotalLength()))
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      className="mca-logo"
      viewBox="0 0 1065 381"
      role="img"
      aria-label="MCA"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id="mca-spectrum" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffe14a" />
          <stop offset="20%" stopColor="#6dff86" />
          <stop offset="45%" stopColor="#45f0ff" />
          <stop offset="70%" stopColor="#6b8cff" />
          <stop offset="100%" stopColor="#ff5ad4" />
        </linearGradient>
        <linearGradient id="mca-sweep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="38%" stopColor="#fff6ba" stopOpacity=".08" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity=".72" />
          <stop offset="62%" stopColor="#effdff" stopOpacity=".1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id="mca-sweep-mask">
          <rect width="1065" height="381" fill="black" />
          <g fill="white" fillRule="evenodd">
            {MCA_PATHS.map((path) => (
              <path key={`mask-${path}`} d={path} />
            ))}
          </g>
        </mask>
        <clipPath id="mca-left-right-clip" clipPathUnits="userSpaceOnUse">
          <rect className="mca-logo__trace-window" x="0" y="0" width="1065" height="381" />
        </clipPath>
        <filter id="mca-spark" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="mca-logo__fill" fillRule="evenodd">
        {MCA_PATHS.map((path) => (
          <path key={`fill-${path}`} d={path} />
        ))}
      </g>

      <g className="mca-logo__edge" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {MCA_PATHS.map((path) => (
          <path key={`edge-${path}`} d={path} pathLength="1" />
        ))}
      </g>

      <g
        className="mca-logo__spectrum"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {MCA_PATHS.map((path) => (
          <path key={`spectrum-${path}`} d={path} pathLength="1" />
        ))}
      </g>

      <rect
        className="mca-logo__sweep"
        x="-360"
        y="0"
        width="360"
        height="381"
        fill="url(#mca-sweep-gradient)"
        mask="url(#mca-sweep-mask)"
      />

      <g
        className="mca-logo__trace"
        clipPath="url(#mca-left-right-clip)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {MCA_PATHS.map((path, index) => (
          <path
            key={`trace-${path}`}
            className={`mca-logo__trace-path mca-logo__trace-path--${index + 1}`}
            d={path}
          />
        ))}
      </g>
    </svg>
  )
}

export function App() {
  const reducedMotion = useReducedMotion()
  const videoRef = useRef(null)
  const [variant] = useState(pickVariant)
  const isHalo = variant === 'halo'
  const [phase, setPhase] = useState(reducedMotion ? 'locked' : 'signal')
  const [calibrating, setCalibrating] = useState(false)
  const [idleHit, setIdleHit] = useState(0)
  const [contactRevealed, setContactRevealed] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) {
      setPhase('locked')
      setCalibrating(false)
      setContactRevealed(true)
      return undefined
    }

    const video = videoRef.current
    if (video) {
      video.playbackRate = 0.85
      video.play().catch(() => {})
    }

    const acquire = window.setTimeout(() => {
      setPhase('acquire')
      setCalibrating(true)
    }, ACQUIRE_AT * 1000)
    const lock = window.setTimeout(
      () => setPhase('locked'),
      (ACQUIRE_AT + ACQUIRE_DURATION) * 1000,
    )
    const calibrated = window.setTimeout(
      () => setCalibrating(false),
      (ACQUIRE_AT + MCA_CALIBRATION_DURATION) * 1000,
    )
    const contact = window.setTimeout(() => setContactRevealed(true), CONTACT_REVEAL_AT * 1000)

    return () => {
      window.clearTimeout(acquire)
      window.clearTimeout(lock)
      window.clearTimeout(calibrated)
      window.clearTimeout(contact)
    }
  }, [reducedMotion])

  useEffect(() => {
    const video = videoRef.current
    if (phase !== 'locked' || !video || reducedMotion) return

    // Object hard-locks to the still; halo keeps its designed micro-breath.
    if (isHalo) {
      video.playbackRate = 0.85
      video.play().catch(() => {})
      return
    }

    video.pause()
  }, [phase, reducedMotion, isHalo])

  useEffect(() => {
    if (phase !== 'locked' || reducedMotion) return undefined

    let cancelled = false
    let timer

    const schedule = () => {
      const delay = 7000 + Math.random() * 11000
      timer = window.setTimeout(() => {
        if (cancelled) return
        setIdleHit((value) => value + 1)
        timer = window.setTimeout(() => {
          if (cancelled) return
          setIdleHit(0)
          schedule()
        }, 740)
      }, delay)
    }

    schedule()

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [phase, reducedMotion])

  const shellClass = [
    'page-shell',
    `page-shell--${variant}`,
    `page-shell--${phase}`,
    calibrating ? 'page-shell--calibrating' : '',
    idleHit > 0 ? 'page-shell--idle-hit' : '',
    reducedMotion ? 'page-shell--reduced' : '',
    contactRevealed ? 'page-shell--contact' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const videoSources = isHalo
    ? [
        { src: '/assets/halo.webm', type: 'video/webm' },
        { src: '/assets/halo.mp4', type: 'video/mp4' },
      ]
    : [
        { src: '/assets/signal.webm', type: 'video/webm' },
        { src: '/assets/signal.mp4', type: 'video/mp4' },
      ]

  return (
    <main
      className={shellClass}
      aria-labelledby="quiet-objects-title"
      data-variant={variant}
      data-idle-hit={idleHit || undefined}
    >
      {!isHalo && !reducedMotion && (
        <video
          ref={videoRef}
          className="signal-video"
          muted
          playsInline
          preload="auto"
          loop
          aria-hidden="true"
        >
          {videoSources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}

      <div className="acquire-burst" aria-hidden="true">
        <span className="acquire-burst__slice acquire-burst__slice--1" />
        <span className="acquire-burst__slice acquire-burst__slice--2" />
        <span className="acquire-burst__slice acquire-burst__slice--3" />
        <span className="acquire-burst__slice acquire-burst__slice--4" />
        <span className="acquire-burst__rgb acquire-burst__rgb--r" />
        <span className="acquire-burst__rgb acquire-burst__rgb--g" />
        <span className="acquire-burst__rgb acquire-burst__rgb--b" />
        <span className="acquire-burst__bar acquire-burst__bar--1" />
        <span className="acquire-burst__bar acquire-burst__bar--2" />
        <span className="acquire-burst__bar acquire-burst__bar--3" />
        <span className="acquire-burst__phosphor" />
        <span className="acquire-burst__negative" />
      </div>

      <div className="idle-burst" aria-hidden="true" key={idleHit || 'idle-0'}>
        <span className="idle-burst__slice idle-burst__slice--1" />
        <span className="idle-burst__slice idle-burst__slice--2" />
        <span className="idle-burst__rgb idle-burst__rgb--r" />
        <span className="idle-burst__rgb idle-burst__rgb--b" />
        <span className="idle-burst__bar" />
      </div>

      <nav
        className={`channel-stack${contactRevealed ? ' channel-stack--visible' : ''}`}
        aria-label="Channels"
        aria-hidden={!contactRevealed}
      >
        {CHANNELS.map((channel) => (
          <a
            key={channel.label}
            className="channel-stack__link"
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={contactRevealed ? 0 : -1}
          >
            {channel.label}
          </a>
        ))}
      </nav>

      <section className="lockup" aria-label="Quiet Objects">
        {isHalo ? (
          <div className="signal-mark signal-mark--halo" aria-hidden="true">
            {reducedMotion ? (
              <img className="signal-still" src="/assets/halo-still.png" alt="" />
            ) : (
              <video
                ref={videoRef}
                className="signal-video"
                muted
                playsInline
                preload="auto"
                loop
                aria-hidden="true"
              >
                {videoSources.map((source) => (
                  <source key={source.src} src={source.src} type={source.type} />
                ))}
              </video>
            )}
          </div>
        ) : (
          <div className="signal-mark" aria-hidden="true">
            {!reducedMotion && (
              <>
                <img
                  className="signal-mark__image signal-mark__image--punch-a"
                  src="/assets/quiet-object-black-0.png"
                  alt=""
                />
                <img
                  className="signal-mark__image signal-mark__image--punch-b"
                  src="/assets/quiet-object-black-45.png"
                  alt=""
                />
                <img
                  className="signal-mark__image signal-mark__image--punch-c"
                  src="/assets/quiet-object-black-225.png"
                  alt=""
                />
                <img
                  className="signal-mark__image signal-mark__image--phosphor"
                  src="/assets/quiet-object-black-45.png"
                  alt=""
                />
                <img
                  className="signal-mark__image signal-mark__image--negative"
                  src="/assets/quiet-object-black-0.png"
                  alt=""
                />
                <img
                  className="signal-mark__image signal-mark__image--idle-a"
                  src="/assets/quiet-object-black-45.png"
                  alt=""
                />
                <img
                  className="signal-mark__image signal-mark__image--idle-b"
                  src="/assets/quiet-object-black-225.png"
                  alt=""
                />
              </>
            )}
            <img
              className="signal-mark__image signal-mark__image--final"
              src="/assets/quiet-object-black-315.png"
              alt=""
            />
          </div>
        )}

        <div className="mca-lockup">
          <h1 id="quiet-objects-title" className="mca-heading">
            <McaTraceLogo />
          </h1>
          <p className="mca-subtitle">Applied Signal Research</p>
        </div>

        <a
          className={`contact-action${contactRevealed ? ' contact-action--visible' : ''}`}
          href="mailto:hello@quietobjects.ie?subject=Collaborate"
          tabIndex={contactRevealed ? 0 : -1}
          aria-hidden={!contactRevealed}
        >
          hello@quietobjects.ie
        </a>
      </section>

      <CrtOverlay />
    </main>
  )
}
