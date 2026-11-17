"use client";

import { Reveal } from "@/components/animations/Reveal";
import { ArrowControl } from "@/components/sections/ReviewsSection";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { BandHeading } from "@/components/ui/BandHeading";
import { Container } from "@/components/ui/Container";
import { GoogleLogo } from "@/components/ui/GoogleLogo";
import { Rating } from "@/components/ui/Rating";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { TESTIMONIALS_HEADING } from "@/lib/content";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { GoogleReviewsSummary } from "@/services/settings.service";

type GoogleReviewsSectionProps = {
  /** Only reviews marked as posted on Google. */
  reviews: Testimonial[];
  summary: GoogleReviewsSummary;
  headingSize?: "default" | "large";
};

/**
 * The reviews band once real Google data is in: a Google-branded rating panel
 * (logo, overall rating, review count, link to the profile) joined to a
 * carousel of the Google reviews. Side by side from lg; stacked below, where
 * the panel turns into a compact bar above the cards.
 */
export function GoogleReviewsSection({ reviews, summary, headingSize = "default" }: GoogleReviewsSectionProps) {
  const count = reviews.length;
  const { sectionRef, trackRef, activeIndex, goTo, onScroll, pauseHandlers } = useSnapCarousel({
    count,
    autoplayMs: 6000,
  });

  const previous = () => goTo(activeIndex === 0 ? count - 1 : activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

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

      <Container size="wide" className="mt-[44px] lg:mt-[64px]">
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[370px_minmax(0,1fr)]">
          {/* Rating panel */}
          <Reveal
            as="article"
            delay={0.1}
            className="relative isolate overflow-hidden rounded-[20px] bg-[#353068] p-6 text-white sm:p-8 lg:flex lg:flex-col lg:p-9"
          >
            {/* A soft teal glow, the brand's one colour wash on dark bands. */}
            <div
              aria-hidden
              className="absolute -right-24 -top-24 -z-10 size-[260px] rounded-full bg-teal/25 blur-[90px]"
            />

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 lg:block">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.4)]">
                    <GoogleLogo size={24} />
                  </span>
                  <span className="flex flex-col">
                    <GoogleWordmark />
                    <span className="mt-1 text-[14px] font-medium uppercase leading-none tracking-[1.6px] text-white/70">
                      Reviews
                    </span>
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-4 lg:mt-9">
                  <span className="text-[60px] font-light leading-[0.85] tracking-[-0.05em] md:text-[72px]">
                    {summary.rating.toFixed(1)}
                  </span>
                  <div className="pb-1">
                    <Rating value={summary.rating} size={20} />
                    <p className="mt-2 text-[14px] leading-5 text-white/70">
                      {summary.count.toLocaleString("en-IN")} reviews
                    </p>
                  </div>
                </div>
              </div>

              <p className="hidden max-w-[300px] text-[15px] leading-[24px] text-white/70 lg:mt-7 lg:block">
                Reviews from patients on the clinic&rsquo;s Google profile.
              </p>

              {summary.url && (
                <ArrowButton
                  href={summary.url}
                  label="See all reviews"
                  className="lg:mt-8"
                />
              )}
            </div>

            {count > 1 && (
              <div className="mt-auto hidden items-center justify-between pt-10 lg:flex">
                <span className="text-[14px] tabular-nums text-white/60">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </span>
                <div className="flex gap-2">
                  <ArrowControl tone="dark" direction="previous" onClick={previous} />
                  <ArrowControl tone="dark" direction="next" onClick={next} />
                </div>
              </div>
            )}
          </Reveal>

          {/* Review cards */}
          <Reveal y={40} delay={0.2} className="min-w-0">
            <ul
              ref={trackRef}
              onScroll={onScroll}
              aria-roledescription="carousel"
              aria-label="Google reviews"
              className={cn(
                "-my-4 flex h-full list-none snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-4 md:gap-6",
                // Room for the hover lift and shadow, which the scroller would clip.
                "-mx-5 px-5 scroll-px-5 sm:-mx-8 sm:px-8 sm:scroll-px-8 lg:mx-0 lg:px-0 lg:scroll-px-0",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "lg:[mask-image:linear-gradient(to_right,#000_88%,transparent)]",
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
                    className="w-[84vw] max-w-[360px] shrink-0 snap-start sm:w-[360px]"
                  >
                    <ReviewCard review={review} />
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </Container>

      {count > 1 && (
        <div className="mt-8 flex items-center justify-center gap-[10px] lg:hidden">
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

/** Google's letters in its own colours. Its blue is too dark on the navy panel, so a lighter blue stands in. */
const WORDMARK = [
  ["G", "#6FA3FF"],
  ["o", "#EA4335"],
  ["o", "#FBBC05"],
  ["g", "#6FA3FF"],
  ["l", "#34A853"],
  ["e", "#EA4335"],
] as const;

function GoogleWordmark() {
  return (
    <span className="text-[24px] font-medium leading-none tracking-[-0.02em]">
      <span className="sr-only">Google</span>
      {WORDMARK.map(([letter, color], index) => (
        <span key={index} aria-hidden style={{ color }}>
          {letter}
        </span>
      ))}
    </span>
  );
}
