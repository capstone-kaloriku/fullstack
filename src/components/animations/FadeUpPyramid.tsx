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

      // Use autoAlpha instead of opacity — it toggles visibility:hidden when 0
      // so the element doesn't block interactions and the browser can skip painting it.
      // Also avoids the "transparent h2" problem because autoAlpha restores
      // visibility:visible as soon as the value rises above 0.
      gsap.set(el, {
        autoAlpha: 0,
        x,
        y,
        scale: 0.95,
      });

      gsap.to(el, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "power4.out",
        // force3D keeps the element on its own compositor layer during animation
        // and releases it when done (force3D:"auto" is GSAP's default).
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=50px",
          once: true,
          // Ensures ScrollTrigger evaluates immediately on creation,
          // so elements already in the viewport (like the Hero h2) fire
          // without needing a scroll event.
          invalidateOnRefresh: true,
        },
        onComplete() {
          // Release the compositor layer now that the animation is done
          // to free GPU memory — especially important on mobile.
          gsap.set(el, { clearProps: "willChange,force3D" });
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
