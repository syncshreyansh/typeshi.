import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const SmoothScrollContext = createContext({ lenis: null })

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export function SmoothScroll({ children }) {
  const reducedMotion = useReducedMotion()
  const lenisRef = useRef(null)
  const [lenis, setLenis] = useState(null)
  const touchDevice = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    registerMotionPlugins()
    if (reducedMotion || touchDevice) return undefined
    const lenis = new Lenis({ autoRaf: false, smoothWheel: true })
    lenisRef.current = lenis
    setLenis(lenis)
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [reducedMotion, touchDevice])

  const value = useMemo(() => ({ lenis }), [lenis])
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
}
