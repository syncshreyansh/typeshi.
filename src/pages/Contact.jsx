import { useEffect, useRef, useState } from 'react'
import { Arrow } from '../components/Arrow'
import { site } from '../data/site'
import { TextLink } from '../components/ui/Button'
import { setPageMeta } from '../lib/meta'
import { useLineReveal } from '../hooks/useLineReveal'
import { usePreloader } from '../components/Preloader'

const initialForm = { name: '', email: '', order: '', message: '' }
const hints = { name: 'Tell us who is writing.', email: 'A reply address, not a throwaway.', message: 'Give us the useful version.' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email.'
  if (!form.message.trim()) errors.message = 'Tell us what is on your mind.'
  return errors
}

export function Contact() {
  const pageRef = useRef(null)
  const { preloaderDone } = usePreloader()
  useLineReveal({ scope: pageRef, preloaderDone, selector: '[data-line-reveal]' })
  useEffect(() => { setPageMeta('Contact / Typeshi', 'Talk to the Typeshi studio about pieces, sizing, and collaborations.') }, [])
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [focused, setFocused] = useState('')
  const [sent, setSent] = useState(false)
  const refs = useRef({})
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setTouched({ name: true, email: true, order: true, message: true })
    const first = ['name', 'email', 'message'].find((field) => nextErrors[field])
    if (first) {
      window.requestAnimationFrame(() => refs.current[first]?.focus())
      return
    }
    // Demo only: this contact form does not send data to a backend.
    setSent(true)
  }

  const field = (name, label, type = 'text', required = true) => {
    const hasValue = Boolean(form[name].trim())
    const showHint = !errors[name] && (focused === name || (!touched[name] && !hasValue))
    const messageId = errors[name] ? `${name}-error` : `${name}-hint`
    return <label className={`editorial-field contact-field contact-field-${name} ${errors[name] ? 'is-error' : ''} ${hasValue && !errors[name] ? 'is-valid' : ''}`} key={name}><span className="label">{label}{!required && <span className="body"> / optional</span>}</span><input ref={(element) => { refs.current[name] = element }} name={name} type={type} value={form[name]} onChange={update} onFocus={() => setFocused(name)} onBlur={() => { setFocused(''); setTouched((current) => ({ ...current, [name]: true })) }} aria-invalid={Boolean(errors[name])} aria-describedby={(errors[name] || showHint) ? messageId : undefined} />{errors[name] && <span id={messageId} className="field-message field-message-error">{errors[name]}</span>}{showHint && <span id={messageId} className="field-message field-message-hint">{hints[name] || 'Optional context for the studio.'}</span>}</label>
  }

  return (
    <section ref={pageRef} className="contact-page" aria-labelledby="contact-title">
      <div className="contact-intro"><p className="label text-muted">Contact / The studio</p><div className="line-reveal-mask"><h1 id="contact-title" data-line-reveal className="display-xl"><span className="line-reveal-word">Get in touch.</span></h1></div><div className="contact-details"><a className="label contact-detail-link" href={`mailto:${site.email}`}>{site.email}<Arrow /></a><a className="label contact-detail-link" href={`https://instagram.com/${site.instagram.replace('@', '')}`}>{site.instagram}<Arrow /></a><div className="contact-phone-list">{site.phones.map((phone) => <a key={phone} className="body contact-detail-link" href={`tel:${phone}`}>{phone}</a>)}</div><p className="body">{site.address.map((line) => <span key={line} className="block">{line}</span>)}</p><p className="body">Usually back within two working days.</p></div></div>
      <div className="contact-body">
        <div className="contact-form-wrap">{sent ? <div className="contact-success"><p className="label text-muted">Message / received</p><h2 className="section-title">That landed.</h2><p className="body">Thanks for writing. We will get back to you soon.</p><TextLink to="/shop">While you wait, see the pieces</TextLink></div> : <form className="contact-form" onSubmit={submit} noValidate><h2 className="section-title">Say the thing.</h2><div className="contact-form-grid">{field('name', 'Name')}{field('email', 'Email', 'email')}{field('order', 'Order number', 'text', false)}{field('message', 'Message')}</div><button type="submit" className="label contact-submit">Send it <Arrow /></button></form>}</div>
        <div className="contact-faq"><p className="label text-muted">FAQ / Before you write</p>{[['Shipping', 'Demo shipping is calculated at checkout. In a real store, your confirmation would carry the final delivery window.'], ['Returns', 'Demo returns are handled by the studio team after a conversation.'], ['Sizing', 'Use the fit notes on each product page, then choose the size that gives you room to move.'], ['Custom orders', 'Small collaborations are welcome when the idea is stronger than the logo.']].map(([question, answer]) => <details key={question}><summary className="label">{question}<span>+</span></summary><p className="body">{answer}</p></details>)}</div>
      </div>
    </section>
  )
}
