const VENUES = [
  {
    name: 'THE HEARTH',
    place: 'Bath Green · Moville',
    href: 'https://thehearthbar.netlify.app',
  },
  {
    name: 'THE EMERALD',
    place: 'Main Street · Moville',
    href: 'https://theemerald-moville.netlify.app',
  },
]

/** Quiet F&B selector — two venues, no size labels, no portfolio chrome. */
export function FbChooser() {
  return (
    <main className="fb-chooser" aria-label="F&B demos">
      <a className="fb-chooser__back" href="/">
        Quiet Objects
      </a>
      <p className="fb-chooser__label">F&amp;B</p>
      <ul className="fb-chooser__list">
        {VENUES.map((venue) => (
          <li key={venue.name}>
            <a
              className="fb-chooser__link"
              href={venue.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="fb-chooser__name">{venue.name}</span>
              <span className="fb-chooser__place">{venue.place}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
