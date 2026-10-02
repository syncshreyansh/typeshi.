import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from './useReducedMotion'

export function useLineReveal({ scope, preloaderDone = true, selector = '[data-line-reveal]' } = {}) {
  const localScope = useRef(null)
  const scopeRef = scope || localScope
  const reducedMotion = useReducedMotion()
  const preloaderDoneRef = useRef(preloaderDone)
  useEffect(() => { preloaderDoneRef.current = preloaderDone }, [preloaderDone])
  useGSAP(() => {
    registerMotionPlugins()
    const root = scopeRef.current
    if (!root) return undefined
    let tween
    const play = () => {
      const lines = root.querySelectorAll(selector)
      const words = root.querySelectorAll(`${selector} .line-reveal-word`)
      const targets = words.length ? words : lines
      if (!targets.length) return undefined
      if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.set(targets, { yPercent: 0, opacity: 1 }); return undefined }
      gsap.set(targets, { yPercent: 110 })
      tween = gsap.to(targets, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: targets[0], start: 'top 85%', once: true } })
      return tween
    }
    if ((preloaderDoneRef.current || reducedMotion) && !document.documentElement.classList.contains('route-transitioning')) return play()
    if (document.documentElement.classList.contains('route-transitioning')) {
      const routeDone = () => { play() }
      window.addEventListener('typeshi:route-revealed', routeDone, { once: true })
      return () => { window.removeEventListener('typeshi:route-revealed', routeDone); tween?.kill() }
    }
    const done = () => { play() }
    window.addEventListener('typeshi:preloader-done', done, { once: true })
    return () => { window.removeEventListener('typeshi:preloader-done', done); tween?.kill() }
  }, { scope: scopeRef, dependencies: [reducedMotion, selector] })
  return scopeRef
}
