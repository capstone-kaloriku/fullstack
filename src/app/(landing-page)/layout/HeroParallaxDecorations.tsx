'use client'

import React from 'react'
import ParallaxLayer from '@/components/ParallaxLayer'

/**
 * Floating decorative parallax elements scattered across the hero
 * Each layer moves at a different speed for dramatic depth
 */
export default function HeroParallaxDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Large warm gradient orb — top right, very slow */}
      <ParallaxLayer speed={0.2} className="absolute -top-20 -right-32 z-0">
        <div
          className="h-[500px] w-[500px] rounded-full opacity-25 dark:opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(255,107,0,0.4) 0%, rgba(255,157,92,0.15) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </ParallaxLayer>

      {/* Medium accent orb — left side, medium speed */}
      <ParallaxLayer speed={0.45} className="absolute top-[40%] -left-20 z-0">
        <div
          className="h-[320px] w-[320px] rounded-full opacity-20 dark:opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(255,157,92,0.35) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </ParallaxLayer>

      {/* Small accent dot cluster — scattered, fast */}
      <ParallaxLayer speed={0.7} className="absolute top-[25%] left-[20%] z-0">
        <div
          className="h-3 w-3 rounded-full bg-primary/30 dark:bg-primary/15"
          style={{ filter: 'blur(1px)' }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.8} className="absolute top-[35%] right-[25%] z-0">
        <div
          className="h-2 w-2 rounded-full bg-accent/40 dark:bg-accent/20"
          style={{ filter: 'blur(1px)' }}
        />
      </ParallaxLayer>

      {/* Geometric ring — slow drift */}
      <ParallaxLayer speed={0.25} className="absolute top-[55%] right-[10%] z-0">
        <div
          className="h-24 w-24 rounded-full border-[1.5px] border-primary/15 dark:border-primary/10"
        />
      </ParallaxLayer>

      {/* Small diamond */}
      <ParallaxLayer speed={0.6} className="absolute top-[70%] left-[12%] z-0">
        <div
          className="h-5 w-5 rotate-45 rounded-[2px] bg-primary/10 dark:bg-primary/5"
        />
      </ParallaxLayer>

      {/* Large ring — bottom center */}
      <ParallaxLayer speed={0.15} className="absolute bottom-[10%] left-[45%] z-0">
        <div
          className="h-40 w-40 rounded-full border border-accent/10 dark:border-accent/5"
        />
      </ParallaxLayer>

      {/* Subtle cross */}
      <ParallaxLayer speed={0.55} className="absolute top-[45%] left-[75%] z-0">
        <div className="relative h-8 w-8 opacity-15 dark:opacity-8">
          <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-primary" />
          <div className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-primary" />
        </div>
      </ParallaxLayer>

      {/* Scattered dots at varied depths */}
      <ParallaxLayer speed={0.9} className="absolute top-[60%] right-[35%] z-0">
        <div className="h-1.5 w-1.5 rounded-full bg-primary/25" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.35} className="absolute top-[15%] left-[55%] z-0">
        <div className="h-2 w-2 rounded-full bg-accent/20" />
      </ParallaxLayer>
    </div>
  )
}
