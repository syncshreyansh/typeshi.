import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CURVE_MAX_AMP, registerMotionPlugins } from '../lib/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const edges = new Set()
const state = { dynamic: 0, phase: 0 }
let controller = null

function pathFor(edge) {
  const amp = 7 + state.dynamic
  const phase = state.phase
  const center = edge.bump ? -Math.min(32 + amp * 0.2, 48) : 0
  const d = edge.bump
    ? `M0 0 C20 ${amp} 34 ${amp} 43 0 C47 ${center + phase} 53 ${center - phase} 57 0 C66 ${amp} 80 ${amp} 100 0 V120 H0 Z`
    : `M0 0 C22 ${amp + phase} 35 ${-amp + phase} 50 0 C65 ${amp - phase} 78 ${-amp - phase} 100 0 V120 H0 Z`
  edge.path?.setAttribute('d', d)
}

function renderVisible() { edges.forEach((edge) => { if (edge.visible) pathFor(edge) }) }

function startController() {
  if (controller || edges.size === 0 || typeof IntersectionObserver === 'undefined') return
  registerMotionPlugins()
  const dynamicTo = gsap.quickTo(state, 'dynamic', { duration: 0.8, ease: 'expo.out' })
  const phaseTo = gsap.quickTo(state, 'phase', { duration: 0.8, ease: 'expo.out' })
  let tickerActive = false
  const timer = { id: 0 }
  const ticker = () => renderVisible()
  const wake = () => {
    if (!tickerActive) { tickerActive = true; gsap.ticker.add(ticker) }
    window.clearTimeout(timer.id)
    timer.id = window.setTimeout(() => { tickerActive = false; gsap.ticker.remove(ticker); renderVisible() }, 950)
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    const edge = Array.from(edges).find((item) => item.element === entry.target)
    if (edge) { edge.visible = entry.isIntersecting; if (entry.isIntersecting) pathFor(edge) }
  }), { rootMargin: '120px 0px' })
  edges.forEach((edge) => observer.observe(edge.element))
  const trigger = ScrollTrigger.create({ trigger: document.documentElement, start: 0, end: 'max', onUpdate: (self) => { const velocity = self.getVelocity(); dynamicTo(Math.min(CURVE_MAX_AMP, Math.abs(velocity) * 0.035)); phaseTo(Math.max(-18, Math.min(18, state.phase + velocity * 0.00035))); wake() } })
  controller = { trigger, observer, ticker, timer }
  renderVisible()
}

function stopController() {
  if (!controller || edges.size > 0) return
  controller.trigger.kill()
  controller.observer.disconnect()
  gsap.ticker.remove(controller.ticker)
  window.clearTimeout(controller.timer.id)
  gsap.killTweensOf(state)
  state.dynamic = 0
  state.phase = 0
  controller = null
}

export function CurvedEdge({ from, to, position = 'bottom', bump = false }) {
  const edgeRef = useRef(null)
  const pathRef = useRef(null)
  const reducedMotion = useReducedMotion()
  useGSAP(() => {
    registerMotionPlugins()
    const element = edgeRef.current
    const path = pathRef.current
    if (!element || !path) return undefined
    const edge = { element, path, bump, from, to, visible: false }
    edges.add(edge)
    controller?.observer.observe(element)
    pathFor(edge)
    const media = gsap.matchMedia()
    media.add('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', startController)
    return () => { media.revert(); edges.delete(edge); stopController() }
  }, { scope: edgeRef, dependencies: [bump, from, reducedMotion, to] })
  return <svg ref={edgeRef} className={`curved-edge curved-edge-${position}`} viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true" pointerEvents="none" data-curved-edge><path ref={pathRef} fill={to} d="M0 0 C22 7 35 -7 50 0 C65 7 78 -7 100 0 V120 H0 Z" /></svg>
}
