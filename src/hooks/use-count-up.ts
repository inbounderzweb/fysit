"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const DURATION_MS = 2000;

/** Decelerating ramp, so the last digits settle rather than snap. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts up from zero on mount, standing in for the reference's odometer. */
export function useCountUp(target: number) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.round(target * easeOut(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion, target]);

  return reduceMotion ? target : value;
}
