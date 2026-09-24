"use client";

import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceSlideCard } from "@/components/ui/ServiceSlideCard";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { PHYSIO_SERVICES, PHYSIO_SERVICES_HEADING } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * A snap-scrolling carousel of treatment cards on a mint band — distinct
 * from the icon-tile `Services` grid, and from every other heading on the
 * site, its accent clause and active dot are sky blue, not teal (sampled
 * from the reference render). Cards bleed past the container's right edge
 * and a dot rail below tracks whichever card is snapped at the leading edge.
 */
export function PhysioServices() {
  const { sectionRef, trackRef, activeIndex, goTo, onScroll, pauseHandlers } =
    useSnapCarousel({ count: PHYSIO_SERVICES.length });

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-mint pb-[60px] pt-[70px] lg:pb-[110px] lg:pt-[130px]"
      aria-roledescription="carousel"
      {...pauseHandlers}
    >
      <Container size="wide">
        <Reveal className="flex flex-col items-center text-center">
          <EyebrowPill>{PHYSIO_SERVICES_HEADING.eyebrow}</EyebrowPill>
          <SectionHeading
            lead={PHYSIO_SERVICES_HEADING.lead}
            accent={PHYSIO_SERVICES_HEADING.accent}
            accentClassName="!text-sky"
            className="mt-[10px] max-w-[715px] text-center"
          />
        </Reveal>
      </Container>

      <Reveal y={40} delay={0.1}>
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className={cn(
            "mt-[42px] flex list-none snap-x snap-mandatory gap-[30px] overflow-x-auto scroll-smooth pb-2",
            // `scroll-pl-*` mirrors `pl-*` exactly — without it, snap-align
            // measures each card against the scrollport's border edge, not
            // its padding edge, and "corrects" the leading gutter away on
            // first paint, yanking card one flush against the viewport.
            "pl-5 sm:pl-8 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))]",
            "scroll-pl-5 sm:scroll-pl-8 lg:scroll-pl-[max(3rem,calc((100vw-1320px)/2+3rem))]",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* The set is rendered twice so the row can loop; the duplicates are
              `inert`, keeping them out of the tab order and the a11y tree. */}
          {[...PHYSIO_SERVICES, ...PHYSIO_SERVICES].map((service, index) => {
            const isLoopCopy = index >= PHYSIO_SERVICES.length;
            return (
              <li
                key={isLoopCopy ? `${service.id}-loop` : service.id}
                inert={isLoopCopy}
                className="w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-[300px]"
              >
                <ServiceSlideCard service={service} className="h-full" />
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* Desktop shows most of the row at once and pages on its own, so the
          rail would only add clutter; on a phone it is the one cue that there
          is more to swipe to. */}
      <div className="mt-8 flex items-center justify-center gap-[10px] lg:hidden">
        {PHYSIO_SERVICES.map((service, index) => (
          <button
            key={service.id}
            type="button"
            aria-label={`Go to ${service.title}`}
            aria-current={index === activeIndex}
            onClick={() => goTo(index)}
            className={cn(
              "h-[9px] rounded-full transition-all duration-300",
              index === activeIndex ? "w-[26px] bg-sky" : "w-[9px] bg-[#c9d9ec] hover:bg-sky/50",
            )}
          />
        ))}
      </div>
    </section>
  );
}
