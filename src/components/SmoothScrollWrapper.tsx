'use client'

import { ReactLenis } from "lenis/react"
import { ReactNode } from "react"

export default function SmoothScrollWrapper({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // Tingkat kelancaran (0.1 ideal untuk antigravity)
        duration: 1, // Durasi scroll
        smoothWheel: true, // Pastikan nyala untuk scroll mouse biasa
      }}
    >
      {children}
    </ReactLenis>
  )
}