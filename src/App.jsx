import { useEffect, useRef } from 'react'

const MCA_PATHS = [
  'M327 197L297 252L228 105L102 381L0 381L181 9L275 9L279 13L345 151Z',
  'M366 381L267 381L267 376C300 300 340 150 420 70C460 30 510 0 562 0C630 0 690 30 726 58L726 62L672 120C650 102 610 80 562 81C530 82 500 110 483 137C460 175 420 280 366 381Z',
  'M625 310L641 303L669 272L789 13L793 9L884 9L1065 381L966 381L932 309L771 309L805 237L900 237L840 105L834 109L738 323L698 366L672 381L489 381L460 366L420 329L420 322L462 231L492 278L532 309L562 318L602 318Z',
]

function McaTraceLogo() {
  const svgRef = useRef(null)

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('.mca-logo__trace-path')

    paths?.forEach((path) => {
      path.style.setProperty('--path-length', path.getTotalLength())
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
        <linearGradient id="mca-trace-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff6ba" />
          <stop offset="32%" stopColor="#f8fff1" />
          <stop offset="58%" stopColor="#effdff" />
          <stop offset="82%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#fff0fb" />
        </linearGradient>
        <linearGradient id="mca-sweep-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity=".08" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity=".68" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity=".08" />
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
        <filter id="mca-spark" x="-40%" y="-40%" width="180%" height="180%">
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

      <circle className="mca-logo__spark mca-logo__spark--one" cx="12" cy="372" r="8" />
      <circle className="mca-logo__spark mca-logo__spark--two" cx="562" cy="8" r="7" />
      <circle className="mca-logo__spark mca-logo__spark--three" cx="1048" cy="372" r="9" />
    </svg>
  )
}

export function App() {
  const flashFrames = [
    '/assets/quiet-object-black-0.png',
    '/assets/quiet-object-black-45.png',
    '/assets/quiet-object-black-225.png',
  ]
  const finalFrame = '/assets/quiet-object-black-315.png'

  return (
    <main className="page-shell" aria-labelledby="quiet-objects-title">
      <div className="field-anomaly" aria-hidden="true" />
      <section className="lockup" aria-label="Quiet Objects contact">
        <div className="signal-mark" aria-hidden="true">
          {flashFrames.map((src, index) => (
            <img
              key={src}
              className={`signal-mark__image signal-mark__image--flash signal-mark__image--flash-${index + 1}`}
              src={src}
              alt=""
            />
          ))}
          <img
            className="signal-mark__image signal-mark__image--base"
            src={finalFrame}
            alt=""
          />
          <span className="signal-mark__glitch signal-mark__glitch--primary" />
          <span className="signal-mark__glitch signal-mark__glitch--secondary" />
        </div>

        <div className="mca-lockup">
          <h1 id="quiet-objects-title" className="mca-heading">
            <McaTraceLogo />
          </h1>
          <p className="mca-subtitle">Applied Signal Research</p>
        </div>

        <a className="contact-action" href="mailto:hello@quietobjects.ie?subject=Collaborate">
          <span>Collaborate:</span> hello@quietobjects.ie
        </a>
      </section>
    </main>
  )
}
