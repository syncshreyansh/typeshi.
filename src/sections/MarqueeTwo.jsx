import { Tile } from '../components/Tile'
import { heroTiles } from '../data/heroTiles'
import { useMarqueeMotion } from '../hooks/useMarqueeMotion'
import { CurvedEdge } from '../components/CurvedEdge'

export function MarqueeTwo() {
  const { sectionRef } = useMarqueeMotion({ duration: 90, direction: -1 })
  return (
    <section ref={sectionRef} className="marquee-two bleed" data-header-theme="dark" aria-label="Typeshi bridge between street and studio">
      <div className="marquee-two-label label">08 / From idea to everyday</div>
      <div className="marquee-two-row" data-marquee-row data-marquee-track>
        <div className="marquee-track-content"><span className="marquee-word marquee-word-serif">Bridging</span><span className="marquee-word marquee-word-pixel">the</span><span className="marquee-word marquee-word-serif">Streets</span><Tile src={heroTiles[0].streetwear} alt="" data-marquee-tile className="marquee-two-tile" /><span className="marquee-word marquee-word-pixel">With</span><span className="marquee-word marquee-word-serif">the</span><span className="marquee-word marquee-word-pixel">Studio</span><Tile src={heroTiles[3].tees} alt="" data-marquee-tile className="marquee-two-tile" /></div>
        <div className="marquee-track-content" aria-hidden="true"><span className="marquee-word marquee-word-serif">Bridging</span><span className="marquee-word marquee-word-pixel">the</span><span className="marquee-word marquee-word-serif">Streets</span><Tile src={heroTiles[0].streetwear} alt="" data-marquee-tile className="marquee-two-tile" /><span className="marquee-word marquee-word-pixel">With</span><span className="marquee-word marquee-word-serif">the</span><span className="marquee-word marquee-word-pixel">Studio</span><Tile src={heroTiles[3].tees} alt="" data-marquee-tile className="marquee-two-tile" /></div>
      </div>
    </section>
  )
}
