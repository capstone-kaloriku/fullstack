'use client'

import React, { ReactNode } from 'react'
import ParallaxLayer from './ParallaxLayer'

interface ParallaxSectionProps {
  children: ReactNode
  /** Section id for navigation */
  id?: string
  /** Additional CSS class names for the section */
  className?: string
  /** Background variant */
  variant?: 'default' | 'warm' | 'warm-dark' | 'subtle' | 'deep'
  /** Show floating decorative orbs */
  showOrbs?: boolean
  /** Show geometric parallax shapes */
  showShapes?: boolean
  /** Show grain texture overlay */
  showGrain?: boolean
}

/** Floating gradient orb with parallax */
function FloatingOrb({
  size,
  color,
  position,
  speed,
  blur = 80,
}: {
  size: number
  color: string
  position: { top?: string; bottom?: string; left?: string; right?: string }
  speed: number
  blur?: number
}) {
  return (
    <ParallaxLayer speed={speed} className="pointer-events-none absolute z-0">
      <div
        className="rounded-full opacity-40 dark:opacity-20"
        style={{
          width: size,
          height: size,
          background: color,
          filter: `blur(${blur}px)`,
          ...position,
        }}
      />
    </ParallaxLayer>
  )
}

/** Geometric decorative shape with parallax */
function GeoShape({
  type,
  size,
  color,
  position,
  speed,
  rotation = 0,
}: {
  type: 'circle' | 'ring' | 'diamond' | 'cross'
  size: number
  color: string
  position: { top?: string; bottom?: string; left?: string; right?: string }
  speed: number
  rotation?: number
}) {
  const shapeStyles: Record<string, React.CSSProperties> = {
    circle: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
    },
    ring: {
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid ${color}`,
      background: 'transparent',
    },
    diamond: {
      width: size,
      height: size,
      background: color,
      transform: `rotate(${45 + rotation}deg)`,
      borderRadius: '4px',
    },
    cross: {
      width: size,
      height: size,
      background: `linear-gradient(${color} 0 0) center/2px 100% no-repeat, linear-gradient(${color} 0 0) center/100% 2px no-repeat`,
      transform: `rotate(${rotation}deg)`,
    },
  }

  return (
    <ParallaxLayer speed={speed} className="pointer-events-none absolute z-0">
      <div
        className="opacity-20 dark:opacity-10"
        style={{
          ...shapeStyles[type],
          position: 'absolute',
          ...position,
        }}
      />
    </ParallaxLayer>
  )
}

/** SVG grain noise texture overlay */
function GrainOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03] dark:opacity-[0.06]">
      <svg width="100%" height="100%">
        <filter id="grain-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  )
}

/** Background gradient variants */
const backgroundVariants = {
  default: '',
  warm: 'bg-gradient-to-b from-[#fff8f0] via-[#fff2e5] to-[#fff8f0] dark:from-[#1a1410] dark:via-[#1f1712] dark:to-[#1a1410]',
  'warm-dark': 'bg-gradient-to-br from-[#1a0f05] via-[#0f1113] to-[#0f1113] dark:from-[#1a0f05] dark:via-[#0f1113] dark:to-[#0f1113]',
  subtle: 'bg-gradient-to-b from-[#fafaf8] via-[#f5f0eb] to-[#fafaf8] dark:from-[#131210] dark:via-[#17150f] dark:to-[#131210]',
  deep: 'bg-gradient-to-b from-[#fff5eb] via-[#ffe8d4] to-[#fff5eb] dark:from-[#1c1308] dark:via-[#211608] dark:to-[#1c1308]',
}

export default function ParallaxSection({
  children,
  id,
  className = '',
  variant = 'default',
  showOrbs = false,
  showShapes = false,
  showGrain = false,
}: ParallaxSectionProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${backgroundVariants[variant]} ${className}`}
    >
      {/* Grain texture overlay */}
      {showGrain && <GrainOverlay />}

      {/* Decorative floating orbs */}
      {showOrbs && (
        <>
          <FloatingOrb
            size={300}
            color="radial-gradient(circle, rgba(255,107,0,0.3) 0%, transparent 70%)"
            position={{ top: '10%', right: '-5%' }}
            speed={0.3}
            blur={100}
          />
          <FloatingOrb
            size={200}
            color="radial-gradient(circle, rgba(255,157,92,0.25) 0%, transparent 70%)"
            position={{ bottom: '20%', left: '-3%' }}
            speed={0.6}
            blur={80}
          />
          <FloatingOrb
            size={150}
            color="radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)"
            position={{ top: '50%', left: '60%' }}
            speed={0.2}
            blur={60}
          />
        </>
      )}

      {/* Decorative geometric shapes */}
      {showShapes && (
        <>
          <GeoShape
            type="ring"
            size={80}
            color="rgba(255,107,0,0.25)"
            position={{ top: '15%', left: '8%' }}
            speed={0.3}
          />
          <GeoShape
            type="diamond"
            size={24}
            color="rgba(255,107,0,0.2)"
            position={{ top: '30%', right: '12%' }}
            speed={0.7}
            rotation={15}
          />
          <GeoShape
            type="circle"
            size={12}
            color="rgba(255,157,92,0.35)"
            position={{ bottom: '25%', left: '15%' }}
            speed={0.4}
          />
          <GeoShape
            type="cross"
            size={32}
            color="rgba(255,107,0,0.15)"
            position={{ bottom: '35%', right: '20%' }}
            speed={0.5}
            rotation={20}
          />
          <GeoShape
            type="ring"
            size={40}
            color="rgba(255,157,92,0.2)"
            position={{ top: '60%', left: '70%' }}
            speed={0.25}
          />
        </>
      )}

      {/* Section content (above decorations) */}
      <div className="relative z-[2]">
        {children}
      </div>
    </section>
  )
}
