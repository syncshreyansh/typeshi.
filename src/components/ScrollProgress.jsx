import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function ScrollProgress() {
  const ref = useRef(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    registerMotionPlugins()
    if (reducedMotion) return undefined
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => gsap.set(ref.current, { scaleX: self.progress }) })
    return () => trigger?.kill()
  }, { scope: ref, dependencies: [reducedMotion] })
  if (reducedMotion) return null
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}
