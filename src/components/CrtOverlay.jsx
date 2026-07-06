const TEARS = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  top: `${14 + ((index * 17.3) % 72)}%`,
  delay: `${3.2 + index * 1.9}s`,
  duration: `${11 + (index % 3) * 4}s`,
}))

export function CrtOverlay() {
  return (
    <div className="crt" aria-hidden="true">
      <div className="crt__scanlines" />
      <div className="crt__noise" />
      <div className="crt__dropout" />
      <div className="crt__blocks" />
      <div className="crt__colour-bars" />
      <div className="crt__vignette" />
      {TEARS.map((tear) => (
        <i
          className="crt__tear"
          key={tear.id}
          style={{ '--top': tear.top, '--delay': tear.delay, '--duration': tear.duration }}
        />
      ))}
    </div>
  )
}
