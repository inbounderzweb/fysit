"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { EdgeNotch } from "@/components/ui/EdgeNotch";
import { HERO_SLIDES } from "@/lib/content";

/** Figma 1:26 — three stacked overlays over the photograph. */
const HERO_OVERLAY =
  "linear-gradient(-86deg, rgba(0,26,30,0) 38%, rgba(0,26,30,0.54) 70%, rgb(0,26,30) 100%), " +
  "linear-gradient(1deg, rgba(0,26,30,0) 55%, rgba(0,26,30,0.2) 83%, rgba(0,26,30,0.71) 100%), " +
  "linear-gradient(180deg, rgba(0,26,30,0) 47%, rgba(0,26,30,0.2) 100%)";

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 6500;

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const slide = HERO_SLIDES[index];

  const go = useCallback((direction: 1 | -1) => {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) return HERO_SLIDES.length - 1;
      if (next >= HERO_SLIDES.length) return 0;
      return next;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [go, reduceMotion]);

  return (
    <section
      aria-label="Highlights"
      aria-roledescription="carousel"
      /* Live build: the hero is clipped with a 30px curve on its foot. */
      className="relative isolate w-full overflow-hidden rounded-b-[30px] bg-ink"
    >
      {/* Slides — crossfade, one image painted at a time */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: "easeInOut" }}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{ backgroundImage: HERO_OVERLAY }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[620px] w-full flex-col gap-12 px-5 pb-16 pt-[128px] sm:px-8 lg:min-h-[907px] lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:pb-[150px] lg:pl-[100px] lg:pr-[150px] lg:pt-0">
        {/* Badge + headline */}
        <div className="lg:pt-[250px]">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex h-[45px] items-center gap-[10px] rounded-[8px] border border-white/[0.06] bg-white/[0.05] pl-[7px] pr-3 backdrop-blur-[7.5px]"
          >
            <span className="inline-flex h-[22px] items-center rounded-[4px] bg-teal px-[6px] text-[11px] font-medium uppercase leading-[22px] tracking-[1.5px] text-white">
              {slide.eyebrowBadge}
            </span>
            <span className="text-[13px] font-medium uppercase leading-none tracking-[1.5px] text-white">
              {slide.eyebrowText}
            </span>
          </motion.div>

          <h1 className="fluid-display mt-4 font-normal text-white">
            {slide.headingLines.map((line, lineIndex) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: reduceMotion ? 0 : "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: reduceMotion ? 0.2 : 0.9,
                    delay: 0.15 + lineIndex * 0.1,
                    ease: EASE,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* Intro card — Figma 1:44, shaped by an alpha mask with a notched corner */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="w-full max-w-[352px] shrink-0 lg:pt-[450px]"
        >
          <div
            className="bg-white p-10 pb-12 pt-[54px] lg:h-[306.97px] lg:pb-0"
            style={{
              maskImage: "url(/masks/hero-card.svg)",
              WebkitMaskImage: "url(/masks/hero-card.svg)",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          >
            <p className="text-[16px] leading-[25.6px] text-navy lg:w-[272px]">
              {slide.cardBody}
            </p>
            <Link
              href={slide.cta.href}
              className="group mt-[25px] inline-flex h-[53px] items-center gap-3 rounded-[8px] bg-teal pl-5 pr-1 transition-colors duration-300 hover:bg-teal-dark"
            >
              <span className="text-[16px] font-medium leading-[26px] text-white">
                {slide.cta.label}
              </span>
              <span className="grid size-[45px] shrink-0 place-items-center rounded-[5px] bg-white">
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt=""
                  width={23}
                  height={22}
                  className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                  unoptimized
                />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/*
        Slider controls — Figma 1:95 / live `.banner-swiper-buttons`.
        A 54 × 110 white tab flush to the right edge, sitting 27px above the
        hero's vertical centre, with its top corners rounded. Next sits on
        top (↑), previous beneath it (↓).
      */}
      <div className="absolute right-0 top-[calc(50%-27px)] z-20 hidden h-[110px] w-[54px] -translate-y-1/2 flex-col gap-[12px] rounded-l-[20px] bg-white pl-[8px] pt-[10px] lg:flex">
        {/* Curves that fold the tab back into the hero edge */}
        <EdgeNotch corner="tl" className="absolute bottom-full right-0" />
        <EdgeNotch corner="bl" className="absolute top-full right-0" />
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="grid size-10 place-items-center rounded-[14px] bg-white shadow-[0_20px_8.75px_rgba(8,29,82,0.13)] transition-transform duration-300 hover:-translate-y-[2px]"
        >
          <Image
            src="/icons/slider-next.svg"
            alt=""
            width={19}
            height={18}
            className="-rotate-90"
            unoptimized
          />
        </button>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="grid size-10 place-items-center rounded-[14px] bg-white shadow-[0_20px_8.75px_rgba(8,29,82,0.13)] transition-transform duration-300 hover:translate-y-[2px]"
        >
          <Image
            src="/icons/slider-next.svg"
            alt=""
            width={19}
            height={18}
            className="rotate-90"
            unoptimized
          />
        </button>
      </div>
    </section>
  );
}
