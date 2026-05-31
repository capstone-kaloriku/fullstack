"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface FadeUpPyramidProps {
  children: ReactNode;
  position?: "left" | "center" | "right";
  delay?: number;
  className?: string;
  animateOnMount?: boolean;
}

export function FadeUpPyramid({
  children,
  position = "center",
  delay = 0,
  className,
  animateOnMount = false,
}: FadeUpPyramidProps) {
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

  const initial = { opacity: 0, ...getInitialCoords(), scale: 0.95 };
  const enter = { opacity: 1, x: 0, y: 0, scale: 1 };

  return (
    <motion.div
      initial={initial}
      animate={animateOnMount ? enter : undefined}
      whileInView={animateOnMount ? undefined : enter}
      viewport={animateOnMount ? undefined : { once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.2, 1], // easeOutQuint for a premium spatial interpolation
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
