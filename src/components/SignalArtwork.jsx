import { useEffect, useRef, useState } from 'react'
import { LogoLockup } from './LogoLockup'

const MATCH_FRAME_TIME = 8
const MATCH_LOCK_TIME = 23.7
const LOOP_SECONDS = 90

export function SignalArtwork({ experience, reducedMotion }) {
  const video = useRef(null)
  const pixelVideo = useRef(null)
  const outlineVideo = useRef(null)
  const colourPixelVideo = useRef(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (
      !video.current
      || !pixelVideo.current
      || !outlineVideo.current
      || !colourPixelVideo.current
      || !videoReady
    ) return

    const media = [
      video.current,
      pixelVideo.current,
      outlineVideo.current,
      colourPixelVideo.current,
    ]

    if (reducedMotion) {
      media.forEach((item) => {
        item.pause()
        if (Number.isFinite(item.duration)) item.currentTime = item.duration * 0.95
      })
      return
    }

    const targetTime = experience.elapsed >= MATCH_LOCK_TIME
      ? (MATCH_FRAME_TIME + experience.elapsed - MATCH_LOCK_TIME) % LOOP_SECONDS
      : video.current.currentTime

    if (experience.elapsed >= MATCH_LOCK_TIME && Math.abs(video.current.currentTime - targetTime) > 0.12) {
      video.current.currentTime = targetTime
    }

    media.slice(1).forEach((item) => {
      if (Math.abs(item.currentTime - video.current.currentTime) > 0.08) {
        item.currentTime = video.current.currentTime
      }
    })

    Promise.all(media.map((item) => item.play())).catch(() => setVideoReady(false))
  }, [experience.elapsed, reducedMotion, videoReady])

  return (
    <div className="artwork">
      <div className="identity-lockup">
        <div className="signal-media-frame" aria-hidden="true">
          <video
            ref={video}
            className={`signal-media signal-media--primary ${videoReady ? 'signal-media--ready' : ''}`}
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
          <video
            ref={pixelVideo}
            className={`signal-media signal-media--pixel ${videoReady ? 'signal-media--ready' : ''}`}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex="-1"
          >
            <source src="/assets/signal.webm" type="video/webm" />
            <source src="/assets/signal.mp4" type="video/mp4" />
          </video>
          <video
            ref={outlineVideo}
            className={`signal-media signal-media--outline ${videoReady ? 'signal-media--ready' : ''}`}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex="-1"
          >
            <source src="/assets/signal.webm" type="video/webm" />
            <source src="/assets/signal.mp4" type="video/mp4" />
          </video>
          <video
            ref={colourPixelVideo}
            className={`signal-media signal-media--colour-pixel ${videoReady ? 'signal-media--ready' : ''}`}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex="-1"
          >
            <source src="/assets/signal.webm" type="video/webm" />
            <source src="/assets/signal.mp4" type="video/mp4" />
          </video>
          <img
            src="/assets/signal-match-frame.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-one"
          />
          <img
            src="/assets/resolved-angle-0.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-two"
          />
          <img
            src="/assets/resolved-angle-45.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-three"
          />
          <img
            src="/assets/resolved-angle-90.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-four"
          />
          <img
            src="/assets/resolved-angle-135.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-five"
          />
          <img
            src="/assets/resolved-angle-225.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-six"
          />
          <img
            src="/assets/resolved-angle-270.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-angle signal-media--resolved-angle-seven"
          />
          <img
            src="/assets/resolved-signal.png"
            alt=""
            aria-hidden="true"
            className="signal-media signal-media--resolved-still"
          />
        </div>

      </div>
      <LogoLockup
        visible={experience.identityVisible}
        descriptorVisible={experience.divisionVisible}
        calibrating={experience.identityCalibrating}
      />
    </div>
  )
}
