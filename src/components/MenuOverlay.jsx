import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Arrow } from './Arrow'
import { site } from '../data/site'
import { useTypewriter } from '../hooks/useTypewriter'
import { useReducedMotion } from '../hooks/useReducedMotion'

function MenuLink({ link, active, enabled, onSelect }) {
  const textRef = useRef(null)
  useTypewriter({ ref: textRef, text: link.label, active: enabled, stay: true, speed: 0.04 })
  return <Link to={link.href} onClick={(event) => onSelect(event, link.href)} className={`menu-overlay-link display-xl py-xs ${active ? 'is-current' : ''}`}><span className="menu-link-mask"><span ref={textRef} data-menu-link data-text={link.label} className="menu-link-label" /></span></Link>
}

export function MenuOverlay({ open, onClose, returnFocusRef }) {
  const closeRef = useRef(null)
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const contentRef = useRef(null)
  const timelineRef = useRef(null)
  const navigateAfterCloseRef = useRef(null)
  const hasOpenedRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const [typeReady, setTypeReady] = useState(false)

  useGSAP(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    const content = contentRef.current
    if (!overlay || !panel || !content) return undefined
    const links = overlay.querySelectorAll('[data-menu-link]')
    const contact = overlay.querySelector('[data-menu-contact]')
    const giant = overlay.querySelector('[data-menu-giant]')
    const grain = overlay.querySelector('[data-menu-grain]')
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })
    tl.set(overlay, { autoAlpha: 1, visibility: 'visible' })
      .fromTo(panel, { xPercent: -100 }, { xPercent: 0, duration: 1.1 }, 0)
      .fromTo(content, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0.72)
      .call(() => setTypeReady(true), [], 0.72)
      .fromTo(links, { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, stagger: 0.12 }, 0.72)
      .fromTo(contact, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 1.05)
      .fromTo(giant, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 1.05)
      .fromTo(grain, { autoAlpha: 0 }, { autoAlpha: 0.35, duration: 0.3 }, 0.75)
    tl.eventCallback('onReverseComplete', () => { setTypeReady(false); gsap.set(overlay, { autoAlpha: 0, visibility: 'hidden' }); overlay.setAttribute('aria-hidden', 'true'); overlay.inert = true; returnFocusRef?.current?.focus(); const next = navigateAfterCloseRef.current; navigateAfterCloseRef.current = null; next?.() })
    timelineRef.current = tl
    gsap.set(overlay, { autoAlpha: 0, visibility: 'hidden' })
    overlay.inert = true
    return () => { tl.kill(); timelineRef.current = null }
  }, { scope: overlayRef })

  useEffect(() => {
    const overlay = overlayRef.current
    const tl = timelineRef.current
    if (!overlay || !tl) return undefined
    if (reducedMotion) {
      if (open) { setTypeReady(true); gsap.set(overlay, { autoAlpha: 1, visibility: 'visible' }); gsap.set(overlay.querySelectorAll('.menu-overlay-panel, .menu-overlay-scroll, [data-menu-contact], [data-menu-giant], [data-menu-grain], [data-menu-link]'), { clearProps: 'all' }); overlay.inert = false; overlay.setAttribute('aria-hidden', 'false') }
      else { setTypeReady(false); gsap.to(overlay, { autoAlpha: 0, duration: 0.2, onComplete: () => { overlay.inert = true; overlay.setAttribute('aria-hidden', 'true'); returnFocusRef?.current?.focus() } }) }
      return undefined
    }
    overlay.inert = false
    if (open) {
      hasOpenedRef.current = true
      overlay.setAttribute('aria-hidden', 'false')
      tl.play()
    }
    else if (hasOpenedRef.current) tl.reverse()
    return undefined
  }, [open, reducedMotion, returnFocusRef])

  useEffect(() => {
    if (!open) return undefined
    closeRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusable = overlayRef.current?.querySelectorAll('button, a[href]') || []
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const closeMenu = () => {
    const tl = timelineRef.current
    if (reducedMotion || !tl || !hasOpenedRef.current) {
      onClose()
      return
    }
    tl.reverse()
    onClose()
  }

  const selectLink = (event, href) => {
    event.preventDefault()
    onClose()
    if (reducedMotion) navigate(href)
    else {
      const tl = timelineRef.current
      navigateAfterCloseRef.current = () => navigate(href)
    }
  }

  return (
    <aside ref={overlayRef} id="typeshi-menu-overlay" className="typeshi-menu-overlay fixed inset-0 z-50" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Main menu">
      <div ref={panelRef} className="menu-overlay-panel">
        <svg className="menu-overlay-edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100 C88 22 92 40 100 56 C88 76 92 88 100 100H0Z" /></svg>
        <div ref={contentRef} data-lenis-prevent className="menu-overlay-scroll flex min-h-full flex-col px-xxl py-xxl max-md:px-md max-md:py-md">
          <div className="flex items-start justify-between"><span className="label">Typeshi / Menu</span><button ref={closeRef} type="button" onClick={closeMenu} className="label min-h-[44px] underline decoration-hairline underline-offset-4">Close</button></div>
          <nav aria-label="Main navigation" className="menu-overlay-nav mt-[12vh] flex flex-col items-start">{site.navLinks.map((link) => <MenuLink key={link.href} link={link} active={location.pathname === link.href} enabled={open && typeReady} onSelect={selectLink} />)}</nav>
          <div data-menu-contact className="mt-auto grid gap-xl border-t border-muted-soft pt-xl md:grid-cols-2"><div><p className="body text-on-dark">Get in touch</p><div className="mt-md flex flex-col items-start gap-xs"><a className="label inline-flex min-h-[44px] items-center gap-xs" href={`mailto:${site.email}`}>{site.email}<Arrow /></a><a className="label inline-flex min-h-[44px] items-center gap-xs" href={`https://instagram.com/${site.instagram.replace('@', '')}`}>{site.instagram}<Arrow /></a></div></div><p className="body max-w-[22rem] text-on-dark">Clothes for the in-between hours, the long routes, and the people making their own scene.</p></div>
          <p data-menu-giant className="menu-overlay-giant font-serif-display" aria-hidden="true">Get in touch</p>
        </div>
      </div>
      <div data-menu-grain className="menu-overlay-grain" aria-hidden="true" />
    </aside>
  )
}
