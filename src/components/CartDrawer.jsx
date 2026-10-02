import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ProductImage } from './ProductImage'
import { SolidButton, TextLink } from './ui/Button'
import { formatINR } from '../lib/format'
import { productById, selectCartCount, selectCartSubtotal, useCartStore } from '../store/cart'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

function QuantityControl({ item }) {
  const updateQty = useCartStore((state) => state.updateQty)
  return (
    <div className="quantity-control" aria-label={`Quantity for ${item.productId}`}>
      <button type="button" onClick={() => updateQty(item.productId, item.size, item.colorName, item.qty - 1)} aria-label="Decrease quantity">&minus;</button>
      <span aria-live="polite">{item.qty}</span>
      <button type="button" onClick={() => updateQty(item.productId, item.size, item.colorName, item.qty + 1)} aria-label="Increase quantity">+</button>
    </div>
  )
}

export function CartDrawer({ open, onClose, returnFocusRef }) {
  const closeRef = useRef(null)
  const drawerRef = useRef(null)
  const [removing, setRemoving] = useState(null)
  const reducedMotion = useReducedMotion()
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const count = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)

  useGSAP(() => {
    registerMotionPlugins()
    if (!open || reducedMotion || !drawerRef.current) return undefined
    const rows = drawerRef.current.querySelectorAll('.cart-item')
    gsap.fromTo(rows, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out', stagger: 0.06, delay: 0.25 })
    return undefined
  }, { scope: drawerRef, dependencies: [open, items.length, reducedMotion] })

  useEffect(() => {
    if (!open) return undefined
    closeRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const close = () => {
    onClose()
    window.setTimeout(() => returnFocusRef?.current?.focus(), 0)
  }

  const remove = (item) => {
    const key = `${item.productId}-${item.size}-${item.colorName}`
    if (reducedMotion) { removeItem(item.productId, item.size, item.colorName); return }
    setRemoving(key)
    window.setTimeout(() => { removeItem(item.productId, item.size, item.colorName); setRemoving(null) }, 400)
  }

  return (
    <>
      {open && <button type="button" className="cart-backdrop" aria-label="Close cart" onClick={close} />}
      <aside ref={drawerRef} className={`cart-drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h2 className="label">Cart ({count})</h2>
          <button ref={closeRef} type="button" onClick={close} className="label min-h-[44px]">Close</button>
        </div>
        {items.length === 0 ? (
          <div className="cart-empty">
            <p className="section-title">Nothing in here yet.</p>
            <TextLink to="/shop" onClick={close}>Shop the pieces</TextLink>
          </div>
        ) : (
          <>
            <div className="cart-items" data-lenis-prevent>
              {items.map((item) => {
                const product = productById(item.productId)
                if (!product) return null
                const color = product.colors.find((entry) => entry.name === item.colorName) || product.colors[0]
                return (
                  <article className={`cart-item ${removing === `${item.productId}-${item.size}-${item.colorName}` ? 'is-removing' : ''}`} key={`${item.productId}-${item.size}-${item.colorName}`}>
                    <ProductImage product={product} image={{ color: color.hex }} className="cart-item-image" />
                    <div className="cart-item-copy">
                      <Link to={`/shop/${product.slug}`} onClick={close} className="label">{product.name}</Link>
                      <p className="body">{item.size} / {item.colorName}</p>
                      <QuantityControl item={item} />
                    </div>
                    <div className="cart-item-total">
                      <span className="label">{formatINR(product.price * item.qty)}</span>
                      <button type="button" onClick={() => remove(item)} className="body cart-remove">Remove</button>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="cart-summary">
              <div className="cart-summary-line"><span className="label">Subtotal</span><span className="label">{formatINR(subtotal)}</span></div>
              <p className="body">Shipping calculated at checkout.</p>
              <SolidButton to="/checkout" onClick={close} className="cart-checkout-button w-full">Checkout</SolidButton>
              <TextLink to="/shop" onClick={close} className="mt-md">Continue shopping</TextLink>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
