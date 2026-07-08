export function TerminalText({ text }) {
  return (
    <p className="terminal__message">
      {text}
      <span className="cursor" aria-hidden="true" />
    </p>
  )
}
