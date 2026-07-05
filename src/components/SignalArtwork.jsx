import { useEffect, useRef, useState } from 'react'
import { LogoLockup } from './LogoLockup'

export function SignalArtwork({ experience, reducedMotion }) {
  const video = useRef(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (!video.current || !videoReady) return

    if (reducedMotion) {
      video.current.pause()
      if (Number.isFinite(video.current.duration)) {
        video.current.currentTime = video.current.duration * 0.95
      }
      return
    }

    video.current.play().catch(() => setVideoReady(false))
  }, [reducedMotion, videoReady])

  return (
    <div className="artwork">
      <div className="identity-lockup">
        <div className="signal-media-frame" aria-hidden="true">
          <video
            ref={video}
            className={`signal-media ${videoReady ? 'signal-media--ready' : ''}`}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          >
            <source src="/assets/signal.webm" type="video/webm" />
            <source src="/assets/signal.mp4" type="video/mp4" />
          </video>
        </div>

      </div>
      <LogoLockup
        visible={experience.identityVisible}
        descriptorVisible={experience.divisionVisible}
      />
    </div>
  )
}
