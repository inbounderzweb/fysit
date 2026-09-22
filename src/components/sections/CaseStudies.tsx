import Image from "next/image";
import Link from "next/link";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { BandHeading } from "@/components/ui/BandHeading";
import { CASE_STUDIES, CASE_STUDIES_HEADING } from "@/lib/content";

/**
 * Figma 1:413 — a mint band whose top edge is a shallow arc (node 1:415),
 * holding a 2 × 2 grid of 835px cards on a 1700px content width.
 */
export function CaseStudies() {
  return (
    <section id="case-studies" className="relative">
      {/* Arched top edge */}
      <svg
        className="block h-[50px] w-full text-mint lg:h-[90px]"
        viewBox="0 0 1920 90"
        preserveAspectRatio="none"
        aria-hidden
        focusable="false"
      >
        <path d="M0 90 Q960 0 1920 90 Z" fill="currentColor" />
      </svg>

      <div className="bg-mint pb-[70px] lg:pb-[160px]">
        <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8 lg:px-0">
          <Reveal>
            <BandHeading
              lead={CASE_STUDIES_HEADING.lead}
              accent={CASE_STUDIES_HEADING.accent}
            />
          </Reveal>

          <StaggerGroup
            as="ul"
            className="mt-[40px] grid list-none grid-cols-1 gap-[30px] lg:grid-cols-2 lg:p-[70px]"
          >
            {CASE_STUDIES.map((study) => (
              <StaggerItem as="li" key={study.id}>
                <article className="group h-full rounded-[16px] bg-white p-1">
                  <div className="overflow-hidden rounded-[13px]">
                    <Image
                      src={study.image}
                      alt={study.title}
                      width={827}
                      height={551}
                      sizes="(max-width: 1024px) 100vw, 827px"
                      className="aspect-[827/551] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 px-[30px] py-[29px]">
                    <h3 className="text-[28px] leading-[40px] tracking-[-1.12px] text-navy">
                      <Link
                        href={study.href}
                        className="transition-colors hover:text-teal"
                      >
                        {study.title}
                      </Link>
                    </h3>
                    <span className="shrink-0 rounded-[6px] bg-mint px-3 py-[6px] text-[16px] leading-[22px] text-navy">
                      {study.category}
                    </span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
