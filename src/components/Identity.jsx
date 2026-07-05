export function Identity({ visible }) {
  if (!visible) return null

  return (
    <header className="identity">
      <p className="identity__work">Quiet Objects</p>
      <p className="identity__organisation">MCA</p>
      <p className="identity__division">Applied Signal Research</p>
    </header>
  )
}
