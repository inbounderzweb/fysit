"use client";

import { Reveal } from "@/components/animations/Reveal";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { BandHeading } from "@/components/ui/BandHeading";
import { Container } from "@/components/ui/Container";
import { Rating } from "@/components/ui/Rating";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { TESTIMONIALS_HEADING } from "@/lib/content";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { GoogleReviewsSummary } from "@/services/settings.service";

type ReviewsSectionProps = {
  reviews: Testimonial[];
  /** The clinic's Google rating from Admin → Settings; no summary is shown without it. */
  summary: GoogleReviewsSummary | null;
  headingSize?: "default" | "large";
};

/**
 * Patient reviews: the band heading, the clinic's Google rating beside the
 * carousel controls, then a snap-scrolling row of review cards that bleeds
 * past the container's right edge, as the services carousel does.
 */
export function ReviewsSection({ reviews, summary, headingSize = "default" }: ReviewsSectionProps) {
  const count = reviews.length;
  const { sectionRef, trackRef, activeIndex, goTo, onScroll, pauseHandlers } = useSnapCarousel({
    count,
    autoplayMs: 6000,
  });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden bg-white pb-[64px] pt-[70px] lg:pb-[120px] lg:pt-[130px]"
      {...pauseHandlers}
    >
      <Reveal className="px-5">
        <BandHeading size={headingSize} lead={TESTIMONIALS_HEADING.lead} accent={TESTIMONIALS_HEADING.accent} />
      </Reveal>

      <Container size="wide">
        <Reveal
          delay={0.1}
          className="mt-[44px] flex flex-col gap-6 border-b border-rule pb-8 sm:flex-row sm:items-end sm:justify-between lg:mt-[60px]"
        >
          {summary ? (
            <div className="flex items-center gap-5">
              <span className="text-[56px] font-light leading-none tracking-[-0.04em] text-navy md:text-[64px]">
                {summary.rating.toFixed(1)}
              </span>
              <div>
                <Rating value={summary.rating} size={20} />
                <p className="mt-2 text-[15px] leading-5 text-body">
                  Based on {summary.count.toLocaleString("en-IN")} reviews on Google
                </p>
              </div>
            </div>
          ) : (
            <p className="max-w-[420px] text-[16px] leading-[26px] text-body">
              What patients say after their treatment at The Fysit.
            </p>
          )}

          <div className="flex items-center gap-3">
            {summary?.url && (
              <ArrowButton href={summary.url} label="See all reviews on Google" variant="dark" />
            )}
            {count > 1 && (
              <div className="hidden gap-2 lg:flex">
                <ArrowControl
                  direction="previous"
                  onClick={() => goTo(activeIndex === 0 ? count - 1 : activeIndex - 1)}
                />
                <ArrowControl direction="next" onClick={() => goTo(activeIndex + 1)} />
              </div>
            )}
          </div>
        </Reveal>
      </Container>

      <Reveal y={40} delay={0.2}>
        <ul
          ref={trackRef}
          onScroll={onScroll}
          aria-roledescription="carousel"
          aria-label="Patient reviews"
          className={cn(
            "mt-10 flex list-none snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pt-2 md:gap-6",
            // Leading gutter lines the first card up with the container; the
            // matching scroll padding keeps snapping from eating it.
            "pl-5 sm:pl-8 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))]",
            "scroll-pl-5 sm:scroll-pl-8 lg:scroll-pl-[max(3rem,calc((100vw-1320px)/2+3rem))]",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* Rendered twice so the row can loop; the copies are inert. */}
          {[...reviews, ...reviews].map((review, index) => {
            const isLoopCopy = index >= count;
            return (
              <li
                key={isLoopCopy ? `${review.id}-loop` : review.id}
                inert={isLoopCopy}
                aria-roledescription={isLoopCopy ? undefined : "slide"}
                aria-label={isLoopCopy ? undefined : `${(index % count) + 1} of ${count}`}
                className="w-[84vw] max-w-[380px] shrink-0 snap-start sm:w-[380px]"
              >
                <ReviewCard review={review} />
              </li>
            );
          })}
        </ul>
      </Reveal>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-[10px] lg:hidden">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              aria-label={`Go to review ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
              className={cn(
                "h-[9px] rounded-full transition-all duration-300",
                index === activeIndex ? "w-[26px] bg-teal" : "w-[9px] bg-rule hover:bg-teal/50",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ArrowControl({
  direction,
  onClick,
  tone = "light",
}: {
  direction: "previous" | "next";
  onClick: () => void;
  /** "dark" for use on a navy panel. */
  tone?: "light" | "dark";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "next" ? "Next review" : "Previous review"}
      className={cn(
        "grid size-[53px] place-items-center rounded-[8px] border transition-colors duration-300",
        tone === "dark"
          ? "border-white/20 text-white hover:border-white hover:bg-white hover:text-navy"
          : "border-rule text-navy hover:border-navy hover:bg-navy hover:text-white",
      )}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
        className={cn(direction === "previous" && "rotate-180")}
      >
        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
