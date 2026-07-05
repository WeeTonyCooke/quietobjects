export function LogoLockup({ visible, descriptorVisible }) {
  return (
    <header
      className={`mca-lockup ${visible ? 'mca-lockup--visible' : ''}`}
      aria-label="MCA Applied Signal Research"
    >
      <svg className="mca-optical-filter" aria-hidden="true">
        <filter id="mca-optical-rim" x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="0.65" result="expanded" />
          <feComposite in="expanded" in2="SourceAlpha" operator="out" result="rim" />
          <feFlood floodColor="#ebebeb" result="neutralWhite" />
          <feComposite in="neutralWhite" in2="rim" operator="in" />
        </filter>
      </svg>
      <span className="mca-mark">
        <img
          src="/assets/mca-logo-white@3x.png"
          alt="MCA"
          className="mca-logo mca-logo--fill"
        />
        <img
          src="/assets/mca-logo-white@3x.png"
          alt=""
          aria-hidden="true"
          className="mca-logo mca-logo--rim"
        />
      </span>
      <p className={`mca-descriptor ${descriptorVisible ? 'mca-descriptor--visible' : ''}`}>
        Applied Signal Research
      </p>
    </header>
  )
}
