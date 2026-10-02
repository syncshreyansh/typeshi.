import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SolidButton } from '../components/ui/Button'
import { GSAP_EASE_OUT_EXPO, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CurvedEdge } from '../components/CurvedEdge'

export function FinalCta() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    const title = section?.querySelector('#final-cta-title')
    if (!section || !title) return undefined
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set(title, { clearProps: 'all' }))
    media.add('(prefers-reduced-motion: no-preference)', () => gsap.fromTo(title, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: GSAP_EASE_OUT_EXPO, scrollTrigger: { trigger: title, start: 'top 85%', once: true } }))
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion] })
  return (
    <section ref={sectionRef} className="final-cta" aria-labelledby="final-cta-title">
      <CurvedEdge from="#121613" to="#fafffa" position="top" />
      <p className="label text-muted">09 / Keep moving</p>
      <div className="final-cta-content">
        <div className="final-cta-title-mask"><h2 id="final-cta-title" className="display-xl">Find your everyday uniform.</h2></div>
        <SolidButton to="/shop" data-magnetic>Shop the drop</SolidButton>
      </div>
    </section>
  )
}
