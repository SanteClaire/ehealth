export function LogoSVG({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="18" fill="#1e40af" fillOpacity="0.1" />

      {/* Medical cross */}
      <g stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round">
        <line x1="20" y1="12" x2="20" y2="28" />
        <line x1="12" y1="20" x2="28" y2="20" />
      </g>

      {/* Shield outline */}
      <path
        d="M 20 10 L 12 14 L 12 20 C 12 27 20 32 20 32 C 20 32 28 27 28 20 L 28 14 L 20 10 Z"
        stroke="#1e40af"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LogoFull({ height = 40, className = '' }) {
  return (
    <img 
      src={new URL('../assets/logo.png', import.meta.url).href}
      alt="SantéClaire" 
      className={className}
      style={{ height: `${height}px`, width: 'auto', fontSize: '30px' }}
    />
  )
}
