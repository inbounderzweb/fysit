import Image from "next/image";

import { Rating } from "@/components/ui/Rating";
import type { Testimonial } from "@/lib/types";

/**
 * Figma 1:450 — 400 × 338, 30px padding, an 80px avatar, and a five-star
 * row of 16px icons pitched 18px apart.
 */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-[338px] w-[400px] shrink-0 flex-col rounded-[10px] border-b border-line bg-white p-[30px] shadow-[0_18px_50px_-28px_rgba(8,29,82,0.22)]">
      <div className="flex items-center gap-[20px]">
        <Image
          src={testimonial.avatar}
          alt=""
          width={80}
          height={80}
          className="size-[80px] shrink-0 rounded-full object-cover"
        />
        <figcaption>
          <p className="text-[24px] leading-[34px] tracking-[-0.48px] text-navy">
            {testimonial.name}
          </p>
          <p className="text-[16px] leading-[26px] text-body">
            {testimonial.role}
          </p>
        </figcaption>
      </div>

      <blockquote className="mt-[29px] flex-1 text-[16px] leading-[25.6px] text-body">
        “{testimonial.quote}”
      </blockquote>

      <div className="mt-auto">
        <Rating value={testimonial.rating} />
      </div>
    </figure>
  );
}
