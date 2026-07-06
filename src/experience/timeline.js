export const TIMING = Object.freeze({
  playbackRate: 1.47,
  states: {
    VOID: 0,
    SIGNAL: 1,
    RECOVER: 7,
    RESOLVE: 13,
    STABLE: 16.65,
    HELLO: 36.35,
  },
  messages: [
    { at: 1, text: 'signal detected.....' },
    { at: 7, text: 'recovering geometry....' },
    { at: 13, text: 'recovering chroma....' },
    { at: 36.35, text: 'hello....' },
  ],
  typewriter: {
    characterSeconds: 0.072,
    variationSeconds: 0.034,
  },
  object: {
    emergeStart: 7,
    emergeEnd: 17.55,
    colourStart: 13,
    colourEnd: 20.6,
    angleWindows: [
      [21.84, 22.15],
      [22.29, 22.64],
      [22.79, 23.11],
      [23.25, 23.59],
      [23.73, 24.05],
      [24.22, 24.55],
      [24.7, 25.02],
    ],
    stillStart: 25.22,
    stillEnd: 25.46,
    maximumOpacity: 0.92,
    integrity: [
      [7, 0],
      [7.8, 0.025],
      [8, 0.14],
      [8.15, 0.02],
      [9.4, 0.1],
      [9.6, 0.3],
      [9.75, 0.06],
      [13.18, 0.25],
      [13.41, 0.5],
      [13.64, 0.18],
      [15.28, 0.52],
      [17.1, 0.78],
      [17.55, 1],
    ],
  },
  signalRecovery: {
    pixelStart: 1.15,
    pixelPeak: 4.6,
    pixelFade: 7.34,
    pixelEnd: 9.91,
    lineStart: 7,
    linePeak: 10.26,
    lineFade: 14.64,
    lineEnd: 20.47,
    colourPixelStart: 12.85,
    colourPixelPeak: 16.1,
    colourPixelFade: 19.56,
    colourPixelEnd: 22.47,
    faults: [
      { at: 1.85, duration: 0.18, amount: 0.26, direction: -1 },
      { at: 3.35, duration: 0.12, amount: 0.14, direction: 1 },
      { at: 7.47, duration: 0.28, amount: 0.48, direction: 1 },
      { at: 8.11, duration: 0.16, amount: 0.32, direction: -1 },
      { at: 13.32, duration: 0.38, amount: 0.68, direction: -1 },
      { at: 15, duration: 0.2, amount: 0.38, direction: 1 },
      { at: 20.51, duration: 0.58, amount: 1, direction: 1 },
      { at: 21.64, duration: 0.22, amount: 0.55, direction: -1, screen: 0.74 },
      { at: 22.31, duration: 0.18, amount: 0.42, direction: -1, screen: 0.55 },
      { at: 22.82, duration: 0.14, amount: 0.46, direction: 1, screen: 0.58 },
      { at: 23.28, duration: 0.16, amount: 0.5, direction: -1, screen: 0.62 },
      { at: 23.73, duration: 0.14, amount: 0.52, direction: 1, screen: 0.66 },
      { at: 24.16, duration: 0.16, amount: 0.5, direction: -1, screen: 0.64 },
      { at: 24.58, duration: 0.18, amount: 0.56, direction: 1, screen: 0.7 },
      { at: 25.09, duration: 0.32, amount: 0.88, direction: -1, screen: 0.95 },
      { at: 27.03, duration: 0.18, amount: 0.34, direction: 1, screen: 0.28 },
      { at: 30.44, duration: 0.24, amount: 0.62, direction: -1, screen: 0.48 },
    ],
    contactFaults: [
      { at: 0.25, duration: 0.18, amount: 0.42, direction: 1 },
      { at: 1.15, duration: 0.32, amount: 0.72, direction: -1 },
      { at: 2.05, duration: 0.14, amount: 0.28, direction: 1 },
      { at: 3.15, duration: 0.24, amount: 0.52, direction: 1 },
    ],
  },
  identityReveal: 29.35,
  divisionReveal: 29.99,
  identityCalibrationEnd: 36.2,
  contactAvailable: 37.75,
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
    (strongest, fault, index) => {
      const progress = (elapsed - fault.at) / fault.duration
      const shaped = faultShape(progress)
      const amount = shaped.amount * fault.amount
      const screenAmount = shaped.amount * (fault.screen ?? fault.amount * 0.32)
      if (amount <= strongest.amount && screenAmount <= strongest.screen) return strongest

      return {
        amount: Math.max(strongest.amount, amount),
        direction: shaped.direction * fault.direction,
        screen: Math.max(strongest.screen, screenAmount),
        variant: (index * 37 + 11) % 97,
      }
    },
    { amount: 0, direction: 0, screen: 0, variant: 0 },
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
  const time = reducedMotion ? TIMELINE_END : Math.max(0, elapsed)
  const emergence = smoothstep(time, TIMING.object.emergeStart, TIMING.object.emergeEnd)
  const colour = smoothstep(time, TIMING.object.colourStart, TIMING.object.colourEnd)
  const angles = TIMING.object.angleWindows.map(([start, end]) => (
    reducedMotion ? 0 : steppedWindow(time, start, end)
  ))
  const still = smoothstep(time, TIMING.object.stillStart, TIMING.object.stillEnd)
  const contactAvailable = time >= TIMING.contactAvailable
  const contactSequenceStarted = contactAvailable && contactRequested
  const contactVisible = contactSequenceStarted && contactElapsed >= TIMING.contactRevealDelay
  const identityVisible = time >= TIMING.identityReveal
  const divisionVisible = time >= TIMING.divisionReveal
  const identityCalibrating = !reducedMotion
    && time >= TIMING.identityReveal
    && time < TIMING.identityCalibrationEnd
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
    terminalText: contactSequenceStarted
      ? ''
      : reducedMotion
        ? TIMING.messages.at(-1).text
        : terminalTextAt(time),
    contactAvailable,
    contactVisible,
    diagnosticVisible: !contactSequenceStarted,
    identityVisible,
    divisionVisible,
    identityCalibrating,
    object: {
      emergence,
      colour,
      opacity: emergence * integrityAt(time) * TIMING.object.maximumOpacity,
      saturation: 0.03 + colour * 0.52,
      brightness: 0.38 + emergence * 0.45,
      blur: (1 - emergence) * 0.75,
      angles,
      still,
    },
    signal: {
      pixel,
      outline,
      colourPixel,
      rupture: rupture.amount,
      ruptureDirection: rupture.direction,
      screen: rupture.screen,
      variant: rupture.variant,
    },
    crt: {
      noise: reducedMotion ? 0.012 : 0.02 + recovery * 0.018 - settling * 0.008,
      scanlines: reducedMotion ? 0.32 : 0.42 + recovery * 0.14,
      glitches: reducedMotion ? 0 : clamp(recovery * 0.72 - settling * 0.22),
    },
  }
}

export const TIMELINE_END = 40
