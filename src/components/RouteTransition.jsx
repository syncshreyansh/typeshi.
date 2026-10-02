import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useSmoothScroll } from './SmoothScroll'

function waitForPageMount() {
  return new Promise((resolve) => {
    let settled = false
    const finish = () => { if (settled) return; settled = true; window.removeEventListener('typeshi:page-mounted', finish); window.clearTimeout(timeout); resolve() }
    const timeout = window.setTimeout(finish, 2000)
    window.addEventListener('typeshi:page-mounted', finish, { once: true })
    window.setTimeout(finish, 350)
  })
}

export function RouteTransition({ children }) {
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const { lenis } = useSmoothScroll()
  const scopeRef = useRef(null)
  const coverRef = useRef(null)
  const firstRef = useRef(true)
  const previousKeyRef = useRef(`${location.pathname}${location.search}`)
  const [displayLocation, setDisplayLocation] = useState(location)

  useGSAP(() => { registerMotionPlugins() }, { scope: scopeRef })

  useEffect(() => {
    const key = `${location.pathname}${location.search}`
    if (firstRef.current) { firstRef.current = false; previousKeyRef.current = key; return undefined }
    if (key === previousKeyRef.current) return undefined
    previousKeyRef.current = key
    let cancelled = false
    const cover = coverRef.current
    if (!cover) { setDisplayLocation(location); return undefined }
    const reveal = async () => {
      document.documentElement.classList.add('route-transitioning')
      cover.style.visibility = 'visible'
      cover.style.pointerEvents = 'auto'
      if (reducedMotion) {
        setDisplayLocation(location)
        lenis?.scrollTo(0, { immediate: true })
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        window.dispatchEvent(new CustomEvent('typeshi:route-covered'))
        await new Promise((resolve) => window.setTimeout(resolve, 200))
        if (!cancelled) { window.dispatchEvent(new CustomEvent('typeshi:route-revealed')); document.documentElement.classList.remove('route-transitioning'); cover.style.visibility = 'hidden'; cover.style.pointerEvents = 'none' }
        return
      }
      await new Promise((resolve) => gsap.to(cover, { yPercent: 0, duration: 0.6, ease: 'power4.inOut', onComplete: resolve }))
      if (cancelled) return
      const mounted = waitForPageMount()
      setDisplayLocation(location)
      lenis?.scrollTo(0, { immediate: true })
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      window.dispatchEvent(new CustomEvent('typeshi:route-covered'))
      await mounted
      if (cancelled) return
      window.dispatchEvent(new CustomEvent('typeshi:route-revealed'))
      await new Promise((resolve) => gsap.to(cover, { yPercent: -100, duration: 0.7, ease: 'power4.inOut', onComplete: resolve }))
      if (!cancelled) { document.documentElement.classList.remove('route-transitioning'); cover.style.visibility = 'hidden'; cover.style.pointerEvents = 'none' }
    }
    gsap.set(cover, { yPercent: 100, autoAlpha: 1 })
    reveal()
    return () => { cancelled = true; document.documentElement.classList.remove('route-transitioning'); gsap.killTweensOf(cover) }
  }, [location, reducedMotion, lenis])

  useEffect(() => {
    let frame = 0
    let cancelled = false
    const announce = () => {
      if (cancelled) return
      const fallback = document.querySelector('.route-transition-shell > .min-h-screen[aria-hidden="true"]')
      if (fallback) { frame = requestAnimationFrame(announce); return }
      document.fonts?.ready.then(() => {
        if (cancelled) return
        ScrollTrigger.refresh()
        window.dispatchEvent(new CustomEvent('typeshi:page-mounted'))
      })
    }
    frame = requestAnimationFrame(announce)
    return () => { cancelled = true; cancelAnimationFrame(frame) }
  }, [displayLocation])

  return <div ref={scopeRef} className="route-transition-shell">{children(displayLocation)}<div ref={coverRef} className="route-wipe" aria-hidden="true"><svg className="route-wipe-edge" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 0H100 C78 18 84 39 100 55 C84 72 80 88 100 100H0Z" /></svg><span className="route-bars"><i /><i /><i /></span></div></div>
}
