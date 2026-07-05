export function LogoLockup({ visible, descriptorVisible }) {
  return (
    <header
      className={`mca-lockup ${visible ? 'mca-lockup--visible' : ''}`}
      aria-label="MCA Applied Signal Research"
    >
      <img
        src="/assets/mca-logo-white@3x.png"
        alt="MCA"
        className="mca-logo"
      />
      <p className={`mca-descriptor ${descriptorVisible ? 'mca-descriptor--visible' : ''}`}>
        Applied Signal Research
      </p>
    </header>
  )
}
