import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

export const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
export const GSAP_EASE_OUT_EXPO = 'expo.out'
export const MOTION_DURATIONS = { fast: 0.35, base: 0.7, slow: 1.2 }
export const CURVE_MAX_AMP = 72
export const TYPE_SPEED = 0.03
export const CURSOR_BLINK = 0.55
export const PIXEL_STEPS = [40, 24, 12, 6, 3, 1]

let registered = false

export function registerMotionPlugins() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, Flip, useGSAP)
    registered = true
  }
  return { gsap, ScrollTrigger, Flip }
}
