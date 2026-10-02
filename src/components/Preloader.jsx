import { createContext, useContext, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { MOTION_DURATIONS, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useSmoothScroll } from './SmoothScroll'

const PreloaderContext = createContext({ preloaderDone: true })
const STORAGE_KEY = 'typeshi-preloader-seen'

export function usePreloader() {
  return useContext(PreloaderContext)
}

function hasSeenPreloader() {
  try { return sessionStorage.getItem(STORAGE_KEY) === 'true' } catch { return false }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Preloader({ children }) {
  const reducedMotion = useReducedMotion()
  const { lenis } = useSmoothScroll()
  const [done, setDone] = useState(() => prefersReducedMotion() || hasSeenPreloader())
  const frameRef = useRef(null)
  const finishedRef = useRef(done)

  useEffect(() => {
    if (!reducedMotion || done) return
    finishedRef.current = true
    setDone(true)
  }, [reducedMotion, done])

  useEffect(() => {
    if (done) return undefined
    lenis?.stop()
    document.body.classList.add('is-scroll-locked')
    return () => {
      document.body.classList.remove('is-scroll-locked')
      lenis?.start()
    }
  }, [done, lenis])

  useGSAP(() => {
    registerMotionPlugins()
    if (done || reducedMotion || !frameRef.current || finishedRef.current) return undefined
    const frame = frameRef.current
    const counter = frame.querySelector('[data-preloader-counter-value]')
    const value = { amount: 0 }
    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      try { sessionStorage.setItem(STORAGE_KEY, 'true') } catch { /* session storage can be unavailable */ }
      gsap.timeline({ onComplete: () => setDone(true) })
        .to(frame.querySelector('[data-preloader-content]'), { y: -20, opacity: 0, duration: 0.2, ease: 'expo.out' })
        .add(() => window.dispatchEvent(new CustomEvent('typeshi:preloader-done')))
        .to(frame, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, '-=0.05')
    }
    const update = () => { counter.textContent = `${Math.round(value.amount)}%` }
    const media = gsap.matchMedia()
    const timeline = gsap.timeline({ onComplete: finish })
    timeline.to(value, { amount: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: update })
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.set(frame, { clearProps: 'willChange' })
    })
    const cap = window.setTimeout(finish, 3000)
    return () => { timeline.kill(); media.revert(); window.clearTimeout(cap) }
  }, { scope: frameRef, dependencies: [done, reducedMotion] })

  const value = { preloaderDone: done }
  return <PreloaderContext.Provider value={value}>{children}{!done && <div ref={frameRef} className="preloader" role="status" aria-label="Loading Typeshi" aria-hidden={done}><div data-preloader-content className="preloader-content"><div className="preloader-counter" data-preloader-counter><span data-preloader-counter-value aria-hidden="true">0%</span><span data-preloader-cursor className="cursor" aria-hidden="true">_</span></div><div className="preloader-loading font-serif-display" aria-hidden="true">Loading...</div></div><svg className="preloader-edge" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0h100v5c-20 7-34 7-50 1C32 1 18 1 0 8V0Z" /></svg></div>}</PreloaderContext.Provider>
}
