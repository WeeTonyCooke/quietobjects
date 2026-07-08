export function CrtOverlay() {
  return (
    <div className="crt" aria-hidden="true">
      <div className="crt__scanlines" />
      <div className="crt__noise" />
      <div className="crt__sync-roll" />
      <div className="crt__vignette" />
    </div>
  )
}
