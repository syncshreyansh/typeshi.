import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SolidButton } from '../components/ui/Button'
import { GSAP_EASE_OUT_EXPO, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CurvedEdge } from '../components/CurvedEdge'

export function Approach() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    if (!section) return undefined
    const circles = Array.from(section.querySelectorAll('[data-venn-circle]'))
    const labels = section.querySelectorAll('.venn-label')
    const triangle = section.querySelector('.venn-intersection')
    const copy = section.querySelector('.approach-copy')
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(circles, { strokeDashoffset: 0, x: 0, y: 0 })
      gsap.set([labels, triangle, copy], { opacity: 1, clearProps: 'transform' })
      return undefined
    }
    const media = gsap.matchMedia()
    const lengths = circles.map((circle) => circle.getTotalLength())
    gsap.set(circles, { strokeDasharray: (index) => lengths[index], strokeDashoffset: (index) => lengths[index] })
    gsap.set(circles, { x: (index) => [-20, 20, 0][index], y: (index) => [-20, -20, 20][index] })
    gsap.set([labels, triangle], { opacity: 0 })
    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(circles, { strokeDashoffset: 0, x: 0, y: 0 })
      gsap.set([labels, triangle, copy], { opacity: 1, clearProps: 'transform' })
    })
    media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ paused: true })
        .to(circles, { strokeDashoffset: 0, x: 0, y: 0, duration: 1, ease: 'none' })
        .to(labels, { opacity: 1, duration: 0.35, ease: GSAP_EASE_OUT_EXPO }, 0.72)
        .to(triangle, { opacity: 1, duration: 0.5, ease: GSAP_EASE_OUT_EXPO }, 0.92)
      const trigger = ScrollTrigger.create({ trigger: section, start: 'top 75%', end: 'center 40%', scrub: 0.6, animation: timeline })
      gsap.fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: GSAP_EASE_OUT_EXPO, scrollTrigger: { trigger: copy, start: 'top 88%', once: true } })
      return () => trigger.kill()
    })
    media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ paused: true }).to(circles, { strokeDashoffset: 0, x: 0, y: 0, duration: 1, ease: GSAP_EASE_OUT_EXPO }).to(labels, { opacity: 1, duration: 0.35 }, '-=0.35').to(triangle, { opacity: 1, duration: 0.5, ease: GSAP_EASE_OUT_EXPO })
      ScrollTrigger.create({ trigger: section, start: 'top 80%', once: true, animation: timeline })
      gsap.fromTo(copy, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: GSAP_EASE_OUT_EXPO, scrollTrigger: { trigger: copy, start: 'top 88%', once: true } })
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section ref={sectionRef} className="approach-section" aria-labelledby="approach-title">
      <CurvedEdge from="#121613" to="#fafffa" position="top" />
      <div className="approach-heading">
        <p className="label text-muted">06 / How we make it</p>
        <h2 id="approach-title" className="section-title">Our Unique Approach</h2>
      </div>
      <div className="approach-diagram" aria-label="Our approach: Design, Fabric, and Fit">
        <svg viewBox="0 0 500 430" role="img" aria-labelledby="venn-title">
          <title id="venn-title">Design, Fabric, and Fit overlap in the middle</title>
          <circle cx="205" cy="160" r="110" data-venn-circle="design" />
          <circle cx="295" cy="160" r="110" data-venn-circle="fabric" />
          <circle cx="250" cy="250" r="110" data-venn-circle="fit" />
          <path d="M250 190 268 218 232 218Z" className="venn-intersection" />
          <text className="venn-label" x="130" y="125">Design</text>
          <text className="venn-label" x="330" y="125">Fabric</text>
          <text className="venn-label" x="250" y="315" textAnchor="middle">Fit</text>
        </svg>
      </div>
      <div className="approach-copy">
        <p className="body">We keep the brief tight: thoughtful design, fabrics that earn their weight, and fits that move with real life. Nothing extra for the sake of looking busy.</p>
        <SolidButton to="/contact" className="mt-xl">Get in touch</SolidButton>
      </div>
    </section>
  )
}
