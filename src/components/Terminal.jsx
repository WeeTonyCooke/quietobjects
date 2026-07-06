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
        <p>For collaborations.....</p>
        <a href="mailto:hello@quietobjects.ie" tabIndex={experience.contactVisible ? 0 : -1}>
          hello@quietobjects.ie
        </a>
      </div>
    </section>
  )
}
