"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const slides = [
  { id: 1, src: "/dashboard.png", alt: "Dasbor Nutrisi & Ringkasan Kalori Harian" },
  { id: 2, src: "/profile.jpg", alt: "Profil Pengguna & Target Kebugaran Personal" },
  { id: 3, src: "/login-screen.jpg", alt: "Autentikasi Aman & Akses Cepat Capstone Kaloriku" },
  { id: 4, src: "/step-scan.jpeg", alt: "Langkah Mudah Pindai Kalori Makanan Secara Instan" },
];

export function Carousel() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Animasi pergeseran track dan transisi teks dengan GSAP
  useGSAP(
    () => {
      if (!trackRef.current) return;

      // Animasikan track slide horizontal
      gsap.to(trackRef.current, {
        xPercent: -index * 100,
        duration: 0.8,
        ease: "power2.inOut",
        onStart: () => {
          isAnimating.current = true;
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      // Animasikan perubahan teks alt secara elegan (fade & slide up)
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }
    },
    { dependencies: [index], scope: containerRef }
  );

  // Setup autoplay & cleanup
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      nextSlide();
    }, 4500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  const prevSlide = () => {
    if (isAnimating.current) return;
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (isAnimating.current) return;
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (idx: number) => {
    if (isAnimating.current || idx === index) return;
    setIndex(idx);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl"
    >
      {/* Slider Track Wrapper */}
      <div className="relative h-64 w-full sm:h-72 md:h-80 overflow-hidden">
        <div ref={trackRef} className="flex h-full w-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-full w-full flex-shrink-0"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Bottom Glassmorphism Panel */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer select-none"
          >
            ← Prev
          </button>

          {/* Slide Indicators / Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === index ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md transition-all duration-300 hover:bg-white/15 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer select-none"
          >
            Next →
          </button>
        </div>

        {/* Slide Title / Description with fade & slide animation */}
        <div className="h-6 flex items-center justify-center">
          <div ref={textRef}>
            <p className="text-xs sm:text-sm font-medium text-white/90 tracking-wide select-none text-center drop-shadow-md">
              {slides[index].alt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;