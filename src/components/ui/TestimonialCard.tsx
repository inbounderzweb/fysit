import Image from "next/image";

import { Rating } from "@/components/ui/Rating";
import type { Testimonial } from "@/lib/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/**
 * Figma 1:450 — 400 × 338, 30px padding, an 80px avatar, and a five-star
 * row of 16px icons pitched 18px apart.
 *
 * Admin-managed testimonials may arrive without a photo or a rating: a
 * missing photo becomes an initials disc, a missing rating drops the stars,
 * and long quotes are clamped so the card keeps its fixed height.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-[338px] w-[400px] shrink-0 flex-col rounded-[10px] border-b border-line bg-white p-[30px] shadow-[0_18px_50px_-28px_rgba(8,29,82,0.22)]">
      <div className="flex items-center gap-[20px]">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt=""
            width={80}
            height={80}
            className="size-[80px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-[80px] shrink-0 place-items-center rounded-full bg-mint text-[26px] font-medium text-navy"
          >
            {initials(testimonial.name)}
          </span>
        )}
        <figcaption>
          <p className="text-[24px] leading-[34px] tracking-[-0.48px] text-navy">
            {testimonial.name}
          </p>
          {testimonial.role && (
            <p className="text-[16px] leading-[26px] text-body">
              {testimonial.role}
            </p>
          )}
        </figcaption>
      </div>

      <blockquote className="mt-[29px] line-clamp-5 text-[16px] leading-[25.6px] text-body">
        “{testimonial.quote}”
      </blockquote>

      {testimonial.rating ? (
        <div className="mt-auto pt-[10px]">
          <Rating value={testimonial.rating} />
        </div>
      ) : null}
    </figure>
  );
}
