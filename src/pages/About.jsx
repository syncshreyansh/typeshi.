import { useEffect, useRef } from 'react'
import { useLineReveal } from '../hooks/useLineReveal'
import { usePreloader } from '../components/Preloader'
import { Tile } from '../components/Tile'
import { SolidButton } from '../components/ui/Button'
import { heroTiles } from '../data/heroTiles'
import { setPageMeta } from '../lib/meta'

const values = [
  ['01', 'Heavy fabric', 'Weight you can feel before the first wash.'],
  ['02', 'Honest fit', 'Room where you need it, shape where it matters.'],
  ['03', 'Small drops', 'Less noise. Better pieces. No fake urgency.'],
]

export function About() {
  const pageRef = useRef(null)
  const { preloaderDone } = usePreloader()
  useLineReveal({ scope: pageRef, preloaderDone, selector: '[data-line-reveal]' })
  useEffect(() => { setPageMeta('About / Typeshi', 'The point of view behind Typeshi heavyweight everyday apparel.') }, [])

  return (
    <section ref={pageRef} className="about-page" aria-labelledby="about-title">
      <div className="about-hero">
        <p className="label text-muted">About / Typeshi studio</p>
        <div className="line-reveal-mask"><h1 id="about-title" data-line-reveal className="display-xl about-hero-title"><span className="line-reveal-word">Made for</span><span className="line-reveal-word">the <Tile src={heroTiles[1].tees} alt="Black and white cotton texture" className="about-hero-tile" />Everyday</span><span className="line-reveal-word">Not the</span><span className="line-reveal-word">Algorithm.</span></h1></div>
      </div>
      <div className="about-story">
        <p className="label text-muted">01 / Why we make</p>
        <div className="about-story-copy">
          <p className="body">Typeshi started with a simple irritation: the everyday wardrobe had become too polite, too thin, and too quick to forget.</p>
          <p className="body">We make clothes for the long route home. Dense cotton, considered cuts, and graphics that feel like they belong to a person, not a trend report.</p>
          <p className="body">Everything is demo-made in this build, but the brief is real: make fewer pieces and give each one a reason to exist.</p>
          <blockquote className="about-quote display-xl">Wear it until it knows your shape.</blockquote>
        </div>
      </div>
      <div className="about-values">
        <div className="about-values-heading"><p className="label text-muted">02 / The standard</p><h2 className="section-title">A little less noise.</h2></div>
        <div className="about-values-list">{values.map(([number, title, copy]) => <article className="about-value" key={number}><span className="about-value-number">{number}</span><div><h3 className="subheading">{title}</h3><p className="body">{copy}</p></div></article>)}</div>
      </div>
      <div className="about-studio">
        <div className="about-studio-image"><Tile src={heroTiles[2].streetwear} alt="Black and white streetwear portrait" className="about-portrait about-portrait-large" /></div>
        <div className="about-studio-copy"><p className="label text-muted">03 / The studio</p><h2 className="section-title">Small room.<br />Big taste.</h2><p className="body">Typeshi is a demo label with a real point of view, built from a corner of Kolkata and a folder full of references.</p><Tile src={heroTiles[3].tees} alt="Black and white apparel detail" className="about-portrait about-portrait-small" /><p className="body">Research, sampling, repeat. That is the whole studio ritual.</p></div>
      </div>
      <div className="about-cta"><p className="display-xl">Find your everyday uniform.</p><SolidButton to="/shop">Shop the drop</SolidButton></div>
    </section>
  )
}
