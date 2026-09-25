"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/animations/Reveal";
import { useCountUp } from "@/hooks/use-count-up";
import { HERO_BANNER } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Three tints stacked over the video, measured off the reference render: a
 * near-horizontal wash anchoring the left edge, a faint lift from the foot,
 * and a broad darkening across the bottom half so the counters stay legible
 * over whatever frame is playing.
 */
const BANNER_OVERLAY =
  "linear-gradient(274deg, rgba(7,0,26,0) 38%, rgba(7,0,26,0.54) 76%, rgb(7,0,26)), " +
  "linear-gradient(1deg, rgba(7,0,26,0) 55%, rgba(7,0,26,0.2) 83%, rgba(7,0,26,0.71)), " +
  "linear-gradient(180deg, rgba(7,0,26,0) 47%, rgba(7,0,26,0.9))";

/**
 * The content column: 1320px at its widest, with the gutters the reference
 * steps through. Repeated by the guide-line rail below, inset by the 12px
 * the reference's grid row hangs past the text on each side.
 */
const COLUMN = "mx-auto w-full max-w-[1420px] px-10 md:px-[70px] lg:px-[50px]";

function Counter({ value, suffix, label }: HeroStat) {
  const count = useCountUp(value);

  return (
    <div>
      <div className="flex items-baseline text-[40px] leading-[65px] tracking-[1.35px] text-white md:text-[45px] md:leading-[70px]">
        <span>{count.toLocaleString("en-US")}</span>
        <span>{suffix}</span>
      </div>
      <h6 className="text-[14px] font-medium uppercase leading-[20px] tracking-[1.4px] text-white md:leading-[14px]">
        {label}
      </h6>
    </div>
  );
}

type HeroStat = (typeof HERO_BANNER)["stats"][number];

export function Hero() {
  return (
    <section
      aria-label="Welcome"
      /* No clipping: the guide rail is meant to run past the banner's edges. */
      className="relative isolate w-full bg-[#07001a]"
    >
      <video
        className="absolute inset-0 size-full object-cover"
        src={HERO_BANNER.video}
        autoPlay
        muted
        loop
        playsInline
        role="presentation"
      />
      <div className="absolute inset-0" style={{ backgroundImage: BANNER_OVERLAY }} aria-hidden />

      {/* Four hairlines spaced across the content column, bleeding past the
          banner top and foot so they carry behind the header. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[132px] -top-[101px] left-0 right-0 z-[1] opacity-10"
      >
        <div
          className={cn(
            "flex h-full justify-between",
            "mx-auto w-full max-w-[1420px] px-[28px] md:px-[58px] lg:px-[38px]",
          )}
        >
          <span className="w-px bg-white" />
          <span className="w-px bg-white" />
          <span className="w-px bg-white" />
          <span className="w-px bg-white" />
        </div>
      </div>

      <div className={cn("relative z-[2]", COLUMN)}>
        <Reveal y={50} className="pb-[100px] pt-[160px] md:pt-[250px]">
          <h1
            className={cn(
              "font-normal text-white",
              "text-[44px] leading-[54px] md:text-[54px] md:leading-[64px] xl:text-[75px] xl:leading-[80px]",
              "tracking-[-0.05em] lg:max-w-[60%]",
            )}
          >
            {HERO_BANNER.heading}
          </h1>

          <Link
            href={HERO_BANNER.cta.href}
            className="group mt-[30px] inline-flex h-[53px] flex-row-reverse items-center gap-3 overflow-hidden rounded-[8px] bg-white pl-5 pr-1 text-navy"
          >
            {/* Two arrows: the resting one slides out to the right while its
                twin follows in from the left. */}
            <span className="relative grid size-[45px] shrink-0 place-items-center overflow-hidden rounded-[5px] bg-[#07112f]">
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={23}
                height={22}
                unoptimized
                className="col-start-1 row-start-1 transition-transform duration-300 group-hover:translate-x-[45px]"
              />
              <Image
                src="/icons/arrow-right.svg"
                alt=""
                width={23}
                height={22}
                unoptimized
                className="col-start-1 row-start-1 -translate-x-[45px] transition-transform duration-300 group-hover:translate-x-0"
              />
            </span>
            <span className="text-[16px] font-medium leading-[26px]">
              {HERO_BANNER.cta.label}
            </span>
          </Link>

          {/* The reference sets its word at 60/120/180/220px, filling ~91% of
              the column. Ours is three letters longer, so the ramp is scaled
              to hold that same proportion instead of running past the edge. */}
          <div
            className={cn(
              "my-[50px] font-medium text-white lg:text-right",
              "text-[46px] leading-[46px] md:text-[94px] md:leading-[94px]",
              "xl:text-[176px] xl:leading-[176px] 2xl:text-[200px] 2xl:leading-[200px]",
            )}
          >
            {HERO_BANNER.word}
          </div>

          <div className="flex flex-wrap items-center gap-y-10 lg:flex-nowrap">
            <div className="flex w-full gap-10 md:gap-[80px] lg:w-7/12">
              {HERO_BANNER.stats.map((stat) => (
                <Counter key={stat.label} {...stat} />
              ))}
            </div>
            <p className="w-full text-[16px] leading-[25.6px] text-white lg:ml-auto lg:w-5/12 lg:max-w-[456px]">
              {HERO_BANNER.body}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
