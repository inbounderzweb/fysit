import Image from "next/image";

import { Marquee } from "@/components/ui/Marquee";
import type { MarqueeWord } from "@/lib/types";
import { cn } from "@/lib/utils";

type MarqueeBandProps = {
  words: MarqueeWord[];
  /** Pixels per second. The reference build runs this band at 93. */
  speed?: number;
  className?: string;
};

/**
 * Figma 1:139 / 1:252 — 200px uppercase Mona Sans Medium with a 100px
 * starburst between terms. Words alternate between solid navy and the
 * teal → navy gradient fill.
 */
export function MarqueeBand({
  words,
  speed = 93,
  className,
}: MarqueeBandProps) {
  return (
    <section
      aria-hidden
      className={cn("w-full overflow-hidden py-6 lg:py-0", className)}
    >
      <Marquee speed={speed}>
        {words.map((word) => (
          <div key={word.text} className="flex shrink-0 items-center">
            <span
              className={cn(
                "fluid-marquee whitespace-nowrap font-medium uppercase",
                word.variant === "gradient"
                  ? "text-gradient-brand"
                  : "text-navy",
              )}
            >
              {word.text}
            </span>
            <Image
              src="/icons/marquee-star.svg"
              alt=""
              width={100}
              height={100}
              className="mx-[clamp(16px,2.9vw,55px)] size-[clamp(30px,5.2vw,100px)] shrink-0"
              unoptimized
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
