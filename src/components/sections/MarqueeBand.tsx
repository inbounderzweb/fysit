import Image from "next/image";

import { Marquee } from "@/components/ui/Marquee";
import type { MarqueeWord } from "@/lib/types";
import { cn } from "@/lib/utils";

type MarqueeBandProps = {
  words: MarqueeWord[];
  /** Pixels per second. The reference build runs this band at 93. */
  speed?: number;
  /**
   * `fluid` (home page) scales the words with the viewport and reaches 200px
   * at 1920. `fixed` is the reference About page's band: 200px words (130px
   * on a phone) set flush to the top with 100px below.
   */
  size?: "fluid" | "fixed";
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
  size = "fluid",
  className,
}: MarqueeBandProps) {
  const fixed = size === "fixed";

  return (
    <section
      aria-hidden
      className={cn(
        "w-full overflow-hidden",
        fixed ? "pb-[100px]" : "py-6 lg:py-0",
        className,
      )}
    >
      <Marquee speed={speed}>
        {words.map((word) => (
          <div key={word.text} className="flex shrink-0 items-center">
            <span
              className={cn(
                "whitespace-nowrap font-medium uppercase",
                fixed
                  ? "text-[130px] leading-[130px] md:text-[200px] md:leading-[200px]"
                  : "fluid-marquee",
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
              className={cn(
                "shrink-0",
                fixed
                  ? "mx-[44px] size-[65px] md:mx-[67px] md:size-[100px]"
                  : "mx-[clamp(16px,2.9vw,55px)] size-[clamp(30px,5.2vw,100px)]",
              )}
              unoptimized
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
