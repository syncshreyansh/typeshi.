import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ProductImage } from '../components/ProductImage'
import { SolidButton, TextLink } from '../components/ui/Button'
import { formatINR } from '../lib/format'
import { productById, selectCartSubtotal, useCartStore } from '../store/cart'
import { setPageMeta } from '../lib/meta'
import { registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const initialForm = { name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', payment: 'cod' }
const shippingThreshold = 3000
const shippingFee = 99
const fieldOrder = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
const fieldHints = {
  name: 'Use the name on the delivery door.',
  email: 'We will send the demo order note here.',
  phone: 'Ten digits, including your area number.',
  address: 'Street, building, or landmark.',
  city: 'Where should this piece land?',
  state: 'Your state or region.',
  pincode: 'Six digits for the delivery route.',
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.'
  if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Use a 10-digit phone number.'
  if (!form.address.trim()) errors.address = 'Enter your address.'
  if (!form.city.trim()) errors.city = 'Enter your city.'
  if (!form.state.trim()) errors.state = 'Enter your state.'
  if (!/^\d{6}$/.test(form.pincode)) errors.pincode = 'Use a 6-digit pincode.'
  return errors
}

export function Checkout() {
  const pageRef = useRef(null)
  const items = useCartStore((state) => state.items)
  const clear = useCartStore((state) => state.clear)
  const subtotal = useCartStore(selectCartSubtotal)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [focusedField, setFocusedField] = useState('')
  const [orderId, setOrderId] = useState('')
  const fieldRefs = useRef({})
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    registerMotionPlugins()
    if (orderId) {
      const check = pageRef.current?.querySelector('.confirmation-check')
      if (check && !reducedMotion) {
        const length = check.querySelector('path')?.getTotalLength() || 120
        gsap.fromTo(check.querySelector('path'), { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.8, ease: 'power4.out' })
      }
      return undefined
    }
    const fields = pageRef.current?.querySelectorAll('.editorial-field')
    if (!fields || reducedMotion) return undefined
    gsap.fromTo(fields, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: fields[0], start: 'top 88%', once: true } })
    return undefined
  }, { scope: pageRef, dependencies: [reducedMotion, orderId] })

  useEffect(() => { setPageMeta(orderId ? 'Order confirmed / Typeshi' : 'Checkout / Typeshi', orderId ? 'Your Typeshi demo order is confirmed.' : 'Review your Typeshi demo order and delivery details.') }, [orderId])

  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : shippingFee
  const total = subtotal + shipping
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setTouched(fieldOrder.reduce((result, field) => ({ ...result, [field]: true }), {}))
    const firstInvalid = fieldOrder.find((field) => nextErrors[field])
    if (firstInvalid) {
      window.requestAnimationFrame(() => fieldRefs.current[firstInvalid]?.focus())
      return
    }
    // Demo only: no payment gateway or backend exists in this frontend build.
    clear()
    setOrderId(`TS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
  }

  if (items.length === 0 && !orderId) {
    return <section ref={pageRef} className="checkout-page checkout-empty"><p className="label mb-xl text-muted">Order / checkout</p><h1 className="display-xl">Your bag is empty.</h1><TextLink to="/shop" className="mt-xl">Find a piece</TextLink></section>
  }

  if (orderId) {
    return <section ref={pageRef} className="checkout-page order-confirmation"><p className="label mb-xl text-muted">Order / confirmed</p><svg className="confirmation-check" viewBox="0 0 80 60" aria-label="Order confirmed" role="img"><path d="M6 32 28 52 74 7" /></svg><h1 className="display-xl">Good choice.</h1><p className="body confirmation-copy">Your demo order <strong>{orderId}</strong> is in the books. Expect a delivery update in 3 to 5 working days.</p><Link to="/shop" className="label confirmation-link">Continue shopping</Link></section>
  }

  return (
    <section ref={pageRef} className="checkout-page" aria-labelledby="checkout-title">
      <div className="checkout-heading"><p className="label mb-xl text-muted">Order / checkout</p><h1 id="checkout-title" className="display-xl">Make it yours.</h1></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit} noValidate>
          <div className="form-section"><h2 className="section-title">Delivery details</h2><div className="form-grid">
            {[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['address', 'Address', 'text'], ['city', 'City', 'text'], ['state', 'State', 'text'], ['pincode', 'Pincode', 'text']].map(([name, label, type]) => {
              const hasValue = Boolean(form[name].trim())
              const showHint = !errors[name] && (focusedField === name || (!touched[name] && !hasValue))
              const messageId = errors[name] ? `${name}-error` : `${name}-hint`
              return <label className={`editorial-field field-${name} ${errors[name] ? 'is-error' : ''} ${hasValue && !errors[name] ? 'is-valid' : ''}`} key={name}><span className="label">{label}</span><input ref={(element) => { fieldRefs.current[name] = element }} name={name} type={type} value={form[name]} onChange={update} onFocus={() => setFocusedField(name)} onBlur={() => { setFocusedField(''); setTouched((current) => ({ ...current, [name]: true })) }} aria-invalid={Boolean(errors[name])} aria-describedby={(errors[name] || showHint) ? messageId : undefined} />{errors[name] && <span id={messageId} className="field-message field-message-error">{errors[name]}</span>}{showHint && <span id={messageId} className="field-message field-message-hint">{fieldHints[name]}</span>}</label>
            })}
          </div></div>
          <div className="form-section"><h2 className="section-title">Payment</h2><div className="payment-options">{[['cod', 'Cash on Delivery'], ['upi', 'UPI'], ['card', 'Card']].map(([value, label]) => <label className="payment-option label" key={value}><input type="radio" name="payment" value={value} checked={form.payment === value} onChange={update} /><span>{label}</span></label>)}</div></div>
          <SolidButton type="submit" className="checkout-submit">Place demo order</SolidButton>
        </form>
        <aside className="checkout-summary"><p className="label text-muted">Your pieces</p><div className="checkout-items">{items.map((item) => { const product = productById(item.productId); const color = product.colors.find((entry) => entry.name === item.colorName) || product.colors[0]; return <div className="checkout-item" key={`${item.productId}-${item.size}-${item.colorName}`}><ProductImage product={product} image={{ color: color.hex }} className="checkout-item-image" /><div><p className="label">{product.name}</p><p className="body">{item.qty} / {item.size} / {item.colorName}</p></div><span className="label">{formatINR(product.price * item.qty)}</span></div> })}</div><div className="checkout-total"><div><span className="body">Subtotal</span><span className="label">{formatINR(subtotal)}</span></div><div><span className="body">Shipping</span><span className="label">{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div><div className="checkout-grand-total"><span className="label">Total</span><span className="label">{formatINR(total)}</span></div></div></aside>
      </div>
    </section>
  )
}
