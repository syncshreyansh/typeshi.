import { useEffect } from 'react'
import { TYPE_SPEED } from '../lib/motion'
import { useReducedMotion } from './useReducedMotion'

function getParts(element, text) {
  element.classList.add('typewriter-target')
  element.setAttribute('aria-label', text)
  element.replaceChildren()
  const reserve = document.createElement('span')
  reserve.textContent = text
  reserve.setAttribute('aria-hidden', 'true')
  reserve.className = 'typewriter-reserve'
  const output = document.createElement('span')
  output.setAttribute('aria-hidden', 'true')
  output.className = 'typewriter-output'
  element.append(reserve, output)
  return { output }
}

export function useTypewriter({ ref, text, active = true, stay = false, speed = TYPE_SPEED, onComplete } = {}) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref?.current
    if (!element || !active) return undefined
    const { output } = getParts(element, text || '')
    const cursor = document.createElement('span')
    cursor.textContent = '_'
    cursor.className = 'cursor'
    cursor.setAttribute('aria-hidden', 'true')
    cursor.classList.add('typewriter-cursor')
    output.after(cursor)
    let index = 0
    let timer = 0
    let removeTimer = 0

    const complete = () => {
      if (!stay) removeTimer = window.setTimeout(() => cursor.remove(), 1200)
      onComplete?.()
    }

    const finish = () => {
      output.textContent = text || ''
      complete()
    }

    if (reducedMotion) {
      finish()
      return undefined
    }

    const typeNext = () => {
      output.textContent = (text || '').slice(0, index + 1)
      index += 1
      if (index >= (text || '').length) finish()
      else timer = window.setTimeout(typeNext, speed * 1000)
    }
    if (!text) finish()
    else typeNext()

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(removeTimer)
    }
  }, [active, onComplete, ref, reducedMotion, speed, stay, text])
}
