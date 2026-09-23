import Image from "next/image";

import { Reveal } from "@/components/animations/Reveal";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT, OPENING_HOURS, OPENING_HOURS_TITLE } from "@/lib/content";

/**
 * Figma 1:113 / 1:115 — the white panel meets the photo with concave joins,
 * drawn in the design with a radial gradient. Reproduced here 1:1.
 */
function ConcaveCorner({ className }: { className: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage:
          "radial-gradient(circle 30px at 0 30px, transparent 0 29.7px, #fff 29.8px)",
      }}
    />
  );
}

export function About() {
  return (
    <section id="about" className="bg-white pb-[70px] pt-[60px] lg:pb-[130px] lg:pt-[110px]">
      <Container>
        <Reveal>
          <EyebrowPill>{ABOUT.eyebrow}</EyebrowPill>
        </Reveal>

        <Reveal delay={0.05}>
          <SectionHeading
            lead={ABOUT.heading.lead}
            accent={ABOUT.heading.accent}
            className="mt-[10px] max-w-[491px]"
          />
        </Reveal>

        <div className="mt-[20px] grid gap-[50px] lg:grid-cols-[818fr_432fr] lg:items-start">
          {/* Photo with the opening-hours panel notched into its top-right */}
          <Reveal delay={0.1} className="lg:pt-[20px]">
            <div className="relative">
              <div className="relative aspect-[818/470] w-full overflow-hidden rounded-[30px]">
                <Image
                  src={ABOUT.image}
                  alt={ABOUT.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 818px"
                  className="object-cover"
                />
              </div>

              <div className="relative z-10 mt-6 rounded-[30px] bg-teal p-[30px] text-white sm:absolute sm:-top-[140px] sm:right-0 sm:mt-0 sm:w-[300px] sm:rounded-bl-[50px] sm:rounded-tr-[30px] sm:bg-white sm:p-0 sm:pl-5">
                <ConcaveCorner className="absolute -left-[30px] bottom-[83.81px] hidden size-[30px] sm:block" />
                <ConcaveCorner className="absolute -bottom-[30px] right-0 hidden size-[30px] rotate-180 sm:block" />

                <div className="sm:rounded-[30px] sm:bg-teal sm:p-[30px]">
                  <h3 className="text-[24px] leading-[34px] tracking-[-0.48px]">
                    {OPENING_HOURS_TITLE}
                  </h3>
                  <dl className="mt-3 text-[14px]">
                    {OPENING_HOURS.map((hour, index) => (
                      <div
                        key={hour.label}
                        className={`flex items-center justify-between py-[5px] ${
                          index < OPENING_HOURS.length - 1
                            ? "border-b border-white/[0.18]"
                            : ""
                        }`}
                      >
                        <dt className="leading-[26px]">{hour.label}</dt>
                        <dd className="font-medium leading-[26px]">
                          {hour.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stat, credentials and CTA */}
          <div>
            <Reveal delay={0.15}>
              {/* Figma 1:127 — the numeral is filled with a photograph */}
              <p
                className="fluid-stat bg-clip-text font-bold text-transparent"
                style={{
                  backgroundImage: `url(${ABOUT.statImage})`,
                  // Figma 1:127 — bg-size 109.02% 100%, anchored top-centre
                  backgroundSize: "109.02% 100%",
                  backgroundPosition: "50% 0%",
                  backgroundRepeat: "no-repeat",
                }}
                aria-label={`${ABOUT.statValue} years of experience`}
              >
                <span aria-hidden>{ABOUT.statValue}</span>
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-5 flex items-center gap-[18px]">
              <div className="flex">
                {ABOUT.statValue &&
                  [0, 1, 2].map((index) => (
                    <Image
                      key={index}
                      src={`/images/doctor-0${index + 1}.jpg`}
                      alt=""
                      width={55}
                      height={55}
                      className="-ml-[15px] size-[55px] rounded-full border-2 border-white object-cover first:ml-0"
                    />
                  ))}
              </div>
              <p className="max-w-[210px] text-[16px] font-medium leading-[21.5px] text-navy">
                {ABOUT.statHeading}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-[30px] text-[16px] leading-[25.6px] text-body">
                {ABOUT.body}
              </p>
              <ArrowButton
                href={ABOUT.cta.href}
                label={ABOUT.cta.label}
                className="mt-[20px]"
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
