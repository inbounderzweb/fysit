"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** How long a clicked dot outranks the scroll position — enough for the smooth scroll to settle. */
const INTENT_MS = 900;

/** Quiet time after the last scroll event before the track counts as settled. */
const SETTLE_MS = 160;

type SnapCarouselOptions = {
  /** How many real slides the track holds — half of what it renders, since the set is duplicated. */
  count: number;
  /** Pause between autoplay advances. The hero slider runs 6500ms; cards are a smaller read. */
  autoplayMs?: number;
};

/**
 * Drives the scroll-snap carousels (physiotherapy services, case studies):
 * a dot rail that tracks whichever card is snapped at the leading edge, and
 * autoplay that pauses on hover, on focus, off screen, and under reduced
 * motion. The track is a plain `overflow-x-auto` list, so dragging, wheeling
 * and keyboard scrolling keep working without any of this running.
 *
 * The track renders its slides twice and, once scrolling settles past the
 * first set, silently rewinds by exactly one set — landing on the identical
 * card, so the row appears to run forever. Without that, a wide desktop has
 * under one card of scroll range (five 377px cards nearly fill 1920px) and
 * autoplay only twitches back and forth instead of advancing.
 */
export function useSnapCarousel({ count, autoplayMs = 3500 }: SnapCarouselOptions) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const intentRef = useRef<number | null>(null);
  const settleRef = useRef<number | undefined>(undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(false);

  const reduceMotion = useReducedMotion();

  /**
   * How far each slide sits from where it would rest if it were the snapped
   * one. Slides snap to the scroll-padding line, not the track's border edge,
   * so measuring against the edge reports the *previous* slide as active and
   * makes `scrollTo` land a slide short. Read from the computed style so the
   * responsive `scroll-pl-*` value is whatever the breakpoint resolved to.
   */
  const readTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;

    const gutter = Number.parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    const trackLeft = track.getBoundingClientRect().left;
    const offsets = (Array.from(track.children) as HTMLElement[]).map(
      (slide) => slide.getBoundingClientRect().left - trackLeft - gutter,
    );

    return {
      track,
      offsets,
      // The gap between a slide and its own duplicate: one full set.
      setWidth: offsets.length > count ? offsets[count] - offsets[0] : 0,
      maxScrollLeft: track.scrollWidth - track.clientWidth,
    };
  }, [count]);

  /** Rewind out of the duplicated half, instantly and onto an identical frame. */
  const settle = useCallback(() => {
    const read = readTrack();
    if (!read) return;
    const { track, setWidth } = read;
    if (setWidth > 0 && track.scrollLeft >= setWidth - 1) {
      track.scrollTo({ left: track.scrollLeft - setWidth, behavior: "instant" });
    }
  }, [readTrack]);

  const onScroll = useCallback(() => {
    window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(settle, SETTLE_MS);

    // A dot the visitor just clicked stays lit while the scroll settles, so a
    // half-finished scroll can't light a different one than was asked for.
    if (intentRef.current !== null && Date.now() < intentRef.current) return;
    intentRef.current = null;

    const read = readTrack();
    if (!read) return;

    let closest = 0;
    let closestDistance = Infinity;
    read.offsets.forEach((offset, index) => {
      if (Math.abs(offset) < closestDistance) {
        closestDistance = Math.abs(offset);
        closest = index;
      }
    });
    // A duplicate lights its original's dot.
    setActiveIndex(closest % count);
  }, [count, readTrack, settle]);

  const goTo = useCallback(
    (index: number) => {
      const read = readTrack();
      if (!read || read.offsets[index] === undefined) return;

      intentRef.current = Date.now() + INTENT_MS;
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
   * to the first slide still ahead of the snap line, wherever that leaves it.
   */
  const advance = useCallback(() => {
    const read = readTrack();
    if (!read) return;
    const { track, offsets, maxScrollLeft } = read;
    if (maxScrollLeft <= 0) return;

    const next = offsets.find((offset) => offset > 1);
    const target = next === undefined ? 0 : track.scrollLeft + next;
    // On a viewport too wide for even the duplicated set to page through,
    // fall back to running the row back to the start.
    track.scrollTo({ left: target > maxScrollLeft ? 0 : target, behavior: "smooth" });
  }, [readTrack]);

  // Autoplay only while the carousel is on screen, so a visitor arriving from
  // the top of the page doesn't meet it already part-scrolled.
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

  useEffect(() => () => window.clearTimeout(settleRef.current), []);

  useEffect(() => {
    if (reduceMotion || isPaused || !isOnScreen) return;
    const timer = window.setInterval(advance, autoplayMs);
    return () => window.clearInterval(timer);
  }, [advance, autoplayMs, isPaused, isOnScreen, reduceMotion]);

  const pauseHandlers = {
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
    onFocusCapture: () => setIsPaused(true),
    onBlurCapture: () => setIsPaused(false),
  };

  return { sectionRef, trackRef, activeIndex, goTo, onScroll, pauseHandlers };
}
