export const TIMING = Object.freeze({
  states: {
    VOID: 0,
    SIGNAL: 1,
    RECOVER: 4,
    RESOLVE: 8,
    STABLE: 12.5,
    HELLO: 16,
  },
  messages: [
    { at: 1, text: 'signal detected.' },
    { at: 4, text: 'recovering geometry....' },
    { at: 8, text: 'recovering chroma.....' },
    { at: 12.5, text: 'connection established.' },
    { at: 16, text: 'hello....' },
    { at: 18, text: '....and welcome.' },
  ],
  typewriter: {
    characterSeconds: 0.072,
    variationSeconds: 0.034,
  },
  object: {
    emergeStart: 4,
    emergeEnd: 14,
    colourStart: 8,
    colourEnd: 24,
    maximumOpacity: 0.92,
    integrity: [
      [4, 0],
      [4.8, 0.03],
      [5, 0.16],
      [5.15, 0.025],
      [6.4, 0.12],
      [6.6, 0.34],
      [6.75, 0.07],
      [8.2, 0.26],
      [8.45, 0.5],
      [8.7, 0.2],
      [10.5, 0.52],
      [12.5, 0.78],
      [14, 1],
    ],
  },
  identityReveal: 20.8,
  divisionReveal: 21.5,
  contactAvailable: 20.8,
  contactRevealDelay: 0.75,
})

const STATE_ORDER = ['VOID', 'SIGNAL', 'RECOVER', 'RESOLVE', 'STABLE', 'HELLO']

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value))

function smoothstep(value, start, end) {
  const progress = clamp((value - start) / (end - start))
  return progress * progress * (3 - 2 * progress)
}

function stateAt(elapsed) {
  return STATE_ORDER.reduce(
    (current, state) => (elapsed >= TIMING.states[state] ? state : current),
    'VOID',
  )
}

function characterDuration(index) {
  const variation = ((Math.sin(index * 12.9898) + 1) / 2) * TIMING.typewriter.variationSeconds
  return TIMING.typewriter.characterSeconds + variation
}

function terminalTextAt(elapsed) {
  const messageIndex = TIMING.messages.findLastIndex((message) => elapsed >= message.at)
  if (messageIndex < 0) return ''

  const message = TIMING.messages[messageIndex]
  let remaining = elapsed - message.at
  let visible = ''

  for (let index = 0; index < message.text.length; index += 1) {
    remaining -= characterDuration(index + messageIndex * 31)
    if (remaining < 0) break
    visible += message.text[index]
  }

  return visible
}

function integrityAt(elapsed) {
  const keyframes = TIMING.object.integrity
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

export function snapshotAt(
  elapsed,
  { contactElapsed = 0, contactRequested = false, reducedMotion = false } = {},
) {
  const time = reducedMotion ? TIMING.object.colourEnd : Math.max(0, elapsed)
  const emergence = smoothstep(time, TIMING.object.emergeStart, TIMING.object.emergeEnd)
  const colour = smoothstep(time, TIMING.object.colourStart, TIMING.object.colourEnd)
  const contactAvailable = time >= TIMING.contactAvailable
  const contactSequenceStarted = contactAvailable && contactRequested
  const contactVisible = contactSequenceStarted && contactElapsed >= TIMING.contactRevealDelay
  const identityVisible = time >= TIMING.identityReveal
  const divisionVisible = time >= TIMING.divisionReveal
  const recovery = smoothstep(time, TIMING.states.SIGNAL, TIMING.states.STABLE)
  const settling = smoothstep(time, TIMING.states.RESOLVE, TIMING.states.HELLO)

  return {
    elapsed: time,
    state: contactVisible ? 'CONTACT' : stateAt(time),
    terminalText: contactSequenceStarted || identityVisible
      ? ''
      : reducedMotion
        ? TIMING.messages.at(-1).text
        : terminalTextAt(time),
    contactAvailable,
    contactVisible,
    diagnosticVisible: !identityVisible && !contactSequenceStarted,
    identityVisible,
    divisionVisible,
    object: {
      emergence,
      colour,
      opacity: emergence * integrityAt(time) * TIMING.object.maximumOpacity,
      saturation: 0.03 + colour * 0.52,
      brightness: 0.38 + emergence * 0.45,
      blur: (1 - emergence) * 0.75,
    },
    crt: {
      noise: reducedMotion ? 0.012 : 0.02 + recovery * 0.018 - settling * 0.008,
      scanlines: reducedMotion ? 0.32 : 0.42 + recovery * 0.14,
      glitches: reducedMotion ? 0 : clamp(recovery * 0.72 - settling * 0.22),
    },
  }
}

export const TIMELINE_END = TIMING.object.colourEnd
