"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Seamless infinite marquee.
 *
 * The track holds two identical laps side by side and translates by exactly
 * -50%, so the second lap lands where the first began and the loop is
 * continuous. `prefers-reduced-motion` freezes it via the global rule in
 * `globals.css`.
 *
 * Speed is expressed in pixels per second rather than a fixed duration: the
 * headline type is fluid, so a lap is far wider at 1920 than at 390 and a
 * single duration would read very differently across breakpoints. The lap is
 * measured and the duration derived from it, which also keeps the speed right
 * if the word list changes.
 */
type MarqueeProps = {
  children: React.ReactNode;
  /** Pixels travelled per second. The reference build runs 93 / 68 / 47. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
};

export function Marquee({
  children,
  speed = 80,
  reverse = false,
  className,
  trackClassName,
}: MarqueeProps) {
  const lapRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    const lap = lapRef.current;
    if (!lap) return;

    const measure = () => {
      const width = lap.getBoundingClientRect().width;
      if (width > 0) setDuration(width / speed);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(lap);
    return () => observer.disconnect();
  }, [speed]);

  return (
    <div className={cn("flex w-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 flex-nowrap will-change-transform",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          trackClassName,
        )}
        style={{
          animationDuration: duration ? `${duration}s` : undefined,
          // Hold still for the one frame before the lap has been measured,
          // so the default duration never shows as a burst of fast motion.
          animationPlayState: duration ? "running" : "paused",
        }}
      >
        <div
          ref={lapRef}
          className="flex shrink-0 flex-nowrap items-center"
        >
          {children}
        </div>
        <div className="flex shrink-0 flex-nowrap items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
