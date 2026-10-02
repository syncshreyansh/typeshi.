import { Tile } from '../components/Tile'
import { heroTiles } from '../data/heroTiles'
import { useMarqueeMotion } from '../hooks/useMarqueeMotion'
import { CurvedEdge } from '../components/CurvedEdge'

function MarqueeRow({ children, image, offset }) {
  const content = <>{children}<Tile src={image} alt="" data-marquee-tile className="marquee-tile marquee-tile-wide" />{children}<Tile src={image} alt="" data-marquee-tile className="marquee-tile marquee-tile-wide" /></>
  return (
    <div className={`marquee-row ${offset}`} data-marquee-row>
      <div className="marquee-track" data-marquee-track data-marquee-dir={offset === 'marquee-row-a' ? '-1' : '1'} data-marquee-duration={offset === 'marquee-row-a' ? '60' : '75'}><div className="marquee-track-content">{content}</div><div className="marquee-track-content" aria-hidden="true">{content}</div></div>
    </div>
  )
}

export function MarqueeOne() {
  const { sectionRef } = useMarqueeMotion({ duration: 60, direction: -1 })
  return (
    <section ref={sectionRef} className="marquee-one" aria-label="Typeshi material principles">
      <CurvedEdge from="#121613" to="#fafffa" position="top" />
      <MarqueeRow image={heroTiles[0].tees} offset="marquee-row-a"><span className="marquee-word marquee-word-serif">Heavyweight</span><span className="marquee-word marquee-word-pixel">Cotton</span></MarqueeRow>
      <MarqueeRow image={heroTiles[2].streetwear} offset="marquee-row-b"><span className="marquee-word marquee-word-pixel">Built</span><span className="marquee-word marquee-word-serif">for</span><span className="marquee-word marquee-word-pixel">Everyday</span></MarqueeRow>
    </section>
  )
}
