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
    { at: 1, text: 'signal detected.....' },
    { at: 4, text: 'recovering geometry....' },
    { at: 8, text: 'recovering chroma....' },
    { at: 16, text: 'hello....' },
  ],
  typewriter: {
    characterSeconds: 0.072,
    variationSeconds: 0.034,
  },
  object: {
    emergeStart: 4,
    emergeEnd: 14,
    colourStart: 8,
    colourEnd: 16.35,
    angleOneStart: 18.35,
    angleOneEnd: 18.92,
    angleTwoStart: 19.45,
    angleTwoEnd: 20.08,
    stillStart: 20.45,
    stillEnd: 20.72,
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
  signalRecovery: {
    pixelStart: 1.15,
    pixelPeak: 2.8,
    pixelFade: 5.2,
    pixelEnd: 8.6,
    lineStart: 3.65,
    linePeak: 6.8,
    lineFade: 10.4,
    lineEnd: 16.2,
    colourPixelStart: 7.85,
    colourPixelPeak: 11.4,
    colourPixelFade: 15.2,
    colourPixelEnd: 18.4,
    faults: [
      { at: 1.85, duration: 0.18, amount: 0.26, direction: -1 },
      { at: 2.35, duration: 0.12, amount: 0.18, direction: 1 },
      { at: 4.55, duration: 0.28, amount: 0.48, direction: 1 },
      { at: 5.3, duration: 0.16, amount: 0.32, direction: -1 },
      { at: 8.35, duration: 0.38, amount: 0.68, direction: -1 },
      { at: 10.2, duration: 0.2, amount: 0.38, direction: 1 },
      { at: 16.25, duration: 0.58, amount: 1, direction: 1 },
      { at: 18.22, duration: 0.18, amount: 0.42, direction: -1, screen: 0.55 },
      { at: 19.3, duration: 0.16, amount: 0.5, direction: 1, screen: 0.62 },
      { at: 20.32, duration: 0.32, amount: 0.88, direction: -1, screen: 0.95 },
      { at: 22.25, duration: 0.24, amount: 0.62, direction: -1, screen: 0.48 },
    ],
    contactFaults: [
      { at: 0.25, duration: 0.18, amount: 0.42, direction: 1 },
      { at: 1.15, duration: 0.32, amount: 0.72, direction: -1 },
      { at: 2.05, duration: 0.14, amount: 0.28, direction: 1 },
      { at: 3.15, duration: 0.24, amount: 0.52, direction: 1 },
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

function faultShape(progress) {
  if (progress < 0 || progress >= 1) return { amount: 0, direction: 0 }
  if (progress < 0.16) return { amount: 0.96, direction: -1 }
  if (progress < 0.28) return { amount: 0.18, direction: 1 }
  if (progress < 0.46) return { amount: 1, direction: 1 }
  if (progress < 0.58) return { amount: 0.34, direction: -1 }
  if (progress < 0.78) return { amount: 0.82, direction: -1 }
  if (progress < 0.88) return { amount: 0.08, direction: 1 }
  return { amount: 0.46, direction: -1 }
}

function ruptureAt(elapsed, contactElapsed = 0, contactSequenceStarted = false) {
  const events = [...TIMING.signalRecovery.faults]

  if (contactSequenceStarted) {
    TIMING.signalRecovery.contactFaults.forEach((fault) => {
      events.push({ ...fault, at: elapsed - contactElapsed + fault.at })
    })
  }

  return events.reduce(
    (strongest, fault) => {
      const progress = (elapsed - fault.at) / fault.duration
      const shaped = faultShape(progress)
      const amount = shaped.amount * fault.amount
      const screenAmount = shaped.amount * (fault.screen ?? fault.amount * 0.32)
      if (amount <= strongest.amount && screenAmount <= strongest.screen) return strongest

      return {
        amount: Math.max(strongest.amount, amount),
        direction: shaped.direction * fault.direction,
        screen: Math.max(strongest.screen, screenAmount),
      }
    },
    { amount: 0, direction: 0, screen: 0 },
  )
}

function steppedWindow(elapsed, start, end) {
  if (elapsed < start || elapsed >= end) return 0
  const progress = (elapsed - start) / (end - start)
  if (progress < 0.16) return 0.72
  if (progress < 0.28) return 0.18
  if (progress < 0.78) return 0.95
  if (progress < 0.9) return 0.34
  return 0
}

export function snapshotAt(
  elapsed,
  { contactElapsed = 0, contactRequested = false, reducedMotion = false } = {},
) {
  const time = reducedMotion ? 24.5 : Math.max(0, elapsed)
  const emergence = smoothstep(time, TIMING.object.emergeStart, TIMING.object.emergeEnd)
  const colour = smoothstep(time, TIMING.object.colourStart, TIMING.object.colourEnd)
  const angleOne = reducedMotion
    ? 0
    : steppedWindow(time, TIMING.object.angleOneStart, TIMING.object.angleOneEnd)
  const angleTwo = reducedMotion
    ? 0
    : steppedWindow(time, TIMING.object.angleTwoStart, TIMING.object.angleTwoEnd)
  const still = smoothstep(time, TIMING.object.stillStart, TIMING.object.stillEnd)
  const contactAvailable = time >= TIMING.contactAvailable
  const contactSequenceStarted = contactAvailable && contactRequested
  const contactVisible = contactSequenceStarted && contactElapsed >= TIMING.contactRevealDelay
  const identityVisible = time >= TIMING.identityReveal
  const divisionVisible = time >= TIMING.divisionReveal
  const recovery = smoothstep(time, TIMING.states.SIGNAL, TIMING.states.STABLE)
  const settling = smoothstep(time, TIMING.states.RESOLVE, TIMING.states.HELLO)
  const outlineBuild = smoothstep(
    time,
    TIMING.signalRecovery.lineStart,
    TIMING.signalRecovery.linePeak,
  )
  const outlineDecay = 1 - smoothstep(
    time,
    TIMING.signalRecovery.lineFade,
    TIMING.signalRecovery.lineEnd,
  )
  const pixelBuild = smoothstep(
    time,
    TIMING.signalRecovery.pixelStart,
    TIMING.signalRecovery.pixelPeak,
  )
  const pixelDecay = 1 - smoothstep(
    time,
    TIMING.signalRecovery.pixelFade,
    TIMING.signalRecovery.pixelEnd,
  )
  const colourPixelBuild = smoothstep(
    time,
    TIMING.signalRecovery.colourPixelStart,
    TIMING.signalRecovery.colourPixelPeak,
  )
  const colourPixelDecay = 1 - smoothstep(
    time,
    TIMING.signalRecovery.colourPixelFade,
    TIMING.signalRecovery.colourPixelEnd,
  )
  const pixel = reducedMotion ? 0 : pixelBuild * pixelDecay * (0.32 + integrityAt(time) * 0.5)
  const outline = reducedMotion ? 0 : outlineBuild * outlineDecay * (0.52 + integrityAt(time) * 0.48)
  const colourPixel = reducedMotion ? 0 : colourPixelBuild * colourPixelDecay * (0.45 + colour * 0.45)
  const rupture = reducedMotion
    ? { amount: 0, direction: 0 }
    : ruptureAt(time, contactElapsed, contactSequenceStarted)

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
      angleOne,
      angleTwo,
      still,
    },
    signal: {
      pixel,
      outline,
      colourPixel,
      rupture: rupture.amount,
      ruptureDirection: rupture.direction,
      screen: rupture.screen,
    },
    crt: {
      noise: reducedMotion ? 0.012 : 0.02 + recovery * 0.018 - settling * 0.008,
      scanlines: reducedMotion ? 0.32 : 0.42 + recovery * 0.14,
      glitches: reducedMotion ? 0 : clamp(recovery * 0.72 - settling * 0.22),
    },
  }
}

export const TIMELINE_END = 24.5
