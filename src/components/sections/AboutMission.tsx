"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

import { ABOUT_PAGE } from "@/lib/content";

/** Each character rests at this opacity until the scroll reaches it. */
const DIM = 0.2;

/** How many characters' worth of scroll one character takes to light up. */
const SPREAD = 3;

function Char({
  char,
  index,
  total,
  progress,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = Math.min(1, (index + SPREAD) / total);
  const opacity = useTransform(progress, [start, end], [DIM, 1]);

  return (
    <motion.span className="inline-block" style={{ opacity }}>
      {char}
    </motion.span>
  );
}

/**
 * The reference theme's `themeht-anim-heading`: a centred 60px statement whose
 * characters start at 20% opacity and light up one after another, scrubbed by
 * scroll rather than played on a timer. Sampled off the live page, the sweep
 * begins with the line about 80% of the way down the viewport and finishes
 * as its foot passes the top eighth.
 */
export function AboutMission() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.13"] });

  const text = ABOUT_PAGE.mission;
  const total = text.replace(/\s/g, "").length;
  // Number every character across the whole line, so the sweep runs once
  // from the first letter to the last rather than restarting per word.
  const words = text.split(" ").reduce<{ text: string; chars: { char: string; index: number }[] }[]>(
    (acc, wordText) => {
      const offset = acc.reduce((sum, w) => sum + w.chars.length, 0);
      acc.push({
        text: wordText,
        chars: Array.from(wordText).map((char, i) => ({ char, index: offset + i })),
      });
      return acc;
    },
    [],
  );

  return (
    <section className="bg-white pb-[10px] pt-[80px] md:pt-[120px]">
      <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-0">
        <h2
          ref={ref}
          className="mx-auto max-w-[990px] text-center text-[60px] font-normal leading-[70px] tracking-[-3px] text-navy"
        >
          <span className="sr-only">{text}</span>
          <span aria-hidden>
            {words.map((word, wordIndex) => (
              <span key={`${word.text}-${wordIndex}`}>
                {/* Words stay whole so a line never breaks mid-word. */}
                <span className="inline-block whitespace-nowrap">
                  {word.chars.map(({ char, index }) =>
                    reduceMotion ? (
                      <span key={index}>{char}</span>
                    ) : (
                      <Char
                        key={index}
                        char={char}
                        index={index}
                        total={total}
                        progress={scrollYProgress}
                      />
                    ),
                  )}
                </span>
                {wordIndex < words.length - 1 && " "}
              </span>
            ))}
          </span>
        </h2>
      </div>
    </section>
  );
}
