import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function MotionGlobals() {
  const scope = useRef(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    registerMotionPlugins()
    const touch = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches
    if (reducedMotion || touch) return undefined
    const quickers = new WeakMap()
    const getQuickers = (element) => {
      if (!quickers.has(element)) quickers.set(element, [gsap.quickTo(element, 'x', { duration: 0.35, ease: 'expo.out' }), gsap.quickTo(element, 'y', { duration: 0.35, ease: 'expo.out' })])
      return quickers.get(element)
    }
    const move = (event) => {
      const element = event.target instanceof Element ? event.target.closest('[data-magnetic]') : null
      if (!element) return
      const bounds = element.getBoundingClientRect()
      const [moveX, moveY] = getQuickers(element)
      moveX(Math.max(-8, Math.min(8, (event.clientX - (bounds.left + bounds.width / 2)) * 0.12)))
      moveY(Math.max(-8, Math.min(8, (event.clientY - (bounds.top + bounds.height / 2)) * 0.12)))
    }
    const leave = (event) => {
      const element = event.target instanceof Element ? event.target.closest('[data-magnetic]') : null
      if (!element || !quickers.has(element)) return
      const [moveX, moveY] = quickers.get(element)
      moveX(0); moveY(0)
    }
    document.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave, true)
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave, true) }
  }, { scope, dependencies: [reducedMotion] })

  return <span ref={scope} className="sr-only" aria-hidden="true" />
}
