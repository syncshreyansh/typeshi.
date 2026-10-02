import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Tile } from '../components/Tile'
import { SolidButton } from '../components/ui/Button'
import { heroTiles } from '../data/heroTiles'
import { GSAP_EASE_OUT_EXPO, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { CurvedEdge } from '../components/CurvedEdge'

const scenes = [
  { image: heroTiles[1].streetwear, text: 'Our existing wardrobe is boring.', alt: 'Streetwear portrait' },
  { image: heroTiles[2].tees, text: 'Better weight. Better shape. Better reasons.', alt: 'Everyday apparel detail' },
  { image: heroTiles[3].streetwear, text: 'Made to move and stay in rotation.', alt: 'Street uniform in motion' },
]

function SceneStatement({ scene }) {
  return <h2 className="story-scene-statement display-xl" aria-label={scene.text}>{scene.text.split(' ').map((word, index) => <span key={`${word}-${index}`} className="story-statement-word" aria-hidden="true">{word}{index < scene.text.split(' ').length - 1 ? ' ' : ''}</span>)}</h2>
}

export function Story() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const previousIndexRef = useRef(0)
  const currentIndexRef = useRef(0)
  const transitionRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    registerMotionPlugins()
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return undefined
    const sceneNodes = Array.from(section.querySelectorAll('[data-story-scene]'))
    const progressLines = Array.from(section.querySelectorAll('[data-story-progress]'))
    if (reducedMotion) {
      sceneNodes.forEach((node) => gsap.set(node, { autoAlpha: 1, clearProps: 'transform' }))
      progressLines.forEach((line) => gsap.set(line, { scaleX: 1 }))
      return undefined
    }
    const media = gsap.matchMedia()
    media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const initialWords = sceneNodes[0]?.querySelectorAll('.story-statement-word')
      if (initialWords?.length) gsap.fromTo(initialWords, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: section, start: 'top 80%', once: true } })
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: stage,
        pinSpacing: false,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          const next = Math.min(2, Math.floor(self.progress * 3))
          if (next !== currentIndexRef.current) { currentIndexRef.current = next; setCurrentIndex(next) }
        },
      })
      return () => trigger.kill()
    })
    media.add('(max-width: 1023px), (pointer: coarse)', () => {
      sceneNodes.forEach((node) => {
        const image = node.querySelector('[data-story-image]')
        if (image) gsap.fromTo(image, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: GSAP_EASE_OUT_EXPO, scrollTrigger: { trigger: node, start: 'top 88%', once: true } })
        const words = node.querySelectorAll('.story-statement-word')
        if (words.length) gsap.fromTo(words, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: node, start: 'top 82%', once: true } })
      })
    })
    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion] })

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return undefined
    const sceneNodes = Array.from(sectionRef.current.querySelectorAll('[data-story-scene]'))
    const progressLines = Array.from(sectionRef.current.querySelectorAll('[data-story-progress]'))
    const next = currentIndex
    const previous = previousIndexRef.current
    if (next === previous) return undefined
    transitionRef.current?.kill()
    sceneNodes.forEach((node) => gsap.set(node, { autoAlpha: 0, zIndex: 1 }))
    const outgoing = sceneNodes[previous]
    const incoming = sceneNodes[next]
    if (!outgoing || !incoming) return undefined
    const outgoingImage = outgoing.querySelector('[data-story-image]')
    const incomingImage = incoming.querySelector('[data-story-image]')
    const outgoingText = outgoing.querySelector('.story-scene-statement')
    const incomingText = incoming.querySelector('.story-scene-statement')
    const incomingWords = incoming.querySelectorAll('.story-statement-word')
    const forward = next > previous
    const timeline = gsap.timeline({ defaults: { ease: 'power4.inOut' }, onComplete: () => { gsap.set(outgoing, { autoAlpha: 0, zIndex: 1 }); gsap.set(incoming, { autoAlpha: 1, zIndex: 3 }); transitionRef.current = null } })
    gsap.set(outgoing, { autoAlpha: 1, zIndex: 2 })
    gsap.set(incoming, { autoAlpha: 1, zIndex: 3 })
    gsap.set(incomingImage, { clipPath: forward ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', scale: 1.08 })
    gsap.set(incomingText, { opacity: 1, y: 0 })
    gsap.set(incomingWords, { opacity: 0, y: 18 })
    timeline.to(outgoingImage, { clipPath: forward ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)', duration: 0.8 }, 0)
      .to(incomingImage, { clipPath: 'inset(0 0 0 0)', scale: 1, duration: 0.8 }, 0)
      .to(outgoingText, { opacity: 0, y: forward ? -24 : 24, duration: 0.4 }, 0)
      .to(incomingWords, { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, ease: 'expo.out' }, 0.2)
    progressLines.forEach((line, index) => timeline.to(line, { scaleX: index === next ? 1 : 0.35, duration: 0.4, ease: 'expo.out' }, 0))
    previousIndexRef.current = next
    transitionRef.current = timeline
    return () => { timeline.kill(); if (transitionRef.current === timeline) transitionRef.current = null }
  }, { scope: sectionRef, dependencies: [currentIndex, reducedMotion] })

  return (
    <section ref={sectionRef} className="story-section story-scene-section bleed" data-header-theme="dark" aria-labelledby="story-title">
      <CurvedEdge from="#fafffa" to="#121613" position="top" />
      <div ref={stageRef} className="story-stage">
        <div className="story-stage-heading"><p className="label text-muted">01 / The reason we started</p><span className="story-scroll-label">Scroll</span></div>
        <div className="story-scenes" aria-live="polite">
          {scenes.map((scene) => <article key={scene.text} className="story-scene" data-story-scene><Tile src={scene.image} alt={scene.alt} data-story-image className="story-scene-image" /><SceneStatement scene={scene} /></article>)}
        </div>
        <div className="story-drop story-drop-fixed"><h3 id="story-title" className="section-title">The Drop</h3><p className="body">Good clothes do not need a loud introduction. Just better weight, better shape, and a reason to wear them again tomorrow.</p><SolidButton to="/shop">View Collection</SolidButton></div>
        <div className="story-progress" aria-hidden="true">{scenes.map((scene) => <span key={scene.text} data-story-progress />)}</div>
      </div>
    </section>
  )
}
