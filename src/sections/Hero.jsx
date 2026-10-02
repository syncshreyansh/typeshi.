import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tile } from '../components/Tile'
import { heroTiles } from '../data/heroTiles'
import { GSAP_EASE_OUT_EXPO, MOTION_DURATIONS, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { usePreloader } from '../components/Preloader'
import TechText from '../components/TechText'

const words = (text) => text.split(' ').map((word, index) => <span key={`${word}-${index}`} className="hero-word">{word}</span>)
const tile = (src, swapSrc, orientation, alt) => (
  <Tile src={src} swapSrc={swapSrc} alt={alt} data-hero-tile className={`hero-tile hero-tile-${orientation}`} />
)

export function Hero() {
  const sectionRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { preloaderDone } = usePreloader()
  const preloaderDoneRef = useRef(preloaderDone)
  const hasPlayedRef = useRef(false)
  useEffect(() => { preloaderDoneRef.current = preloaderDone }, [preloaderDone])
  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    if (!section) return undefined
    let activeCleanup
    const playIntro = () => {
      if (hasPlayedRef.current) return undefined
      hasPlayedRef.current = true
      document.documentElement.classList.remove('intro-pending')
      const media = gsap.matchMedia()
      const lines = section.querySelectorAll('[data-hero-line]')
      const words = section.querySelectorAll('.hero-word')
      const tiles = section.querySelectorAll('[data-hero-tile]')
      const scrollLine = section.querySelector('.hero-scroll-line')
      if (words.length) gsap.set(words, { yPercent: 110 })
      if (tiles.length) gsap.set(tiles, { clipPath: 'inset(0 0 100% 0)', scale: 1.08 })
      if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (words.length) gsap.set(words, { yPercent: 0 })
        if (tiles.length) gsap.set(tiles, { clipPath: 'inset(0 0 0 0)', scale: 1 })
        if (scrollLine) gsap.set(scrollLine, { scaleX: 1 })
        return () => { media.revert(); hasPlayedRef.current = false }
      }
      const intro = gsap.timeline()
      Array.from(lines).forEach((line, index) => {
        const lineWords = line.querySelectorAll('.hero-word')
        if (lineWords.length) intro.to(lineWords, { yPercent: 0, duration: MOTION_DURATIONS.base, ease: GSAP_EASE_OUT_EXPO, stagger: 0.06 }, index * 0.1)
      })
      if (tiles.length) intro.to(tiles, { clipPath: 'inset(0 0 0 0)', scale: 1, duration: MOTION_DURATIONS.base, ease: GSAP_EASE_OUT_EXPO, stagger: 0.08 }, '-=0.52')
      if (scrollLine) intro.to(scrollLine, { scaleX: 1, duration: 0.8, ease: GSAP_EASE_OUT_EXPO }, '-=0.2')
      media.add('(min-width: 1024px) and (pointer: fine)', () => {
        const states = Array.from(tiles).map((tileElement) => {
          const swap = tileElement.querySelector('[data-tile-swap]')
          if (!swap) return null
          const state = { scroll: 0, hover: 0 }
          const apply = () => gsap.to(swap, { clipPath: `inset(${100 - (Math.max(state.scroll, state.hover) * 100)}% 0 0 0)`, duration: 0.35, overwrite: true, ease: 'power4.out' })
          const enter = () => { state.hover = 1; apply() }
          const leave = () => { state.hover = 0; apply() }
          tileElement.addEventListener('pointerenter', enter)
          tileElement.addEventListener('pointerleave', leave)
          return { swap, state, apply, tileElement, enter, leave }
        }).filter(Boolean)
        const swapTimeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=70%', scrub: 0.6 } })
        states.forEach(({ swap }, index) => swapTimeline.to(swap, { clipPath: 'inset(0 0 0 0)', duration: 1, ease: 'none' }, index / Math.max(states.length, 1)))
        const parallaxTimeline = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=70%', scrub: 0.6 } })
        if (tiles.length) parallaxTimeline.to(tiles, { yPercent: (index) => -(6 + ((index % 5) * 2)), ease: 'none' }, 0)
        if (lines.length) parallaxTimeline.to(lines, { xPercent: (index) => index % 2 ? 2 : -2, ease: 'none' }, 0)
        return () => { states.forEach(({ tileElement, enter, leave }) => { tileElement.removeEventListener('pointerenter', enter); tileElement.removeEventListener('pointerleave', leave) }); swapTimeline.scrollTrigger?.kill(); parallaxTimeline.scrollTrigger?.kill(); swapTimeline.kill(); parallaxTimeline.kill() }
      })
      return () => { intro.kill(); media.revert(); hasPlayedRef.current = false }
    }
    const safetyTimer = window.setTimeout(() => { if (!hasPlayedRef.current && !document.documentElement.classList.contains('route-transitioning')) activeCleanup = playIntro() }, 3000)
    if (reducedMotion || (preloaderDoneRef.current && !document.documentElement.classList.contains('route-transitioning'))) return playIntro()
    if (document.documentElement.classList.contains('route-transitioning')) {
      const handleRoute = () => { activeCleanup = playIntro() }
      window.addEventListener('typeshi:route-revealed', handleRoute, { once: true })
      return () => { window.clearTimeout(safetyTimer); window.removeEventListener('typeshi:route-revealed', handleRoute); activeCleanup?.(); hasPlayedRef.current = false }
    }
    const handleDone = () => { activeCleanup = playIntro() }
    window.addEventListener('typeshi:preloader-done', handleDone, { once: true })
    return () => { window.clearTimeout(safetyTimer); window.removeEventListener('typeshi:preloader-done', handleDone); activeCleanup?.(); hasPlayedRef.current = false }
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  return (
    <section ref={sectionRef} className="home-hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="home-hero-headline display-xl">
        <span className="hero-line-mask"><span className="hero-line hero-line-one" data-hero-line="1">
          <span className="hero-word hero-word-tech">
            <TechText
              text="Wear"
              fontFamily="'Google Sans Flex Variable', sans-serif"
              fontWeight={550}
              fontSize={160}
              letterSpacing={-0.04}
              color="#121613"
              accentColor="#2bee4b"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
            />
          </span>
          {tile(heroTiles[0].tees, heroTiles[0].streetwear, 'landscape', 'Close-up of a Typeshi tee')}
          {tile(heroTiles[0].streetwear, heroTiles[0].tees, 'portrait', 'Streetwear in the city')}
        </span></span>
        <span className="hero-line-mask"><span className="hero-line hero-line-two" data-hero-line="2">{words('the Culture')}{tile(heroTiles[1].tees, heroTiles[1].streetwear, 'landscape', 'Cotton apparel detail')}</span></span>
        <span className="hero-line-mask"><span className="hero-line hero-line-three" data-hero-line="3">{tile(heroTiles[2].tees, heroTiles[2].streetwear, 'portrait', 'Layered streetwear')}{words('Stitched for')}{tile(heroTiles[2].streetwear, heroTiles[2].tees, 'landscape', 'Street style detail')}</span></span>
        <span className="hero-line-mask"><span className="hero-line hero-line-four" data-hero-line="4">{words('the Streets')}{tile(heroTiles[3].tees, heroTiles[3].streetwear, 'portrait', 'Everyday street uniform')}</span></span>
      </h1>
      <div className="hero-scroll label" aria-hidden="true"><span>Scroll</span><span className="hero-scroll-line" /></div>
    </section>
  )
}
