import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Logo } from './Logo'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

export function Header({ onMenu, onCart, cartCount = 0, tone = 'light', menuOpen = false, menuButtonRef, cartButtonRef }) {
  const internalMenuRef = useRef(null)
  const menuRef = menuButtonRef || internalMenuRef
  const headerRef = useRef(null)
  const logoRef = useRef(null)
  const barsRef = useRef([])
  const countRef = useRef(null)
  const headerRouteRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const location = useLocation()
  const [sectionTone, setSectionTone] = useState(tone)
  const textTone = menuOpen ? 'dark' : sectionTone
  const textClass = textTone === 'dark' ? 'text-on-dark' : 'text-ink'

  useGSAP(() => {
    registerMotionPlugins()
    const bars = barsRef.current.filter(Boolean)
    bars.forEach((bar) => gsap.killTweensOf(bar))
    if (reducedMotion || menuOpen) {
      gsap.set(bars, { scaleY: 1 })
      return undefined
    }
    const tweens = bars.map((bar, index) => gsap.to(bar, { scaleY: [0.55, 0.78, 0.62][index], duration: [0.8, 1.05, 0.92][index], repeat: -1, yoyo: true, ease: 'power4.inOut', delay: index * 0.08 }))
    const handleVisibility = () => tweens.forEach((tween) => document.hidden ? tween.pause() : tween.resume())
    document.addEventListener('visibilitychange', handleVisibility)
    return () => { document.removeEventListener('visibilitychange', handleVisibility); tweens.forEach((tween) => tween.kill()) }
  }, { scope: headerRef, dependencies: [reducedMotion, menuOpen] })

  useGSAP(() => {
    registerMotionPlugins()
    let triggers = []
    let cancelled = false
    const activeDark = new Set()
    const updateTone = () => setSectionTone(activeDark.size ? 'dark' : 'light')
    const cleanup = () => {
      triggers.forEach((trigger) => trigger.kill())
      triggers = []
      activeDark.clear()
    }
    const setup = () => {
      if (cancelled) return
      cleanup()
      const markers = Array.from(document.querySelectorAll('section[data-header-theme]'))
      triggers = markers.map((marker) => ScrollTrigger.create({ trigger: marker, start: 'top 10%', end: 'bottom 10%', onToggle: (self) => { if (self.isActive) activeDark.add(marker); else activeDark.delete(marker); updateTone() } }))
      ScrollTrigger.refresh()
      triggers.forEach((trigger, index) => { if (trigger.isActive) activeDark.add(markers[index]) })
      updateTone()
    }
    const initial = headerRouteRef.current === null
    headerRouteRef.current = location.pathname
    if (!initial) { cleanup(); updateTone() }
    const frame = initial ? requestAnimationFrame(setup) : 0
    const onMounted = () => requestAnimationFrame(setup)
    window.addEventListener('typeshi:page-mounted', onMounted)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('typeshi:page-mounted', onMounted)
      cleanup()
    }
  }, { scope: headerRef, dependencies: [location.pathname] })

  useGSAP(() => {
    registerMotionPlugins()
    const logo = logoRef.current
    if (!logo) return undefined
    const image = logo.querySelector('[data-logo-image]')
    const underline = logo.querySelector('[data-logo-underline]')
    if (!image || !underline) return undefined
    const media = gsap.matchMedia()
    const setCollapsed = (collapsed, animate) => {
      const options = animate && !reducedMotion ? { duration: 0.5, ease: 'expo.out', stagger: 0.035 } : { duration: 0 }
      gsap.to(image, { clipPath: collapsed ? 'inset(0 82% 0 0)' : 'inset(0 0% 0 0)', ...options })
      gsap.to(underline, { scaleX: collapsed ? 0.3 : 1, duration: animate && !reducedMotion ? 0.5 : 0, ease: 'expo.out' })
    }
    const setup = () => {
      const hero = document.querySelector('.home-hero')
      if (!hero) { setCollapsed(false, false); return undefined }
      const trigger = ScrollTrigger.create({ trigger: hero, start: 'bottom top+=80px', onEnter: () => { if (window.scrollY > 40) setCollapsed(true, true) }, onLeaveBack: () => setCollapsed(false, true) })
      const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY
      setCollapsed(window.scrollY > 40 && window.scrollY >= heroBottom - 80, false)
      if (window.scrollY <= 40) setCollapsed(false, false)
      return () => trigger.kill()
    }
    let cleanup = setup()
    const onMounted = () => { cleanup?.(); cleanup = setup() }
    window.addEventListener('typeshi:page-mounted', onMounted)
    media.add('(prefers-reduced-motion: reduce), (prefers-reduced-motion: no-preference)', () => undefined)
    return () => { cleanup?.(); window.removeEventListener('typeshi:page-mounted', onMounted); media.revert() }
  }, { scope: headerRef, dependencies: [location.pathname, reducedMotion] })

  useGSAP(() => {
    if (!countRef.current || reducedMotion) return undefined
    gsap.fromTo(countRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.35, ease: 'expo.out' })
    return undefined
  }, { scope: headerRef, dependencies: [cartCount, reducedMotion] })

  return (
    <header ref={headerRef} className={`fixed inset-x-0 top-0 z-40 flex items-center px-xxl py-xxl max-md:px-md max-md:py-md ${textClass}`}>
      <Link to="/" aria-label="Typeshi home" className="flex min-h-[44px] items-center">
        <Logo innerRef={logoRef} tone={textTone} />
      </Link>
      <div className="typeshi-controls">
        <nav aria-label="Utility navigation" className="typeshi-utility flex shrink-0 items-center gap-md">
          <button ref={menuRef} data-magnetic type="button" onClick={onMenu} aria-expanded={menuOpen} aria-controls="typeshi-menu-overlay" className="typeshi-menu-button label flex min-h-[44px] shrink-0 items-center gap-xs">
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
            <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
              <span ref={(element) => { barsRef.current[0] = element }} className="menu-bar h-2" />
              <span ref={(element) => { barsRef.current[1] = element }} className="menu-bar h-4" />
              <span ref={(element) => { barsRef.current[2] = element }} className="menu-bar h-3" />
            </span>
          </button>
        </nav>
        <button ref={cartButtonRef} data-cart-trigger type="button" onClick={onCart} className="typeshi-cart-button label inline-flex min-h-[44px] shrink-0 items-center" style={{ zIndex: 41 }} aria-label={`Open cart, ${cartCount} items`}><span>Cart (</span><span className="cart-count-mask"><span ref={countRef}>{cartCount}</span></span><span>)</span><span className="sr-only" aria-live="polite">{cartCount} cart items</span></button>
      </div>
    </header>
  )
}
