'use client'

import React, { useRef, useEffect, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxLayerProps {
  children: ReactNode
  /** Speed multiplier: 0 = fixed, 1 = normal scroll, >1 = faster, <0 = opposite direction */
  speed?: number
  /** Additional CSS class names */
  className?: string
  /** Horizontal parallax offset */
  horizontal?: number
  /** Scale change during scroll (1 = no change) */
  scaleFrom?: number
  scaleTo?: number
  /** Opacity animation */
  opacityFrom?: number
  opacityTo?: number
  /** ScrollTrigger start position */
  start?: string
  /** ScrollTrigger end position */
  end?: string
}

export default function ParallaxLayer({
  children,
  speed = 0.5,
  className = '',
  horizontal = 0,
  scaleFrom,
  scaleTo,
  opacityFrom,
  opacityTo,
  start = 'top bottom',
  end = 'bottom top',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const yDistance = (1 - speed) * 200

    const fromVars: gsap.TweenVars = {
      y: -yDistance,
      ...(horizontal !== 0 && { x: -horizontal }),
      ...(scaleFrom !== undefined && { scale: scaleFrom }),
      ...(opacityFrom !== undefined && { opacity: opacityFrom }),
    }

    const toVars: gsap.TweenVars = {
      y: yDistance,
      ease: 'none',
      ...(horizontal !== 0 && { x: horizontal }),
      ...(scaleTo !== undefined && { scale: scaleTo }),
      ...(opacityTo !== undefined && { opacity: opacityTo }),
      scrollTrigger: {
        trigger: el.parentElement || el,
        start,
        end,
        scrub: true,
      },
    }

    const tween = gsap.fromTo(el, fromVars, toVars)

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [speed, horizontal, scaleFrom, scaleTo, opacityFrom, opacityTo, start, end])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
