"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Each word wipes in left to right while it fades up from nothing, 0.1s
 * behind the one before — sampled off the reference theme's
 * `text-anime-style` headings. The clip is dropped once a word lands, so an
 * italic accent's overhang isn't trimmed at rest.
 */
const word: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: (index: number) => ({
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.55, delay: index * 0.1, ease: EASE },
    transitionEnd: { clipPath: "none" },
  }),
};

type WordRevealHeadingProps = {
  lead: string;
  /** Set in Playfair italic, teal — the `heading-accent` clause. */
  accent: string;
  tone?: "navy" | "white";
  className?: string;
};

/**
 * The reference's section heading: 60/70px at tablet and up, 36/46px on a
 * phone, -0.05em tracking. Sized here rather than through `fluid-heading`,
 * whose clamp only reaches 60px at a 1920px viewport.
 */
export function WordRevealHeading({
  lead,
  accent,
  tone = "navy",
  className,
}: WordRevealHeadingProps) {
  const reduceMotion = useReducedMotion();
  const words = [
    ...lead.split(" ").map((text) => ({ text, accent: false })),
    ...accent.split(" ").map((text) => ({ text, accent: true })),
  ];

  return (
    <motion.h2
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "font-normal tracking-[-0.05em]",
        "text-[36px] leading-[46px] md:text-[60px] md:leading-[70px]",
        tone === "white" ? "text-white" : "text-navy",
        className,
      )}
    >
      {words.map((item, index) => (
        <span key={`${item.text}-${index}`}>
          <motion.span
            custom={index}
            variants={word}
            className={cn("inline-block", item.accent && "heading-accent")}
          >
            {item.text}
          </motion.span>
          {index < words.length - 1 && " "}
        </span>
      ))}
    </motion.h2>
  );
}
