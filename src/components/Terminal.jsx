export function Terminal({ experience }) {
  return (
    <section className="terminal" aria-live="polite">
      {experience.diagnosticVisible && (
        <p className="terminal__messages">
          {experience.terminalText}
          <span className="cursor" aria-hidden="true" />
        </p>
      )}
      <div className={`contact ${experience.contactVisible ? 'contact--visible' : ''}`}>
        <p>Available for occasional collaborations.</p>
        <a href="mailto:hello@yourdomain.com" tabIndex={experience.contactVisible ? 0 : -1}>
          hello@yourdomain.com
        </a>
      </div>
    </section>
  )
}
