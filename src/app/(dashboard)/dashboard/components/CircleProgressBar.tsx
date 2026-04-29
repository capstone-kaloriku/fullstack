"use client";

import "react-circular-progressbar/dist/styles.css";

import { cn } from "@/lib/utils";

import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

const buildStylesWithCustomColors = buildStyles({
  pathColor: "#ff6b00",
  trailColor: "#f8f9fa",
});

interface CircleProps {
  children?: React.ReactNode;
  className?: string | undefined;
  value?: number
  maxValue?: number;
}



function CircleProgressBar({ children, className, value, maxValue }: CircleProps) {

  return (
    <div className={cn("relative w-auto h-auto max-w- mx-auto", className)}>
      <CircularProgressbarWithChildren
        value={value ? value : 0}
        maxValue={maxValue}
        styles={buildStylesWithCustomColors}
      >
        {children}
      </CircularProgressbarWithChildren>
    </div >
  );
}

export default CircleProgressBar;
