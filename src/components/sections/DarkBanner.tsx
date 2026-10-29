"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { Reveal } from "@/components/animations/Reveal";
import { WordRevealHeading } from "@/components/animations/WordRevealHeading";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { BANNER } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * "Why Choose Us" — an editorial band on the dark banner ink. An oversized
 * heading splits an asymmetric grid with the intro copy; below, an arched
 * photograph (parallax inside a clip-reveal, with the clinic's rating as a
 * floating label) faces the benefits set as numbered rows, and the stats close
 * the band as large counting numerals. The hero's four hairlines run behind
 * it so the two dark bands read as one system.
 */
export function DarkBanner() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="relative isolate overflow-hidden bg-banner text-white"
    >
      <GuideLines />

      <Container size="wide" className="py-[90px] md:py-[120px] lg:py-[140px]">
        {/* Head — heading across eight columns, intro hung off its baseline. */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-8">
            <Reveal y={16}>
              <EyebrowPill tone="dark">{BANNER.eyebrow}</EyebrowPill>
            </Reveal>
            <WordRevealHeading
              id="why-choose-us-heading"
              lead={BANNER.heading.lead}
              accent={BANNER.heading.accent}
              tone="white"
              size="display"
              className="mt-6"
            />
          </div>

          <div className="lg:col-span-4 lg:pb-3">
            <DrawnRule />
            <Reveal delay={0.15}>
              <p className="mt-6 text-[16px] leading-[26px] text-white/70 md:text-[17px] md:leading-[28px]">
                {BANNER.body}
              </p>
              <ArrowButton href={BANNER.cta.href} label={BANNER.cta.label} className="mt-8" />
            </Reveal>
          </div>
        </div>

        {/* Body — arched photograph against the numbered benefits. */}
        <div className="mt-[70px] grid gap-[70px] lg:mt-[110px] lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <ArchedPhoto />
          </div>

          <ol className="list-none lg:col-span-6 lg:col-start-7 lg:self-center">
            {BANNER.benefits.map((benefit, index) => (
              <BenefitRow
                key={benefit.id}
                index={index}
                title={benefit.title}
                description={benefit.description}
                last={index === BANNER.benefits.length - 1}
              />
            ))}
          </ol>
        </div>

        {/* Foot — the stats as large numerals over thin meters. */}
        <dl className="mt-[80px] grid gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:mt-[110px]">
          {BANNER.stats.map((stat, index) => (
            <Stat key={stat.id} label={stat.label} value={stat.value} delay={index * 0.12} />
          ))}
        </dl>
      </Container>
    </section>
  );
}

/** Four hairlines across the content column that grow down as the band arrives. */
function GuideLines() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="mx-auto flex h-full w-full max-w-[1320px] justify-between px-5 sm:px-8 lg:px-12">
        {[0, 1, 2, 3].map((line) => (
          <motion.span
            key={line}
            className="w-px origin-top bg-white/[0.06]"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: line * 0.12, ease: EASE }}
          />
        ))}
      </div>
      {/* A single low teal glow behind the heading — the band's only colour wash. */}
      <div className="absolute -left-[10%] -top-[25%] size-[70vw] max-h-[900px] max-w-[900px] rounded-full bg-teal/[0.07] blur-[140px]" />
    </div>
  );
}

/** A teal rule that draws in from the left above the intro copy. */
function DrawnRule() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative h-px w-full bg-white/15">
      <motion.span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1/3 origin-left bg-teal"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
      />
    </div>
  );
}

/**
 * The photograph in an arch. The arch wipes open from the foot as it enters,
 * the image drifts against the scroll inside it, and the rating floats over
 * its edge. A rotating word-ring sits in the space the arch's curve leaves.
 */
function ArchedPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-7%", "7%"]);

  return (
    // The figure, not the clipped arch, watches the viewport: a target clipped
    // to nothing never reports as intersecting, so the arch would stay shut.
    <motion.figure
      ref={ref}
      className="group relative mx-auto max-w-[460px] lg:mx-0 lg:max-w-none"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-b-[20px] rounded-t-[999px]"
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0%)" },
          visible: {
            clipPath: "inset(0% 0% 0% 0%)",
            transition: { duration: 1.3, ease: EASE },
          },
        }}
      >
        <motion.div className="absolute inset-x-0 -inset-y-[9%]" style={{ y }}>
          <Image
            src={BANNER.image}
            alt={BANNER.imageAlt}
            fill
            sizes="(max-width: 1024px) 460px, 40vw"
            className="object-cover object-[64%_center] transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </motion.div>
        {/* Darkens the foot so the floating label always has contrast. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-banner/60 to-transparent" />
      </motion.div>

      <WordRing />

      <motion.figcaption
        className="absolute -right-3 bottom-8 flex items-center gap-4 rounded-[5px] bg-white py-4 pl-5 pr-6 text-navy shadow-card sm:-right-8"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[40px] font-medium leading-none tracking-[-0.05em]">
          {BANNER.rating.value}
        </span>
        <span className="flex flex-col gap-1">
          <span aria-hidden className="text-[13px] leading-none tracking-[2px] text-teal">
            ★★★★★
          </span>
          <span className="text-[13px] font-medium leading-none text-navy/70">
            {BANNER.rating.label}
          </span>
        </span>
      </motion.figcaption>
    </motion.figure>
  );
}

/** Circular text badge, turning on the shared `heading-spin` keyframes. */
function WordRing() {
  return (
    <div
      aria-hidden
      className="absolute -left-2 top-[6%] hidden size-[118px] place-items-center rounded-full bg-banner sm:grid lg:-left-6"
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-heading-spin">
        <defs>
          <path id="why-ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-white/80 text-[10.5px] uppercase tracking-[2.6px]">
          <textPath href="#why-ring" textLength="288" lengthAdjust="spacing">
            {BANNER.ring}
          </textPath>
        </text>
      </svg>
      <span className="size-3 rounded-full bg-teal" />
    </div>
  );
}

type BenefitRowProps = {
  index: number;
  title: string;
  description: string;
  last: boolean;
};

/**
 * One benefit: an italic numeral, the title and its line. The top rule draws
 * in on entry; on hover a teal rule sweeps over it, the numeral takes the
 * accent and the title steps right.
 */
function BenefitRow({ index, title, description, last }: BenefitRowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      className="group relative py-8 md:py-10"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, delay: index * 0.12, ease: EASE },
        },
      }}
    >
      {/* Driven by the row: a 1px target is too thin to observe reliably. */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-white/15"
        variants={{
          hidden: { scaleX: 0 },
          visible: {
            scaleX: 1,
            transition: { duration: 1.1, delay: 0.1 + index * 0.12, ease: EASE },
          },
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-teal transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      {last && <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/15" />}

      <div className="grid grid-cols-[56px_1fr] gap-x-5 md:grid-cols-[96px_1fr] md:gap-x-8">
        <span
          aria-hidden
          className="font-display text-[40px] italic leading-none text-white/25 transition-colors duration-500 group-hover:text-teal md:text-[60px]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
          <h3 className="text-[24px] leading-[30px] tracking-[-0.04em] text-white md:text-[32px] md:leading-[38px]">
            {title}
          </h3>
          <p className="mt-3 max-w-[460px] text-[16px] leading-[26px] text-white/65">
            {description}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

type StatProps = { label: string; value: number; delay: number };

/** A large numeral that counts up once in view, over a meter that fills with it. */
function Stat({ label, value, delay }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 1.8, delay, ease: EASE });
    return () => controls.stop();
  }, [inView, reduceMotion, count, value, delay]);

  return (
    <div ref={ref} className="border-t border-white/15 pt-6">
      <dt className="text-[14px] font-medium uppercase leading-[20px] tracking-[1.4px] text-white/60">
        {label}
      </dt>
      <dd className="mt-3">
        <span className="sr-only">{value}%</span>
        <span
          aria-hidden
          className="flex items-start text-[64px] font-light leading-none tracking-[-0.05em] text-white md:text-[80px] xl:text-[96px]"
        >
          <motion.span>{rounded}</motion.span>
          <span className="mt-2 font-display text-[0.4em] italic text-teal">%</span>
        </span>
        <span
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
          className="mt-5 block h-[2px] w-full overflow-hidden bg-white/10"
        >
          <motion.span
            className="block h-full origin-left bg-teal"
            style={{ width: `${value}%` }}
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.8, delay, ease: EASE }}
          />
        </span>
      </dd>
    </div>
  );
}
