import Image from "next/image";
import Link from "next/link";

import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/utils";

type CaseStudyCardProps = {
  study: CaseStudy;
  className?: string;
};

/**
 * A 3:4 photo card with a frosted panel floated over its foot, holding the
 * category as a white pill and the title beneath it. The panel is anchored to
 * the bottom and grows upward, so a title that wraps to two lines pushes the
 * panel taller instead of overflowing — which is how the reference behaves.
 */
export function CaseStudyCard({ study, className }: CaseStudyCardProps) {
  return (
    <article
      className={cn(
        "group relative aspect-[3/4] overflow-hidden rounded-[16px]",
        className,
      )}
    >
      <Image
        src={study.image}
        alt={study.title}
        fill
        sizes="(max-width: 640px) 80vw, 377px"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
      />

      <div
        className={cn(
          "absolute inset-x-5 bottom-5 rounded-[14px] p-[28px]",
          // The panel reads the photo behind it, so it picks up each card's
          // colour cast the way the reference render does.
          "bg-linear-to-br from-white/90 via-white/75 to-white/55 backdrop-blur-[22px]",
        )}
      >
        <span className="inline-flex rounded-full bg-white px-[14px] py-[5px] text-[13px] leading-[15px] text-navy">
          {study.category}
        </span>

        <h3 className="mt-[9px] text-[26px] leading-[38px] tracking-[-1px] text-navy">
          <Link href={study.href} className="transition-colors hover:text-sky">
            {/* Stretched so the whole card is the hit target, while the link
                itself stays a plain text link for screen readers. */}
            <span className="absolute inset-0" aria-hidden />
            {study.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}
