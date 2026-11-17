"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { GoogleLogo } from "@/components/ui/GoogleLogo";
import { Rating } from "@/components/ui/Rating";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Roughly five lines at the card's width; longer reviews get "Read more". */
const CLAMP_CHARS = 220;

/** Initials discs take one of the brand tints, chosen by name so it never changes. */
const AVATAR_TINTS = [
  "bg-teal/15 text-teal-dark",
  "bg-navy/10 text-navy",
  "bg-sky/15 text-[#3a6fb5]",
  "bg-mint text-navy",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function tintFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
}

/**
 * One patient review, laid out the way people expect a review to look:
 * reviewer and date, stars, then the text. The "Google review" label and the
 * link to the original appear only for reviews the admin marked as posted on
 * Google, so nothing is presented as a Google review that isn't one.
 */
export function ReviewCard({ review }: { review: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const quoteId = useId();
  const isLong = review.quote.length > CLAMP_CHARS;
  const fromGoogle = review.source === "google";

  return (
    <article
      className={cn(
        // `relative` anchors the card's screen-reader-only labels. Without it
        // they position against the page and, from cards far along the
        // carousel, widen it far past the screen on phones.
        "relative flex h-full flex-col rounded-[16px] border border-rule/70 bg-white p-6 md:p-7",
        "shadow-[0_10px_30px_-20px_rgba(8,29,82,0.25)]",
        "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(8,29,82,0.35)]",
      )}
    >
      <header className="flex items-center gap-3.5">
        {review.avatar ? (
          <Image
            src={review.avatar}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-full text-[17px] font-medium",
              tintFor(review.name),
            )}
          >
            {initials(review.name)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[17px] font-medium leading-6 text-navy">{review.name}</h3>
          {(review.date || review.role) && (
            <p className="text-[13px] leading-5 text-body/70">
              {review.date ? <time dateTime={review.date.iso}>{review.date.label}</time> : review.role}
            </p>
          )}
        </div>

        {fromGoogle && (
          <span className="shrink-0 pt-0.5" title="Posted on Google">
            <GoogleLogo size={22} />
            <span className="sr-only">Posted on Google</span>
          </span>
        )}
      </header>

      {review.rating ? (
        <div className="mt-4">
          <Rating value={review.rating} />
        </div>
      ) : null}

      <p
        id={quoteId}
        className={cn("mt-3 text-[15px] leading-[25px] text-body", !expanded && isLong && "line-clamp-5")}
      >
        {review.quote}
      </p>

      {isLong && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={quoteId}
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 self-start text-[14px] font-medium text-teal-dark underline-offset-4 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Grows to keep the footer on the card's foot when a neighbour is taller. */}
      <div aria-hidden className="min-h-5 flex-1" />

      {(review.date && review.role) || review.url ? (
        <footer className="flex items-center justify-between gap-3 border-t border-rule pt-4 text-[13px]">
          <span className="truncate text-body/70">{review.date ? review.role : null}</span>
          {review.url && (
            <a
              href={review.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 font-medium text-navy underline-offset-4 hover:underline"
            >
              {fromGoogle ? "View on Google" : "View original"}
              <span aria-hidden>↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </footer>
      ) : null}
    </article>
  );
}
