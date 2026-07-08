# Quiet Objects

**Project codename:** Quiet Objects  
**Version:** 1.0  
**Status:** Approved and frozen for v1.0

## North star

> The visitor should never feel that the experience is being performed for them. They have arrived in the middle of something that was already happening.

Every decision should answer one question:

> Does this make the experience quieter or louder?

If it makes the experience louder, do not do it.

This is a digital installation: restrained, calm, deliberate, analogue, minimal, and slightly mysterious. It should feel like discovering an old broadcast machine slowly recovering its signal.

## Design rules

- Remove before adding.
- Fewer elements are almost always better.
- If an effect attracts attention to itself, reduce it.
- The object is the only source of colour.
- Black is a design element, not empty space.
- Silence is a feature.
- Curiosity should drive interaction.

## What this is not

Do not turn this into:

- a portfolio, personal site, or agency site
- a conventional animated landing page
- a hacker terminal or cyberpunk interface
- a gaming aesthetic, HUD, or fake Hollywood computer display

Reference analogue broadcast equipment, Sony PVM monitors, VHS, old oscilloscopes, scientific instrumentation, Braun, Dieter Rams, and the restraint of Ryoji Ikeda. Do not imitate their surface styling; inherit their discipline.

## Pacing and motion

Nothing happens suddenly. Things emerge, recover, stabilise, drift, and breathe.

Never pop, bounce, zoom, overshoot, or use spring and elastic motion. Avoid easing that feels like interface choreography. Motion should suggest phosphor decay, tape drift, CRT persistence, inertia, or breathing.

The animation should feel expensive because almost nothing happens.

## Time

The installation should never feel rushed. The visitor should always have enough time to notice a change before the next one begins.

Periods of inactivity are intentional. Silence between events is part of the design language. Do not compress pauses merely because nothing new appears on screen; noticing, waiting, and acclimatising are part of the experience.

## The object

The object is observed, not presented. Treat it as sculpture rather than a logo or hero graphic.

- occupy roughly 35–40% of the screen
- sit slightly right of centre, never perfectly centred
- rotate and drift extremely slowly
- remain imperfectly lit and never fully static
- begin monochrome, ghosted, and almost invisible
- recover structure before recovering colour
- retain gentle analogue instability after resolving

Colour is precious. The first coloured pixel should matter. Colour should leak or bleed as if old film is being restored—not fade or crossfade like a UI element.

## Visual field

- pure black background; no decorative gradients
- large areas of negative space
- small bottom-left monospaced text
- no obvious glow; only restrained CRT bloom
- subtle scanlines, vignette, persistence, noise, tracking loss, and occasional frame jitter
- no aggressive RGB splitting or digital glitch packs

## Interaction

There are no obvious buttons and no instruction that says “click here.” Interaction is discovered:

- click anywhere or press any meaningful key to reveal contact details
- pointer movement may alter perspective very subtly
- the terminal text remains crisp HTML, selectable and accessible

Version 1 is silent by default. Audio, if it exists, is discovered or explicitly enabled by the visitor. It should describe the machine rather than accompany it.

## Experience states

The conceptual states are:

```text
VOID → SIGNAL → RECOVER → RESOLVE → STABLE → HELLO → CONTACT
```

These are emotional states, not theatrical title cards. The visitor should not see the state names merely because they exist in code.

## Emotional journey

The emotional journey matters more than the implementation sequence:

```text
VOID → CURIOSITY → RECOGNITION → RECOVERY → CALM → INVITATION → CONVERSATION
```

Contact is an implementation event. Conversation is the intended human outcome.

One central timeline or state model must control text, artwork opacity and saturation, CRT intensity, and glitch frequency. Do not scatter unrelated timing constants and timeouts throughout components.

## Terminal voice

Machine language is observational and restrained.

### System messages

```text
signal detected.
recovering geometry...
resolving chroma...
connection established.
```

Human language is warmer and appears only after the system language has receded.

### Human messages

```text
hello.
and welcome.
```

The current v1 public opening remains:

```text
If you’ve found this page,
you probably know why you’re here.
```

After interaction:

```text
Available for occasional collaborations.
```

The final email address is still pending.

## Failure states

Media failure must remain elegant. Never expose a broken-image or broken-video interface. The terminal continues to work. If no fallback artwork is available, the experience may simply remain dark and report:

```text
signal unavailable.
█
```

The absence of the object should still feel intentional.

## Accessibility and responsive behaviour

Respect `prefers-reduced-motion`.

When reduced motion is requested:

- skip the recovery animation
- show a stable final artwork frame
- pause video playback
- keep CRT effects subtle and mostly static

Desktop is primary. Tablet adapts. Mobile simplifies; it should preserve atmosphere rather than reproduce every desktop effect.

The page never scrolls. It is one document with no routing, page transitions, or refresh choreography.

## TouchDesigner contract

The website owns the experience. TouchDesigner owns the artwork.

TouchDesigner creates replaceable artwork assets, not the website experience. The site must never depend on TouchDesigner being present.

Current delivery:

```text
public/assets/signal.webm
public/assets/signal.mp4
```

Possible later sources:

```text
signal.glb
WebRTC stream
```

Changing the artwork source must not require redesigning the terminal, interaction, CRT treatment, or experience-state architecture.

## Code principles

- small, readable components
- no unnecessary dependencies
- centralised timing and animation values; no unexplained magic numbers
- artwork source isolated behind one replaceable component
- video lazy loaded and compressed for the web
- target smooth rendering on modern desktop hardware
- failure and reduced-motion paths are first-class states

## Version 1 boundary

Version 1 is a single installation with one artwork, one opening script, silence by default, and one contact reveal.

Do not add multiple sculptures, time-of-day palettes, random scripts, a live TouchDesigner stream, hidden console commands, autoplay or accompanying ambient audio, returning-visitor behaviour, or a physical-installation mode yet. Keep these as extension points, not unfinished features.

## Success test

Would someone leave the page open for five minutes?

If yes, it is working. If the page becomes disposable once the text is read, it still feels too much like a website.

## Definition of done

Version 1 is emotionally complete when:

- a visitor hesitates before closing the tab
- they spend a few moments observing the object instead of searching for navigation
- the interaction feels discovered rather than instructed
- the periods of darkness and inactivity feel intentional rather than unfinished
- the experience remains compelling after its text has been read

These are acceptance criteria, not aspirations.

## Reasons

**Why no autoplay audio?**  
Because attention is invited, never demanded.

Version 1 is silent by default. Audio, if it exists, is discovered or explicitly enabled by the visitor. It should describe the machine rather than accompany it.

**Why no buttons?**  
Because curiosity is the interaction.

**Why so much black?**  
Because negative space is part of the composition.

**Why such slow motion?**  
Because confidence does not rush.

**Why no scrolling?**  
Because this is an installation, not a document.

## Change policy

This manifesto is frozen for version 1.0 and should be treated with the same care as source code. Changes must be deliberate responses to evidence from the working installation—not weekly refinements of taste or wording.

The manifesto defines principles rather than pixels. Discoveries made while composing the moving artwork, terminal, and CRT treatment may change the implementation without weakening the philosophy.
