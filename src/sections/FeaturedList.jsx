import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Arrow } from '../components/Arrow'
import { SolidButton } from '../components/ui/Button'
import { products } from '../data/products'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CurvedEdge } from '../components/CurvedEdge'

const featured = products.slice(0, 3)

export function FeaturedList() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    if (!section) return undefined
    const cards = Array.from(section.querySelectorAll('[data-list-row]'))
    const fills = Array.from(section.querySelectorAll('[data-card-swap]'))
    const media = gsap.matchMedia()
    const clearCards = () => cards.forEach((card) => card.classList.remove('is-active'))
    const setActive = (index) => {
      cards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === index))
      fills.forEach((fill, fillIndex) => gsap.to(fill, { clipPath: fillIndex === index ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', duration: 0.5, ease: 'expo.out', overwrite: true }))
    }

    media.add('(prefers-reduced-motion: reduce), (max-width: 1023px), (pointer: coarse)', () => {
      clearCards()
      gsap.set(fills, { clipPath: 'inset(100% 0 0 0)' })
      if (!reducedMotion) gsap.fromTo(cards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: section, start: 'top 85%', once: true } })
      else gsap.set(cards, { clearProps: 'all' })
      return undefined
    })

    media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      let current = -1
      const trigger = ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom', pin: section.querySelector('.featured-stage'), pinSpacing: false, scrub: 0.6, onUpdate: (self) => { const next = Math.min(2, Math.floor(self.progress * 3)); if (next !== current) { current = next; setActive(next) } } })
      const bindings = cards.map((card, index) => {
        const activate = () => setActive(index)
        card.addEventListener('pointerenter', activate)
        card.addEventListener('focusin', activate)
        return () => { card.removeEventListener('pointerenter', activate); card.removeEventListener('focusin', activate) }
      })
      ScrollTrigger.sort()
      return () => { trigger.kill(); bindings.forEach((cleanup) => cleanup()); clearCards(); gsap.set(fills, { clearProps: 'clipPath' }) }
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section ref={sectionRef} className="featured-section featured-section-rebuild bleed" data-header-theme="dark" aria-labelledby="featured-title">
      <CurvedEdge from="#fafffa" to="#121613" position="top" />
      <div className="featured-stage">
        <div className="featured-intro">
          <p className="label text-muted">03 / Current rotation</p>
          <h2 id="featured-title" className="section-title max-w-[13ch]">Next-gen basics for next-gen people</h2>
          <p className="body max-w-[25rem]">A short rotation of considered layers, cut for daily movement and made to stay in the mix.</p>
          <SolidButton to="/shop" className="mt-xl">View collection</SolidButton>
        </div>
        <div className="featured-card-list">
          {featured.map((product, index) => (
            <Link key={product.id} to={`/shop/${product.slug}`} className="featured-card" data-list-row>
              <span className="featured-card-fill" data-card-swap aria-hidden="true"><svg viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 10V3C22 1 35 4 52 2C70 0 84 4 100 1V10Z" /></svg></span>
              <span className="featured-card-content"><span className="featured-card-number">0{index + 1}</span><span className="featured-card-product">{product.name}</span><span className="featured-card-meta"><span className="label">Visit</span><Arrow /></span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
