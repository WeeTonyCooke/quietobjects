import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { EXPERIENCE_TIMING } from '../experience/timeline'

const RibbonScene = lazy(() =>
  import('./RibbonScene').then((module) => ({ default: module.RibbonScene })),
)

export function SignalVideo({ experience, reducedMotion, pointer }) {
  const [videoReady, setVideoReady] = useState(false)
  const video = useRef(null)

  useEffect(() => {
    if (!video.current || !videoReady) return

    if (reducedMotion) {
      video.current.pause()
      if (Number.isFinite(video.current.duration)) {
        video.current.currentTime = video.current.duration * EXPERIENCE_TIMING.media.reducedMotionFrame
      }
      return
    }

    video.current.play().catch(() => {})
  }, [reducedMotion, videoReady])

  return (
    <div className="signal" aria-hidden="true">
      <video
        ref={video}
        className={`signal__video ${videoReady ? 'signal__video--ready' : ''}`}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setVideoReady(true)}
      >
        <source src="/assets/signal.webm" type="video/webm" />
        <source src="/assets/signal.mp4" type="video/mp4" />
      </video>

      <div className={`signal__fallback ${videoReady ? 'signal__fallback--hidden' : ''}`}>
        <Suspense fallback={null}>
          <RibbonScene experience={experience} reducedMotion={reducedMotion} pointer={pointer} />
        </Suspense>
      </div>
    </div>
  )
}
