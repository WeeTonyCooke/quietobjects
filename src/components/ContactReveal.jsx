export function ContactReveal({ revealed }) {
  return (
    <div className={`contact ${revealed ? 'contact--visible' : ''}`} aria-hidden={!revealed}>
      <p>Available for occasional collaborations.</p>
      <a href="mailto:hello@yourdomain.com" tabIndex={revealed ? 0 : -1}>
        hello@yourdomain.com
      </a>
    </div>
  )
}
