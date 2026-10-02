import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Arrow } from './Arrow'
import { SolidButton, TextLink } from './ui/Button'
import { site } from '../data/site'
import { GSAP_EASE_OUT_EXPO, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useSmoothScroll } from './SmoothScroll'
import { CurvedEdge } from './CurvedEdge'

const footerGroups = [
  [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  [
    { label: 'Instagram', href: 'https://instagram.com/typeshi.studio' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],
]

export function Footer() {
  const [emailUser, emailDomain] = site.email.split('@')
  const footerRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { lenis } = useSmoothScroll()
  useGSAP(() => {
    registerMotionPlugins()
    const footer = footerRef.current
    const letters = footer?.querySelectorAll('[data-footer-letter]')
    if (!footer) return undefined
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: reduce)', () => gsap.set(letters, { yPercent: 0 }))
    media.add('(prefers-reduced-motion: no-preference)', () => gsap.fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: GSAP_EASE_OUT_EXPO, stagger: 0.05, scrollTrigger: { trigger: footer.querySelector('.footer-wordmark'), start: 'top 90%', once: true } }))
    return () => media.revert()
  }, { scope: footerRef, dependencies: [reducedMotion] })
  const scrollTop = () => {
    if (!reducedMotion && lenis) lenis.scrollTo(0, { duration: 1.4, easing: (value) => 1 - ((1 - value) ** 4) })
    else window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  return (
    <footer ref={footerRef} className="typeshi-footer mt-section border-t border-hairline bg-canvas px-xxl pt-section max-md:px-md max-md:pt-huge">
      <CurvedEdge from="#121613" to="#fafffa" position="top" bump />
      <div className="grid gap-huge lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.7fr)]">
        <div>
          <p className="body mb-md">Questions, collaborations, or just saying hello.</p>
          <a href={`mailto:${site.email}`} className="footer-email block max-w-full text-ink"><span>{emailUser}</span><wbr /><span>@{emailDomain}</span></a>
          <div className="footer-phone-list mt-md">{site.phones.map((phone) => <a key={phone} href={`tel:${phone}`} className="body block text-ink">{phone}</a>)}</div>
          <SolidButton to={`mailto:${site.email}`} className="mt-xl">Get in touch</SolidButton>
        </div>
        <div className="grid grid-cols-2 gap-xl lg:pt-[3.5rem]">
          {footerGroups.map((group, index) => (
            <nav key={index} aria-label={index === 0 ? 'Site links' : 'Legal and social links'} className="flex flex-col items-start gap-xs">
              {group.map((link) => link.href.startsWith('http')
                ? <TextLink key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}</TextLink>
                : <TextLink key={link.label} to={link.href}>{link.label}</TextLink>)}
            </nav>
          ))}
        </div>
      </div>
      <div className="mt-section grid gap-xl border-t border-hairline py-xl text-muted md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div className="body">{site.address.map((line) => <span key={line} className="block">{line}</span>)}</div>
        <p className="body">&copy; Typeshi 2026</p>
        <button type="button" onClick={scrollTop} className="footer-top-button label inline-flex min-h-[44px] items-center gap-xs justify-self-start text-ink md:justify-self-end">Top of page<Arrow direction="up" /></button>
      </div>
      <div className="footer-wordmark" aria-hidden="true"><img data-footer-letter src="/logo/logo.svg" alt="" /></div>
    </footer>
  )
}
