import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Hero } from '../sections/Hero'
import { Story } from '../sections/Story'
import { MarqueeOne } from '../sections/MarqueeOne'
import { FeaturedList } from '../sections/FeaturedList'
import { Categories } from '../sections/Categories'
import { Approach } from '../sections/Approach'
import { Stats } from '../sections/Stats'
import { MarqueeTwo } from '../sections/MarqueeTwo'
import { FinalCta } from '../sections/FinalCta'
import { setPageMeta } from '../lib/meta'

export function Home() {
  useEffect(() => { setPageMeta('Typeshi', 'Heavyweight everyday apparel for the culture.') }, [])
  useEffect(() => {
    let timer
    let settled = false
    const refresh = () => {
      if (settled) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => { settled = true; ScrollTrigger.sort(); ScrollTrigger.refresh() }, 150)
    }
    const images = Array.from(document.querySelectorAll('.home-page img'))
    images.forEach((image) => image.addEventListener('load', refresh, { once: true }))
    document.fonts?.ready.then(refresh)
    refresh()
    return () => { window.clearTimeout(timer); images.forEach((image) => image.removeEventListener('load', refresh)) }
  }, [])
  return (
    <div className="home-page">
      <Hero />
      <Story />
      <MarqueeOne />
      <FeaturedList />
      <Categories />
      <Approach />
      <Stats />
      <MarqueeTwo />
      <FinalCta />
    </div>
  )
}
