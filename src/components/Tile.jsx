import { useState } from 'react'

export function Tile({ src, swapSrc, alt = '', className = '', eager, ...props }) {
  const [failed, setFailed] = useState(false)
  const [swapFailed, setSwapFailed] = useState(false)
  const isHero = eager !== undefined ? eager : Boolean(props['data-hero-tile'])
  const loading = isHero ? 'eager' : 'lazy'

  return (
    <span {...props} className={`relative inline-block overflow-hidden rounded-lg bg-surface-dark align-middle ${className}`}>
      {!failed && <img src={src} alt={alt} loading={loading} decoding="async" onError={() => setFailed(true)} className="block h-full w-full object-cover grayscale" />}
      {swapSrc && !swapFailed && <span data-tile-swap className="tile-swap"><img src={swapSrc} alt="" loading={loading} decoding="async" onError={() => setSwapFailed(true)} className="block h-full w-full object-cover grayscale" /></span>}
    </span>
  )
}
