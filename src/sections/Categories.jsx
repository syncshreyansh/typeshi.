import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const categories = [
  { name: 'Tees', descriptor: 'Everyday Fits', slug: 'tees', className: 'category-panel-tees', number: '01' },
  { name: 'Hoodies', descriptor: 'Heavy Fleece', slug: 'hoodies', className: 'category-panel-hoodies', number: '02' },
  { name: 'Caps', descriptor: 'Headwear', slug: 'caps', className: 'category-panel-caps', number: '03' },
]

export function Categories() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return undefined
    const panels = Array.from(section.querySelectorAll('[data-panel]'))
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(panels, { clearProps: 'all', clipPath: 'inset(0 0 0 0)' })
      return undefined
    }
    const media = gsap.matchMedia()
    registerMotionPlugins()
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set(panels, { clearProps: 'all', clipPath: 'inset(0 0 0 0)' }))
    media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(panels, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)', duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: section, start: 'top 85%', once: true } })
    })
    media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const setOpen = (active) => panels.forEach((panel) => {
        const open = panel === active
        gsap.to(panel, { flexGrow: open ? 2.2 : 0.7, duration: 0.9, ease: 'expo.out' })
        gsap.to(panel.querySelector('.category-lines'), { scale: open ? 1 : 1.1, duration: 0.9, ease: 'expo.out' })
        gsap.to(panel.querySelector('.category-rule'), { scaleX: open ? 1 : 0, duration: 0.9, ease: 'expo.out' })
      })
      const bindings = panels.map((panel) => {
        const enter = () => setOpen(panel)
        const leave = () => { if (!panel.matches(':focus-within')) setOpen(null) }
        const focus = () => setOpen(panel)
        const blur = () => window.setTimeout(() => { if (!panel.matches(':hover') && !panel.matches(':focus-within')) setOpen(null) }, 0)
        panel.addEventListener('pointerenter', enter)
        panel.addEventListener('pointerleave', leave)
        panel.addEventListener('focusin', focus)
        panel.addEventListener('focusout', blur)
        return () => { panel.removeEventListener('pointerenter', enter); panel.removeEventListener('pointerleave', leave); panel.removeEventListener('focusin', focus); panel.removeEventListener('focusout', blur) }
      })
      gsap.fromTo(panels, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)', duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: section, start: 'top 85%', once: true } })
      return () => bindings.forEach((binding) => binding())
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section ref={sectionRef} className="categories-section bleed" data-header-theme="dark" aria-label="Shop by category">
      {categories.map((category) => (
        <Link key={category.slug} to={`/shop?category=${category.slug}`} className={`category-panel ${category.className}`} data-panel>
          <span className="category-lines" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="category-number label">{category.number}</span>
          <span className="category-vertical display-xl">{category.name}</span>
          <span className="category-footer"><span className="label">{category.descriptor}</span><span className="category-rule" /></span>
        </Link>
      ))}
    </section>
  )
}
