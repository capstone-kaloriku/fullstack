import { FadeUpPyramid } from '@/components/animations/FadeUpPyramid'
import React from 'react'

function HeroSection() {
  return (
    <>
      <FadeUpPyramid position="center" delay={0.05}>
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-3xl lg:text-6xl dark:text-neutral-100">
          Kendalikan Kalori harianmu, dengan{" "}
          <span className="text-primary">KaloriKu.</span>
        </h2>
      </FadeUpPyramid>
      <FadeUpPyramid position="center" delay={0.05}>
        <p className="relative z-10 mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Pendamping setia untuk perjalanan hidup sehatmu. Tracking nutrisi
          presisi untuk bantu kamu mencapai target berat badan lebih efektif.
        </p>
      </FadeUpPyramid>
    </>
  )
}

export default HeroSection