export function Arrow({ className = '', direction = 'right' }) {
  const transform = direction === 'up' ? 'rotate(-90 10 10)' : direction === 'left' ? 'rotate(180 10 10)' : ''

  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 10h15M11 4l6 6-6 6" fill="none" stroke="#2bee4b" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter" transform={transform} />
    </svg>
  )
}
