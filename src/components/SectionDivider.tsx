'use client'

import React from 'react'

interface SectionDividerProps {
  /** Divider style */
  variant?: 'wave' | 'gradient' | 'dots'
  /** Flip upside down */
  flip?: boolean
  /** CSS class overrides */
  className?: string
  /** Primary color for the divider accent */
  color?: string
}

export default function SectionDivider({
  variant = 'gradient',
  flip = false,
  className = '',
  color,
}: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div
        className={`relative w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full md:h-[60px] lg:h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            className="fill-current text-[#fff8f0] dark:text-[#1a1410]"
            style={color ? { color } : undefined}
          />
        </svg>
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center gap-2 py-8 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/20 dark:bg-primary/10"
            style={{
              opacity: 1 - Math.abs(i - 2) * 0.25,
              transform: `scale(${1 - Math.abs(i - 2) * 0.15})`,
            }}
          />
        ))}
      </div>
    )
  }

  // Default: gradient line divider
  return (
    <div className={`py-4 ${className}`}>
      <div className="mx-auto h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  )
}
