import { useEffect } from 'react'
import { useReducedMotion } from './useReducedMotion'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

function getParts(element, text) {
  element.classList.add('scramble-target')
  element.setAttribute('aria-label', text)
  element.replaceChildren()
  const reserve = document.createElement('span')
  reserve.textContent = text
  reserve.setAttribute('aria-hidden', 'true')
  reserve.className = 'scramble-reserve'
  const output = document.createElement('span')
  output.setAttribute('aria-hidden', 'true')
  output.className = 'scramble-output'
  element.append(reserve, output)
  return { output }
}

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

export function useScramble({ ref, text, active = true, duration = 0.8, onComplete } = {}) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref?.current
    if (!element || !active) return undefined
    const { output } = getParts(element, text || '')
    let frame = 0
    const started = performance.now()
    const finalText = text || ''

    const render = (now) => {
      const progress = reducedMotion ? 1 : Math.min(1, (now - started) / (duration * 1000))
      const resolved = Math.floor(progress * finalText.length)
      output.textContent = finalText.split('').map((character, index) => {
        if (index < resolved || character === ' ') return character
        return randomChar()
      }).join('')
      if (progress < 1) frame = window.requestAnimationFrame(render)
      else {
        output.textContent = finalText
        onComplete?.()
      }
    }
    frame = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(frame)
  }, [active, duration, onComplete, ref, reducedMotion, text])
}
