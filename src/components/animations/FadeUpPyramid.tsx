"use client";

import { useRef, ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FadeUpPyramidProps {
  children: ReactNode;
  position?: "left" | "center" | "right";
  delay?: number;
  className?: string;
}

export function FadeUpPyramid({
  children,
  position = "center",
  delay = 0,
  className,
}: FadeUpPyramidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getInitialCoords = () => {
    switch (position) {
      case "left":
        return { x: -80, y: 100 };
      case "right":
        return { x: 80, y: 100 };
      case "center":
      default:
        return { x: 0, y: 100 };
    }
  };

  const { x, y } = getInitialCoords();

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      // Set initial state immediately using GSAP (avoids FOUC)
      gsap.set(el, {
        opacity: 0,
        x,
        y,
        scale: 0.95,
        willChange: "transform, opacity",
      });

      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "power4.out", // close match to cubic-bezier(0.22, 1, 0.2, 1)
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=50px", // matches viewport margin: "-50px"
          once: true, // matches viewport: { once: true }
        },
        onComplete() {
          // Clean up will-change after animation settles to free GPU memory
          gsap.set(el, { willChange: "auto" });
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
