import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '../components/ProductCard'
import { ProductImage } from '../components/ProductImage'
import { getProductBySlug, products } from '../data/products'
import { formatINR } from '../lib/format'
import { useCartStore } from '../store/cart'
import { SolidButton } from '../components/ui/Button'
import { setPageMeta } from '../lib/meta'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLineReveal } from '../hooks/useLineReveal'
import { usePreloader } from '../components/Preloader'

export function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = getProductBySlug(slug)
  const openDrawer = useCartStore((state) => state.openDrawer)
  const addItem = useCartStore((state) => state.addItem)
  const [colorName, setColorName] = useState(product?.colors[0]?.name)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const pageRef = useRef(null)
  const mainImageRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { preloaderDone } = usePreloader()
  useLineReveal({ scope: pageRef, preloaderDone, selector: '[data-line-reveal]' })

  useGSAP(() => {
    registerMotionPlugins()
    const root = pageRef.current
    if (!root) return undefined
    const details = root.querySelectorAll('.product-price-row, .product-description, .product-option, .product-buy-row, .product-accordions')
    const related = root.querySelectorAll('.related-grid .product-card')
    if (reducedMotion) {
      gsap.set([details, related], { opacity: 1, y: 0 })
      return undefined
    }
    gsap.fromTo(details, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.65, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: details[0], start: 'top 85%', once: true } })
    ScrollTrigger.batch(related, { start: 'top 88%', once: true, onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }) })
    return undefined
  }, { scope: pageRef, dependencies: [product?.id, reducedMotion] })

  useEffect(() => {
    if (!mainImageRef.current || reducedMotion) return undefined
    gsap.fromTo(mainImageRef.current, { opacity: 0.45, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', duration: 0.45, ease: 'expo.out' })
    return () => gsap.killTweensOf(mainImageRef.current)
  }, [galleryIndex, reducedMotion])

  useEffect(() => {
    if (!product) {
      navigate('/404', { replace: true })
      return
    }
    setPageMeta(`${product.name} / Typeshi`, `${product.shortDescription} Shop the ${product.name} from Typeshi.`)
    setColorName(product.colors[0]?.name)
    setSize(null)
    setQty(1)
    setError('')
    setGalleryIndex(0)
  }, [slug, product, navigate])

  const related = useMemo(() => product ? products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3) : [], [product])

  if (!product) return null

  const color = product.colors.find((item) => item.name === colorName) || product.colors[0]
  const selectedImage = { color: color.hex }

  const addToCart = () => {
    if (!size) {
      setError('Choose a size before adding this piece.')
      return
    }
    addItem({ productId: product.id, size, colorName: color.name, qty })
    if (reducedMotion || window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      openDrawer()
      return
    }
    const source = mainImageRef.current
    const target = document.querySelector('[data-cart-trigger]')
    if (!source || !target) {
      openDrawer()
      return
    }
    const clone = source.cloneNode(true)
    const from = source.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    clone.className = 'fly-product'
    Object.assign(clone.style, { position: 'fixed', left: `${from.left}px`, top: `${from.top}px`, width: '56px', height: '70px', zIndex: '100', pointerEvents: 'none', overflow: 'hidden', borderRadius: '10px' })
    document.body.appendChild(clone)
    gsap.to(clone, { x: to.left - from.left, y: to.top - from.top, scale: 0.3, duration: 0.7, ease: 'power4.out', onComplete: () => { clone.remove(); openDrawer() } })
  }

  return (
    <section ref={pageRef} className="product-page" aria-labelledby="product-title">
      <div className="product-breadcrumb"><Link to="/shop" className="body">Shop</Link><span className="body">/</span><span className="body">{product.category}</span></div>
      <div className="product-spread">
        <div className="product-gallery">
          <div ref={mainImageRef} className="product-main-image-frame"><ProductImage product={product} image={selectedImage} className="product-main-image" /></div>
          <div className="product-thumbnails">
            {product.images.slice(0, 2).map((image, index) => <button type="button" key={index} className={`product-thumbnail ${galleryIndex === index ? 'is-selected' : ''}`} onClick={() => { setGalleryIndex(index); setColorName(product.colors[index % product.colors.length].name) }} aria-label={`View product angle ${index + 1}`}><ProductImage product={product} image={image} /></button>)}
          </div>
        </div>
        <div className="product-details">
          <p className="label mb-xl text-muted">{product.tag || product.drop}</p>
          <div className="line-reveal-mask"><h1 id="product-title" data-line-reveal className="display-xl product-title"><span className="line-reveal-word">{product.name}</span></h1></div>
          <div className="product-price-row"><span className="label">{formatINR(product.price)}</span>{product.compareAtPrice && <del className="body">{formatINR(product.compareAtPrice)}</del>}</div>
          <p className="body product-description">{product.description}</p>
          <div className="product-option"><span className="label">Color / {color.name}</span><div className="product-color-options">{product.colors.map((option) => <button type="button" key={option.name} className={`color-swatch ${option.name === color.name ? 'is-selected' : ''}`} style={{ backgroundColor: option.hex }} onClick={() => setColorName(option.name)} aria-label={`Choose ${option.name}`} />)}</div></div>
          <div className="product-option"><span className="label">Size</span><div className="size-options">{product.sizes.map((option) => <button type="button" key={option} className={`size-option label ${size === option ? 'is-selected' : ''}`} onClick={() => { setSize(option); setError('') }}>{option}</button>)}</div></div>
          <div className="product-buy-row"><div className="quantity-control" aria-label="Quantity"><button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">&minus;</button><span aria-live="polite">{qty}</span><button type="button" onClick={() => setQty((value) => value + 1)} aria-label="Increase quantity">+</button></div><SolidButton type="button" onClick={addToCart} disabled={!size} className="product-add-button">{size ? 'Add to cart' : 'Choose a size'}</SolidButton></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="product-accordions">
            <details open><summary className="label">Details <span>+</span></summary><p className="body">{product.shortDescription} Built for repeat wear and long walks.</p></details>
            <details><summary className="label">Fabric &amp; fit <span>+</span></summary><ul className="body">{product.fabricFit.map((detail) => <li key={detail}>{detail}</li>)}</ul></details>
            <details><summary className="label">Shipping &amp; returns <span>+</span></summary><p className="body">Demo shipping is calculated at checkout. Returns are a frontend-only placeholder for this build.</p></details>
          </div>
        </div>
      </div>
      <div className="related-products"><div className="related-heading"><p className="label text-muted">02 / Keep looking</p><h2 className="section-title">You may also like.</h2></div><div className="related-grid">{related.map((item, index) => <ProductCard key={item.id} product={item} index={index} variant={index + 1} compact />)}</div></div>
    </section>
  )
}
