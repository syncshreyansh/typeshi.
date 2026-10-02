import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { GSAP_EASE_OUT_EXPO, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CurvedEdge } from '../components/CurvedEdge'

const stats = [
  ['100%', 'combed cotton'],
  ['240', 'GSM heavyweight'],
  ['12+', 'demo designs'],
  ['5k+', 'happy customers'],
  ['2026', 'founded'],
]

export function Stats() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    if (!section) return undefined
    const items = Array.from(section.querySelectorAll('[data-stat]'))
    const media = gsap.matchMedia()
    const finalState = () => {
      items.forEach((item) => { const value = item.querySelector('.stat-value'); value.textContent = value.dataset.value; gsap.set(item.querySelector('.stat-rule'), { scaleX: 1 }); gsap.set(item.querySelector('.body'), { opacity: 1 }) })
    }
    media.add('(prefers-reduced-motion: reduce)', finalState)
    media.add('(prefers-reduced-motion: no-preference)', () => {
      items.forEach((item, index) => {
        const value = item.querySelector('.stat-value')
        const target = value.dataset.value
        const label = item.querySelector('.body')
        const rule = item.querySelector('.stat-rule')
        gsap.set(rule, { scaleX: 0 })
        if (target === '2026') {
          gsap.fromTo(value, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: GSAP_EASE_OUT_EXPO, scrollTrigger: { trigger: item, start: 'top 88%', once: true } })
        } else {
          const number = Number(target.replace(/[^0-9]/g, ''))
          const suffix = target.replace(/[0-9]/g, '')
          const state = { number: 0 }
          value.textContent = `0${suffix}`
          const timeline = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 88%', once: true } })
          timeline.to(rule, { scaleX: 1, duration: 0.9, ease: GSAP_EASE_OUT_EXPO }, index * 0.1)
            .to(state, { number, duration: 1.6, ease: 'power4.out', onUpdate: () => { value.textContent = `${Math.round(state.number)}${suffix}` } }, index * 0.1)
            .to(label, { opacity: 1, duration: 0.35, ease: GSAP_EASE_OUT_EXPO }, `>-0.1`)
        }
        if (target === '2026') gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: GSAP_EASE_OUT_EXPO, scrollTrigger: { trigger: item, start: 'top 88%', once: true } })
      })
      gsap.set(items.map((item) => item.querySelector('.body')), { opacity: 0 })
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section ref={sectionRef} className="stats-section bleed" data-header-theme="dark" aria-label="Typeshi at a glance">
      <CurvedEdge from="#fafffa" to="#121613" position="top" />
      <p className="label text-muted">07 / In numbers</p>
      <div className="stats-list">
        {stats.map(([value, label], index) => (
          <div key={value} className={`stat-item stat-item-${index + 1}`} data-stat>
            <span className="stat-rule" aria-hidden="true" />
            <span className="stat-value" data-value={value} style={{ minWidth: `${value.length}ch` }}>{value}</span>
            <span className="body">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
