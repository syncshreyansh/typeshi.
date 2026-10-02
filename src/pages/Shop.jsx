import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'
import { TextLink } from '../components/ui/Button'
import { setPageMeta } from '../lib/meta'
import { useLineReveal } from '../hooks/useLineReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { registerMotionPlugins } from '../lib/motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const filters = [
  ['all', 'All'],
  ['tees', 'Tees'],
  ['hoodies', 'Hoodies'],
  ['caps', 'Caps'],
]

const sortOptions = [
  ['featured', 'Featured'],
  ['low', 'Price low to high'],
  ['high', 'Price high to low'],
  ['newest', 'Newest'],
]

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'
  const [sort, setSort] = useState('featured')
  const [sortOpen, setSortOpen] = useState(false)
  const pageRef = useRef(null)
  const gridRef = useRef(null)
  const sortMenuRef = useRef(null)
  const filtersRef = useRef(null)
  const filterIndicatorRef = useRef(null)
  const flipState = useRef(null)
  const activeFlipRef = useRef(null)
  const revealedIdsRef = useRef(new Set())
  const batchTriggersRef = useRef([])
  const reducedMotion = useReducedMotion()

  const visibleProducts = useMemo(() => {
    const next = category === 'all' ? [...products] : products.filter((product) => product.category === category)
    if (sort === 'low') return next.sort((a, b) => a.price - b.price)
    if (sort === 'high') return next.sort((a, b) => b.price - a.price)
    if (sort === 'newest') return next.sort((a, b) => Number(Boolean(b.tag === 'New')) - Number(Boolean(a.tag === 'New')))
    return next
  }, [category, sort])

  useLineReveal({ scope: pageRef, selector: '[data-line-reveal]' })

  useEffect(() => { setPageMeta('Shop / Typeshi', 'Shop heavyweight tees, hoodies, and caps from Typeshi.') }, [])

  useEffect(() => {
    const updateIndicator = () => {
      const button = filtersRef.current?.querySelector('.is-active')
      if (!button || !filterIndicatorRef.current) return
      gsap.to(filterIndicatorRef.current, { x: button.offsetLeft, width: button.offsetWidth, duration: 0.5, ease: 'expo.out' })
    }
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [category])

  const prepareForFlip = () => {
    if (activeFlipRef.current) {
      activeFlipRef.current.kill()
      activeFlipRef.current = null
    }
    if (gridRef.current) {
      const cards = Array.from(gridRef.current.children)
      gsap.killTweensOf(cards)
      cards.forEach((card) => {
        card.style.removeProperty('transform')
        card.dataset.revealed = 'true'
        const id = card.dataset.productId
        if (id) revealedIdsRef.current.add(id)
        gsap.set(card, { opacity: 1, y: 0, clearProps: 'transform,x,y' })
      })
      if (!reducedMotion) {
        flipState.current = Flip.getState(cards)
      }
    }
  }

  useEffect(() => {
    if (!gridRef.current) return
    registerMotionPlugins()
    const cards = Array.from(gridRef.current.children)

    if (reducedMotion) {
      if (activeFlipRef.current) {
        activeFlipRef.current.kill()
        activeFlipRef.current = null
      }
      gsap.killTweensOf(cards)
      cards.forEach((card) => {
        card.style.removeProperty('transform')
        card.dataset.revealed = 'true'
        const id = card.dataset.productId
        if (id) revealedIdsRef.current.add(id)
      })
      gsap.set(cards, { opacity: 1, y: 0, clearProps: 'transform,x,y' })
      flipState.current = null
      ScrollTrigger.refresh()
      return
    }

    if (flipState.current) {
      activeFlipRef.current = Flip.from(flipState.current, {
        duration: 0.7,
        ease: 'expo.out',
        absolute: false,
        onEnter: (elements) => {
          elements.forEach((el) => {
            el.dataset.revealed = 'true'
            const id = el.dataset.productId
            if (id) revealedIdsRef.current.add(id)
          })
          return gsap.fromTo(elements, { opacity: 0, y: 0 }, { opacity: 1, duration: 0.35, ease: 'expo.out' })
        },
        onLeave: (elements) => gsap.to(elements, { opacity: 0, duration: 0.3 }),
        onComplete: () => {
          activeFlipRef.current = null
          if (gridRef.current) {
            const allCards = Array.from(gridRef.current.children)
            gsap.set(allCards, { opacity: 1, y: 0, clearProps: 'transform,x,y' })
            allCards.forEach((card) => {
              card.style.removeProperty('transform')
              card.dataset.revealed = 'true'
              const id = card.dataset.productId
              if (id) revealedIdsRef.current.add(id)
            })
          }
          ScrollTrigger.refresh()
        }
      })
      flipState.current = null
    }
  }, [visibleProducts, reducedMotion])

  useEffect(() => {
    if (!sortOpen) return undefined
    const close = (event) => { if (!event.target.closest('.catalogue-sort')) setSortOpen(false) }
    const escape = (event) => { if (event.key === 'Escape') setSortOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape) }
  }, [sortOpen])

  useGSAP(() => {
    registerMotionPlugins()
    if (sortOpen && sortMenuRef.current && !reducedMotion) gsap.fromTo(sortMenuRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)', duration: 0.35, ease: 'expo.out' })
  }, { scope: pageRef, dependencies: [sortOpen, reducedMotion] })

  // Intro reveal runs once on mount
  useGSAP(() => {
    registerMotionPlugins()
    const root = pageRef.current
    if (!root) return undefined
    const intro = root.querySelectorAll('.catalogue-count, .catalogue-toolbar')
    if (reducedMotion) {
      gsap.set(intro, { opacity: 1, y: 0 })
      return undefined
    }
    gsap.fromTo(intro, { opacity: 0, y: 16 }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: intro[0], start: 'top 90%', once: true }
    })
  }, { scope: pageRef, dependencies: [reducedMotion] })

  // Batch reveal only for cards that have never been revealed
  useEffect(() => {
    if (!gridRef.current) return undefined
    registerMotionPlugins()
    const cards = Array.from(gridRef.current.children)

    if (reducedMotion) {
      cards.forEach((card) => {
        card.dataset.revealed = 'true'
        const id = card.dataset.productId
        if (id) revealedIdsRef.current.add(id)
      })
      gsap.set(cards, { opacity: 1, y: 0, clearProps: 'transform,x,y' })
      return undefined
    }

    // If flipState is pending, Flip handles entering cards with onEnter fade
    if (flipState.current) return undefined

    batchTriggersRef.current.forEach((st) => st.kill())
    batchTriggersRef.current = []

    cards.forEach((card) => {
      const id = card.dataset.productId
      if (id && revealedIdsRef.current.has(id)) {
        card.dataset.revealed = 'true'
        card.style.removeProperty('transform')
        gsap.set(card, { opacity: 1, y: 0, clearProps: 'transform,x,y' })
      }
    })

    const unrevealedCards = cards.filter(
      (card) => !card.dataset.revealed && !revealedIdsRef.current.has(card.dataset.productId)
    )

    if (unrevealedCards.length > 0) {
      gsap.set(unrevealedCards, { opacity: 0, y: 32 })
      const batches = ScrollTrigger.batch(unrevealedCards, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((el) => {
            el.dataset.revealed = 'true'
            const id = el.dataset.productId
            if (id) revealedIdsRef.current.add(id)
          })
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.08,
            overwrite: true,
            onComplete: () => {
              batch.forEach((el) => {
                el.style.removeProperty('transform')
                gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform,x,y' })
              })
            }
          })
        }
      })
      batchTriggersRef.current = batches
    }

    return () => {
      batchTriggersRef.current.forEach((st) => st.kill())
      batchTriggersRef.current = []
    }
  }, [visibleProducts, reducedMotion])

  useEffect(() => {
    return () => {
      if (activeFlipRef.current) {
        activeFlipRef.current.kill()
        activeFlipRef.current = null
      }
      batchTriggersRef.current.forEach((st) => st.kill())
      batchTriggersRef.current = []
    }
  }, [])

  const changeFilter = (value) => {
    prepareForFlip()
    setSearchParams(value === 'all' ? {} : { category: value })
  }

  const changeSort = (value) => {
    prepareForFlip()
    setSort(value)
    setSortOpen(false)
  }

  const activeSort = sortOptions.find(([value]) => value === sort)?.[1]

  return (
    <section ref={pageRef} className="catalogue-page" aria-labelledby="catalogue-title">
      <div className="catalogue-intro">
        <div>
          <p className="label mb-xl text-muted">01 / The catalogue</p>
          <div className="line-reveal-mask"><h1 id="catalogue-title" data-line-reveal className="display-xl catalogue-title"><span className="line-reveal-word">Good clothes</span><br /><span className="line-reveal-word">for bad ideas.</span></h1></div>
        </div>
        <p className="body catalogue-copy">Heavyweight staples, cut with intent. Pick a layer and make the day yours.</p>
      </div>
      <div className="catalogue-toolbar">
        <div ref={filtersRef} className="catalogue-filters" role="navigation" aria-label="Filter products">
          {filters.map(([value, label]) => (
            <button type="button" key={value} className={`catalogue-filter label ${category === value ? 'is-active' : ''}`} onClick={() => changeFilter(value)}>{label}</button>
          ))}
          <span ref={filterIndicatorRef} className="catalogue-filter-indicator" aria-hidden="true" />
        </div>
        <div className="catalogue-sort">
          <button type="button" className="catalogue-sort-trigger label" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)}>Sort / {activeSort}</button>
          {sortOpen && <div ref={sortMenuRef} className="catalogue-sort-menu" role="menu">
            {sortOptions.map(([value, label]) => <button type="button" role="menuitem" key={value} className="body" onClick={() => changeSort(value)}>{label}</button>)}
          </div>}
        </div>
      </div>
      <div className="catalogue-count label">{visibleProducts.length} pieces</div>
      {visibleProducts.length > 0 ? (
        <div ref={gridRef} className="product-grid">
          {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} variant={index} />)}
        </div>
      ) : (
        <div className="catalogue-empty">
          <p className="section-title">Nothing in this edit.</p>
          <TextLink to="/shop">View all pieces</TextLink>
        </div>
      )}
      <div className="catalogue-footnote"><span className="body">Demo collection / all pieces shown are frontend placeholders.</span><Link to="/" className="body">Back to home</Link></div>
    </section>
  )
}
