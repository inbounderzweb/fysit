import Image from "next/image";

import { Reveal } from "@/components/animations/Reveal";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { BANNER } from "@/lib/content";

/**
 * Figma 1:306 — 1920 × 706. A 640px photo runs full-bleed down the left,
 * copy starts at x=740, the benefit list at x=1272, and a three-column stat
 * bar spans the content width at y=534.
 */
export function DarkBanner() {
  return (
    <section className="bg-banner text-white">
      <div className="grid lg:grid-cols-[640px_1fr]">
        <div className="relative min-h-[280px] lg:min-h-[706px]">
          <Image
            src={BANNER.image}
            alt={BANNER.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover"
          />
        </div>

        <div className="px-5 py-[70px] sm:px-8 lg:px-[100px] lg:py-[100px]">
          <div className="grid gap-[70px] xl:grid-cols-[462fr_388fr] xl:items-start">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-[5px] rounded-full border border-white/[0.14] bg-white/[0.06] px-3 py-[7px] text-white">
                <span className="size-2 rounded-full bg-teal" aria-hidden />
                {BANNER.eyebrow}
              </span>

              <h2 className="fluid-heading mt-[10px] font-normal text-white">
                {BANNER.heading.lead}{" "}
                <span className="heading-accent">{BANNER.heading.accent}</span>
              </h2>

              <p className="mt-[21px] text-[16px] leading-[25.6px] text-white/70">
                {BANNER.body}
              </p>

              <ArrowButton
                href={BANNER.cta.href}
                label={BANNER.cta.label}
                className="mt-[33px]"
              />
            </Reveal>

            <ul className="flex list-none flex-col gap-[51px]">
              {BANNER.benefits.map((benefit, index) => (
                <Reveal as="li" key={benefit.id} delay={0.1 + index * 0.08}>
                  <div className="flex gap-10">
                    <span className="grid size-[80px] shrink-0 place-items-center rounded-[16px] border border-white/[0.14] bg-white/[0.06] text-white">
                      <Image
                        src={benefit.icon}
                        alt=""
                        width={50}
                        height={50}
                        unoptimized
                      />
                    </span>
                    <div>
                      <h3 className="text-[22px] leading-[30px] tracking-[-0.44px] text-white">
                        {benefit.title}
                      </h3>
                      <p className="mt-[11px] text-[16px] leading-[24px] text-white/70">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Stat bar — Figma 1:352 */}
          <Reveal delay={0.2}>
            <dl className="mt-[70px] grid gap-8 border-t border-white/[0.14] pt-[36px] sm:grid-cols-3">
              {BANNER.stats.map((stat) => (
                <div key={stat.id} className="flex items-center gap-[18px]">
                  {/* Live build puts the figure in a teal pill beside the bar */}
                  <span className="grid h-[38px] w-[57px] shrink-0 place-items-center rounded-full bg-teal text-[14px] font-medium text-white">
                    {stat.value}%
                  </span>
                  <div className="min-w-0 flex-1">
                  <dt className="text-[14px] leading-[16px] text-white/80">
                    {stat.label}
                  </dt>
                  <dd
                    className="mt-[14px] h-[6px] w-full max-w-[267px] overflow-hidden rounded-full bg-white/[0.16]"
                    role="meter"
                    aria-valuenow={stat.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={stat.label}
                  >
                    <span
                      className="block h-full rounded-full bg-teal"
                      style={{ width: `${stat.value}%` }}
                    />
                  </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
