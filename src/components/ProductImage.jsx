import { useState } from 'react'

const productType = (name = '') => name.toLowerCase()

const getLuminance = (hex) => {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16) / 255)
  const linear = channels.map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2])
}

function ProductSilhouette({ type, color, label }) {
  const isCap = type === 'caps'
  const isHoodie = type === 'hoodies'
  const isDark = getLuminance(color) < 0.28
  const backdrop = isDark ? '#fafffa' : '#232924'
  const printSize = isCap ? 10 : 14

  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="none" role="img" aria-label={`${label} mockup`} xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" style={{ fill: backdrop, transition: 'fill 0.45s ease-out' }} />
      {isCap ? (
        <g fill={color} stroke="#121613" strokeWidth="3" strokeLinejoin="round">
          <path style={{ fill: color, transition: 'fill 0.45s ease-out' }} d="M110 230c8-80 42-120 90-120s82 40 90 120H110Z" />
          <path style={{ fill: color, transition: 'fill 0.45s ease-out' }} d="M112 226c-48 4-78 19-78 42 34 12 73 12 112-7" />
          <path d="M122 219h156" fill="none" />
        </g>
      ) : (
        <path
          d={isHoodie ? 'M122 106 166 82c10 18 22 28 34 28s24-10 34-28l44 24 54 80-39 25-25-38v190H132V173l-25 38-39-25 54-80Z' : 'M128 92 176 76h48l48 16 58 89-42 28-28-45v199H140V164l-28 45-42-28 58-89Z'}
          style={{ fill: color, transition: 'fill 0.45s ease-out' }}
          stroke="#121613"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {isHoodie && <path d="M165 86c12 30 58 30 70 0" fill="none" stroke="#121613" strokeWidth="3" />}
      <text x="200" y={isCap ? 183 : 255} textAnchor="middle" fill="#fafffa" fontFamily="Google Sans Flex Variable, sans-serif" fontSize={printSize} fontWeight="550" letterSpacing="1">TYPESHI</text>
    </svg>
  )
}

export function ProductImage({ image, product, className = '' }) {
  const [failed, setFailed] = useState(false)
  const imageData = typeof image === 'string' ? { src: image } : (image || {})
  const type = product?.category || productType(product?.name)
  const color = imageData.color || product?.colors?.[0]?.hex || '#232924'

  if (imageData.src && !failed) {
    return (
      <img
        className={className}
        src={imageData.src}
        alt={product?.name || 'Typeshi product'}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    )
  }

  return <div className={className}><ProductSilhouette type={type} color={color} label={product?.name || 'Typeshi product'} /></div>
}
