"use client";

import { Reveal } from "@/components/animations/Reveal";
import { BandHeading } from "@/components/ui/BandHeading";
import { CaseStudyCard } from "@/components/ui/CaseStudyCard";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { CASE_STUDIES, CASE_STUDIES_HEADING } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * A white band holding the oversized two-line heading and a snap-scrolling
 * row of 3:4 photo cards that bleeds past the content width on both sides.
 * Cards are a fixed 377px, so the row fills a 1700px band exactly and starts
 * paging on anything narrower.
 */
export function CaseStudies() {
  const { sectionRef, trackRef, activeIndex, goTo, onScroll, pauseHandlers } =
    useSnapCarousel({ count: CASE_STUDIES.length });

  return (
    <section
      id="case-studies"
      ref={sectionRef}
      aria-roledescription="carousel"
      className="overflow-hidden bg-white py-[70px] lg:pb-[130px]"
      {...pauseHandlers}
    >
      <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8">
        <Reveal>
          <BandHeading
            lead={CASE_STUDIES_HEADING.lead}
            accent={CASE_STUDIES_HEADING.accent}
          />
        </Reveal>
      </div>

      <Reveal y={40} delay={0.1}>
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className={cn(
            "mt-[46px] flex list-none snap-x snap-mandatory gap-[30px] overflow-x-auto scroll-smooth pb-2",
            // `scroll-pl-*` mirrors `pl-*` exactly — without it, snap-align
            // measures each card against the scrollport's border edge, not
            // its padding edge, and "corrects" the leading gutter away on
            // first paint, yanking card one flush against the viewport.
            "pl-5 sm:pl-8 lg:pl-[max(2rem,calc((100vw-1700px)/2+2rem))]",
            "scroll-pl-5 sm:scroll-pl-8 lg:scroll-pl-[max(2rem,calc((100vw-1700px)/2+2rem))]",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* The set is rendered twice so the row can loop; the duplicates are
              `inert`, keeping them out of the tab order and the a11y tree. */}
          {[...CASE_STUDIES, ...CASE_STUDIES].map((study, index) => {
            const isLoopCopy = index >= CASE_STUDIES.length;
            return (
              <li
                key={isLoopCopy ? `${study.id}-loop` : study.id}
                inert={isLoopCopy}
                className="w-[80vw] max-w-[377px] shrink-0 snap-start sm:w-[377px]"
              >
                <CaseStudyCard study={study} />
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* Desktop shows four of five cards at once and pages on its own, so the
          rail would only add clutter; on a phone it is the one cue that there
          is more to swipe to. */}
      <div className="mt-[60px] flex items-center justify-center gap-2 lg:hidden">
        {CASE_STUDIES.map((study, index) => (
          <button
            key={study.id}
            type="button"
            aria-label={`Go to ${study.title}`}
            aria-current={index === activeIndex}
            onClick={() => goTo(index)}
            className={cn(
              "size-[10px] rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-sky ring-[6px] ring-sky/20"
                : "bg-sky/40 hover:bg-sky/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}
