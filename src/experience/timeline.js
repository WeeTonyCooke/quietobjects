export const EXPERIENCE_TIMING = Object.freeze({
  states: {
    VOID: 0,
    LISTEN: 0.35,
    SIGNAL: 0.9,
    RECOVER: 2.4,
    RESOLVE: 9,
    STABLE: 13.5,
    HELLO: 15.5,
  },
  terminal: {
    message: "If you’ve found this page,\nyou probably know why you’re here.",
    start: 0.9,
    characterSeconds: 0.094,
    characterVariation: 0.036,
    commaPause: 0.42,
    linePause: 0.52,
  },
  object: {
    emergeStart: 2.4,
    emergeEnd: 15.4,
    colourStart: 9,
    colourEnd: 46,
    maximumOpacity: 0.72,
    integrity: [
      [2.4, 0],
      [3.1, 0.03],
      [3.24, 0.16],
      [3.34, 0.025],
      [4.55, 0.1],
      [4.72, 0.3],
      [4.84, 0.07],
      [6.05, 0.18],
      [6.25, 0.43],
      [6.48, 0.16],
      [8.5, 0.46],
      [10.8, 0.7],
      [13.5, 1],
    ],
  },
  media: {
    reducedMotionFrame: 0.72,
  },
  contact: {
    available: 16.5,
  },
  crt: {
    quietIntensity: 0.56,
    recoveryIntensity: 1,
    stableIntensity: 0.66,
  },
})

const STATE_ORDER = ['VOID', 'LISTEN', 'SIGNAL', 'RECOVER', 'RESOLVE', 'STABLE', 'HELLO']

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function smoothstep(value, start, end) {
  const progress = clamp((value - start) / (end - start))
  return progress * progress * (3 - 2 * progress)
}

function stateAt(elapsed) {
  return STATE_ORDER.reduce(
    (current, state) => (elapsed >= EXPERIENCE_TIMING.states[state] ? state : current),
    'VOID',
  )
}

function characterDuration(character, index) {
  const timing = EXPERIENCE_TIMING.terminal
  const variation = ((Math.sin(index * 12.9898) + 1) / 2) * timing.characterVariation

  if (character === ',') return timing.commaPause
  if (character === '\n') return timing.linePause
  return timing.characterSeconds + variation
}

function terminalTextAt(elapsed) {
  const { message, start } = EXPERIENCE_TIMING.terminal
  let remaining = elapsed - start

  if (remaining < 0) return ''

  for (let index = 0; index < message.length; index += 1) {
    remaining -= characterDuration(message[index], index)
    if (remaining < 0) return message.slice(0, index + 1)
  }

  return message
}

function integrityAt(elapsed) {
  const keyframes = EXPERIENCE_TIMING.object.integrity

  if (elapsed <= keyframes[0][0]) return keyframes[0][1]

  for (let index = 1; index < keyframes.length; index += 1) {
    const [time, value] = keyframes[index]
    const [previousTime, previousValue] = keyframes[index - 1]

    if (elapsed <= time) {
      const progress = clamp((elapsed - previousTime) / (time - previousTime))
      return previousValue + (value - previousValue) * progress
    }
  }

  return keyframes.at(-1)[1]
}

export function getExperienceSnapshot(elapsed, options = {}) {
  const { reducedMotion = false, contactRequested = false } = options
  const time = reducedMotion ? EXPERIENCE_TIMING.object.colourEnd : Math.max(0, elapsed)
  const baseState = stateAt(time)
  const contactAvailable = time >= EXPERIENCE_TIMING.contact.available
  const contactRevealed = contactAvailable && contactRequested
  const emergence = smoothstep(
    time,
    EXPERIENCE_TIMING.object.emergeStart,
    EXPERIENCE_TIMING.object.emergeEnd,
  )
  const colour = smoothstep(
    time,
    EXPERIENCE_TIMING.object.colourStart,
    EXPERIENCE_TIMING.object.colourEnd,
  )
  const recovery = smoothstep(
    time,
    EXPERIENCE_TIMING.states.SIGNAL,
    EXPERIENCE_TIMING.states.STABLE,
  )
  const settling = smoothstep(
    time,
    EXPERIENCE_TIMING.states.RESOLVE,
    EXPERIENCE_TIMING.states.HELLO,
  )
  const crtIntensity = reducedMotion
    ? EXPERIENCE_TIMING.crt.stableIntensity
    : EXPERIENCE_TIMING.crt.quietIntensity
      + recovery * (EXPERIENCE_TIMING.crt.recoveryIntensity - EXPERIENCE_TIMING.crt.quietIntensity)
      - settling * (EXPERIENCE_TIMING.crt.recoveryIntensity - EXPERIENCE_TIMING.crt.stableIntensity)

  return {
    elapsed: time,
    state: contactRevealed ? 'CONTACT' : baseState,
    terminalText: reducedMotion ? EXPERIENCE_TIMING.terminal.message : terminalTextAt(time),
    contactAvailable,
    contactRevealed,
    object: {
      emergence,
      colour,
      opacity: emergence * EXPERIENCE_TIMING.object.maximumOpacity * integrityAt(time),
      saturation: 0.06 + colour * 0.56,
      brightness: 0.45 + emergence * 0.47,
      contrast: 0.72 + emergence * 0.24,
      blur: (1 - emergence) * 0.7,
    },
    crt: {
      intensity: crtIntensity,
      noise: reducedMotion ? 0.012 : 0.025 + crtIntensity * 0.02,
      scanlines: reducedMotion ? 0.35 : 0.42 + crtIntensity * 0.18,
      glitches: reducedMotion ? 0 : clamp((crtIntensity - 0.5) * 1.35),
    },
  }
}

export const EXPERIENCE_END = EXPERIENCE_TIMING.object.colourEnd
