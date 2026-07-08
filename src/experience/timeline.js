export const TIMING = Object.freeze({
  playbackRate: 1,
  states: {
    VOID: 0,
    SIGNAL: 0.45,
    RECOVER: 2.2,
    RESOLVE: 4,
    STABLE: 6.55,
    HELLO: 7.2,
  },
  messages: [
    { at: 0.45, text: 'signal.....' },
    { at: 2.2, text: 'geometry.....' },
    { at: 4, text: 'chroma.....' },
    { at: 7.2, text: 'hello....' },
  ],
  typewriter: {
    characterSeconds: 0.052,
    variationSeconds: 0.02,
  },
  object: {
    emergeStart: 2.2,
    emergeEnd: 5.15,
    colourStart: 4,
    colourEnd: 6.25,
    angleWindows: [
      [6.58, 6.72],
      [6.82, 6.98],
      [7.08, 7.22],
      [7.32, 7.48],
      [7.58, 7.72],
      [7.83, 7.98],
      [8.08, 8.23],
    ],
    stillStart: 8.32,
    stillEnd: 8.48,
    maximumOpacity: 0.92,
    integrity: [
      [2.2, 0],
      [2.42, 0.025],
      [2.56, 0.14],
      [2.68, 0.02],
      [3.25, 0.12],
      [3.44, 0.34],
      [3.58, 0.08],
      [4.18, 0.3],
      [4.36, 0.54],
      [4.5, 0.2],
      [5.15, 0.58],
      [5.86, 0.82],
      [6.25, 1],
    ],
  },
  signalRecovery: {
    pixelStart: 0.5,
    pixelPeak: 1.72,
    pixelFade: 2.42,
    pixelEnd: 3.15,
    lineStart: 2.2,
    linePeak: 3.2,
    lineFade: 4.35,
    lineEnd: 5.85,
    colourPixelStart: 3.85,
    colourPixelPeak: 4.9,
    colourPixelFade: 5.95,
    colourPixelEnd: 6.8,
    faults: [
      { at: 0.82, duration: 0.14, amount: 0.24, direction: -1 },
      { at: 1.45, duration: 0.1, amount: 0.14, direction: 1 },
      { at: 2.16, duration: 0.24, amount: 0.72, direction: 1, screen: 0.78 },
      { at: 2.68, duration: 0.16, amount: 0.34, direction: -1, screen: 0.3 },
      { at: 3.96, duration: 0.34, amount: 0.92, direction: -1, screen: 0.86 },
      { at: 4.62, duration: 0.18, amount: 0.42, direction: 1, screen: 0.34 },
      { at: 6.42, duration: 0.34, amount: 0.72, direction: 1, screen: 0.72 },
      { at: 6.84, duration: 0.16, amount: 0.42, direction: -1, screen: 0.5 },
      { at: 7.12, duration: 0.14, amount: 0.46, direction: 1, screen: 0.52 },
      { at: 7.4, duration: 0.15, amount: 0.5, direction: -1, screen: 0.56 },
      { at: 7.7, duration: 0.14, amount: 0.48, direction: 1, screen: 0.58 },
      { at: 8.02, duration: 0.16, amount: 0.56, direction: -1, screen: 0.66 },
      { at: 8.3, duration: 0.24, amount: 0.9, direction: 1, screen: 0.92 },
      { at: 9.2, duration: 0.14, amount: 0.28, direction: -1, screen: 0.24 },
    ],
    contactFaults: [
      { at: 0.25, duration: 0.18, amount: 0.42, direction: 1 },
      { at: 1.15, duration: 0.32, amount: 0.72, direction: -1 },
      { at: 2.05, duration: 0.14, amount: 0.28, direction: 1 },
      { at: 3.15, duration: 0.24, amount: 0.52, direction: 1 },
    ],
  },
  identityReveal: 8.65,
  divisionReveal: 8.95,
  identityCalibrationEnd: 11.35,
  contactAvailable: 11.55,
  contactRevealDelay: 0.55,
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

export const TIMELINE_END = 12.4
