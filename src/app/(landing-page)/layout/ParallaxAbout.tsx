"use client";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import ScrollReveal from "@/components/ScrollReveal";

export default function ParallaxAbout() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-100 rounded-3xl">
      <ParallaxHeroImages images={images} variant="edge-focus" className="opacity-50 lg:opacity-100" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
        <ScrollReveal
          baseOpacity={2}
          enableBlur
          baseRotation={7}
          blurStrength={15}
          textClassName="text-primary text-center"
        >
          Kaloriku mengatur semua kebutuhan nutrisi harianmu dengan mudah,
          membantu kamu mencapai tujuan kesehatan dengan lebih efektif.
        </ScrollReveal>
      </div>
    </div>
  );
}

const images = [
  "https://assets.aceternity.com/components/hero-section-with-mesh-gradient.webp",
  "https://assets.aceternity.com/components/3d-globe.webp",
  "https://assets.aceternity.com/components/keyboard-2.webp",
  "https://assets.aceternity.com/components/hero-1.webp",
  "https://assets.aceternity.com/components/hero-2.webp",
  "https://assets.aceternity.com/components/hero-3.webp",
];
