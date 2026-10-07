import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/animations/Reveal";
import { ABOUT_PAGE } from "@/lib/content";

const LABEL = "text-[14px] font-semibold uppercase leading-[24px] tracking-[-0.48px] text-navy";

/**
 * The reference theme's `about-one` block: two halves split by a 1px warm-grey
 * rule. On the left, an oversized year count with its caption set sideways up
 * its right edge, and a stack of overlapping doctor portraits; on the right,
 * the introduction, a text link and a wide photo.
 */
export function AboutIntro() {
  const { intro } = ABOUT_PAGE;

  return (
    <section className="bg-white pb-[80px] pt-[60px] md:pb-[120px] md:pt-[80px]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col px-[30px] xl:flex-row min-[1400px]:px-0">
        {/* Left half */}
        <div className="p-[10px] xl:w-1/2 xl:border-r xl:border-[#d8d1c8]">
          <Reveal className="flex flex-col gap-[30px] md:flex-row md:items-start md:justify-between">
            <h6 className={LABEL}>{intro.label}</h6>

            <div className="flex flex-col justify-center md:w-[512px]">
              <div className="flex items-start">
                {/* The reference sets its "12" at 200px on a phone; our wider "25"
                    steps down to 170px there so the caption beside it still fits. */}
                <h3
                  aria-label={`${intro.years} ${intro.yearsLabel}`}
                  className="text-[170px] font-semibold leading-[170px] tracking-[-0.04em] text-navy md:text-[350px] md:leading-[260px]"
                >
                  <span aria-hidden>{intro.years}</span>
                </h3>
                {/* Reads bottom-to-top, its first line nearest the number and
                    both lines ending flush at the top, as the reference sets it. */}
                <h6
                  aria-hidden
                  className={`${LABEL} ml-[13px] mt-[6px] h-[134px] rotate-180 [text-align:end] [writing-mode:vertical-rl]`}
                >
                  {intro.yearsLabel}
                </h6>
              </div>

              <div className="ml-[20px] mt-[50px] flex items-center gap-[18px]">
                <div className="flex shrink-0">
                  {intro.avatars.map((src, index) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={55}
                      height={55}
                      className={`size-[55px] rounded-full border-4 border-white object-cover ${index > 0 ? "-ml-[15px]" : ""}`}
                    />
                  ))}
                </div>
                <h6 className={`${LABEL} max-w-[220px]`}>{intro.trusted}</h6>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right half */}
        <div className="flex flex-col gap-[20px] p-[10px] xl:w-1/2 xl:pl-[80px]">
          <Reveal>
            <p className="text-[16px] leading-[25.6px] text-body">{intro.body}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <Link
              href={intro.link.href}
              className="text-[16px] leading-[16px] text-[#0a0a0a] underline underline-offset-2 transition-colors hover:text-teal"
            >
              {intro.link.label}
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Image
              src={intro.image}
              alt={intro.imageAlt}
              width={1140}
              height={642}
              sizes="(max-width: 1280px) 100vw, 570px"
              className="aspect-[16/9] w-full rounded-[12px] object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
