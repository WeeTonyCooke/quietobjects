const FRAGMENTS = Array.from({ length: 9 }, (_, index) => ({
  id: index,
  top: `${12 + ((index * 19.3) % 76)}%`,
  left: `${-4 + (index % 3) * 5}%`,
  width: `${52 + (index % 4) * 17}%`,
  delay: `${3.6 + (index % 6) * 2.15}s`,
  duration: `${10.5 + (index % 4) * 3.2}s`,
}))

export function GlitchField() {
  return (
    <div className="glitch-field" aria-hidden="true">
      {FRAGMENTS.map((fragment) => (
        <i
          key={fragment.id}
          style={{
            '--top': fragment.top,
            '--left': fragment.left,
            '--width': fragment.width,
            '--delay': fragment.delay,
            '--duration': fragment.duration,
          }}
        />
      ))}
      <span className="tracking-tear tracking-tear--one" />
      <span className="tracking-tear tracking-tear--two" />
    </div>
  )
}
