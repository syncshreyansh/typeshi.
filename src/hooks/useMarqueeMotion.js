import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from './useReducedMotion'

export function useMarqueeMotion({ duration = 60, direction = -1 } = {}) {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    const tracks = section ? Array.from(section.querySelectorAll('[data-marquee-track]')) : []
    if (!section || !tracks.length) return undefined
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(tracks, { x: 0, skewX: 0 })
      gsap.set(section.querySelectorAll('[data-marquee-tile]'), { scale: 1 })
    })
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
      let disposed = false
      let cleanups = []
      let resizeTimer
      const tileEntries = tracks.map((track) => gsap.fromTo(track.querySelectorAll('[data-marquee-tile]'), { scale: 0.94 }, { scale: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: section, start: 'top 85%', once: true } }))
      const setup = () => {
        if (disposed) return
        cleanups.forEach((cleanup) => cleanup())
        cleanups = tracks.map((track) => {
          const copies = track.querySelectorAll('.marquee-track-content')
          if (copies.length < 2) return () => {}
          const distance = copies[1].offsetLeft - copies[0].offsetLeft
          const trackDirection = Number(track.dataset.marqueeDir || direction)
          const trackDuration = Number(track.dataset.marqueeDuration || duration)
          const from = trackDirection < 0 ? 0 : -distance
          const to = trackDirection < 0 ? -distance : 0
          const loop = gsap.fromTo(track, { x: from }, { x: to, duration: trackDuration, ease: 'none', repeat: -1, paused: true })
          const skewTo = desktop ? gsap.quickTo(track, 'skewX', { duration: 0.35, ease: 'power4.out' }) : () => {}
          let restCall
          let hover = false
          const trigger = ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (self) => self.isActive ? loop.play() : loop.pause(), onUpdate: desktop ? (self) => { const velocity = self.getVelocity(); const scale = Math.max(1, Math.min(4, 1 + Math.abs(velocity) / 1600)); loop.timeScale(scale); skewTo(Math.max(-4, Math.min(4, velocity / 900))); restCall?.kill(); restCall = gsap.delayedCall(0.16, () => { gsap.to(loop, { timeScale: 1, duration: 0.35, ease: 'power4.out' }); skewTo(0) }) } : undefined })
          const enter = () => { if (!desktop) return; hover = true; gsap.to(loop, { timeScale: 0, duration: 0.35, ease: 'power4.out' }) }
          const leave = () => { if (!desktop) return; hover = false; gsap.to(loop, { timeScale: 1, duration: 0.35, ease: 'power4.out' }) }
          if (desktop) { section.addEventListener('pointerenter', enter); section.addEventListener('pointerleave', leave) }
          const visibility = () => { if (document.hidden || !trigger.isActive) loop.pause(); else if (!hover) loop.play() }
          document.addEventListener('visibilitychange', visibility)
          return () => { restCall?.kill(); loop.kill(); trigger.kill(); section.removeEventListener('pointerenter', enter); section.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility); skewTo(0) }
        })
        ScrollTrigger.refresh()
      }
      setup()
      const resize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(setup, 150) }
      window.addEventListener('resize', resize)
      document.fonts?.ready.then(() => { if (!disposed) setup() })
      return () => { disposed = true; window.clearTimeout(resizeTimer); window.removeEventListener('resize', resize); cleanups.forEach((cleanup) => cleanup()); tileEntries.forEach((tween) => tween.kill()) }
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [duration, direction, reducedMotion] })

  return { sectionRef }
}
