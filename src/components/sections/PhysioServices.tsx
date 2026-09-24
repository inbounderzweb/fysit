"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceSlideCard } from "@/components/ui/ServiceSlideCard";
import { PHYSIO_SERVICES, PHYSIO_SERVICES_HEADING } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * A snap-scrolling carousel of treatment cards on a mint band — distinct
 * from the icon-tile `Services` grid, and from every other heading on the
 * site, its accent clause and active dot are sky blue, not teal (sampled
 * from the reference render). Cards bleed past the container's right edge
 * and a dot rail below tracks whichever card is snapped at the leading edge.
 */
/** Pause between autoplay advances. The hero slider runs 6500ms; cards are a smaller read. */
const AUTOPLAY_MS = 3500;

/** How long a clicked dot outranks the scroll position, i.e. long enough for the smooth scroll to settle. */
const INTENT_MS = 900;

export function PhysioServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const intentRef = useRef<{ until: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const reduceMotion = useReducedMotion();

  const lastIndex = PHYSIO_SERVICES.length - 1;

  /**
   * How far each card sits from the track's left edge when it is the snapped
   * one. Cards snap to the scroll-padding line, not the track's border edge,
   * so measuring against the edge reports the *previous* card as active and
   * makes `scrollTo` land a card short. Read from the computed style so the
   * responsive `scroll-pl-*` value is whatever the breakpoint resolved to.
   *
   * Only the real cards are candidates — the trailing spacer isn't one.
   */
  const readTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;

    const gutter = Number.parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const trackLeft = track.getBoundingClientRect().left;
    const cards = Array.from(track.children).slice(0, PHYSIO_SERVICES.length) as HTMLElement[];
    // Each card's distance from where it would rest if it were snapped.
    const offsets = cards.map(
      (card) => card.getBoundingClientRect().left - trackLeft - gutter,
    );

    return { track, offsets, maxScrollLeft: track.scrollWidth - track.clientWidth };
  }, []);

  const handleScroll = useCallback(() => {
    // A dot the visitor just clicked stays lit while the scroll settles. On a
    // wide viewport the trailing cards can't reach the snap line — the track
    // runs out of range first — so deriving the dot purely from geometry would
    // light a different one than the dot that was asked for.
    if (intentRef.current !== null && Date.now() < intentRef.current.until) return;
    intentRef.current = null;

    const read = readTrack();
    if (!read) return;
    const { track, offsets, maxScrollLeft } = read;

    // The scroll extremes are always valid resting positions, even for a
    // trailing card whose own snap point sits beyond what's reachable — so
    // check those directly rather than via the nearest-card search below.
    if (track.scrollLeft <= 1) {
      setActiveIndex(0);
      return;
    }
    if (maxScrollLeft > 0 && track.scrollLeft >= maxScrollLeft - 1) {
      setActiveIndex(lastIndex);
      return;
    }

    let closest = 0;
    let closestDistance = Infinity;
    offsets.forEach((offset, index) => {
      if (Math.abs(offset) < closestDistance) {
        closestDistance = Math.abs(offset);
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, [lastIndex, readTrack]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const read = readTrack();
      if (!read || read.offsets[index] === undefined) return;

      intentRef.current = { until: Date.now() + INTENT_MS };
      setActiveIndex(index);
      read.track.scrollTo({
        left: read.track.scrollLeft + read.offsets[index],
        behavior: "smooth",
      });
    },
    [readTrack],
  );

  /**
   * Autoplay reads the live DOM rather than `activeIndex`, so the interval
   * never has to be torn down and rebuilt as the carousel moves: it advances
   * to the first card still ahead of the snap line, and wraps to the start
   * once there is no scroll range left.
   */
  const advance = useCallback(() => {
    const read = readTrack();
    if (!read) return;
    const { track, offsets, maxScrollLeft } = read;
    if (maxScrollLeft <= 0) return;

    if (track.scrollLeft >= maxScrollLeft - 1) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    const next = offsets.find((offset) => offset > 1);
    track.scrollTo({
      left: next === undefined ? 0 : track.scrollLeft + next,
      behavior: "smooth",
    });
  }, [readTrack]);

  // Autoplay only while the carousel is actually on screen, so a visitor
  // arriving from the top of the page doesn't meet it already part-scrolled.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || isPaused || !isOnScreen) return;
    const timer = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [advance, isPaused, isOnScreen, reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-mint pb-[60px] pt-[70px] lg:pb-[110px] lg:pt-[130px]"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
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
          onScroll={handleScroll}
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
          {PHYSIO_SERVICES.map((service) => (
            <li
              key={service.id}
              className="w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-[300px]"
            >
              <ServiceSlideCard service={service} className="h-full" />
            </li>
          ))}
          {/* Trailing spacer so the last card can snap fully into view
              instead of being pinned to the track's right edge. */}
          <li aria-hidden className="w-px shrink-0 sm:w-5 lg:w-[calc((100vw-1320px)/2)]" />
        </ul>
      </Reveal>

      <div className="mt-8 flex items-center justify-center gap-[10px]">
        {PHYSIO_SERVICES.map((service, index) => (
          <button
            key={service.id}
            type="button"
            aria-label={`Go to ${service.title}`}
            aria-current={index === activeIndex}
            onClick={() => scrollToIndex(index)}
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
