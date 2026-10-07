import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The oversized two-line heading used by Case Studies (Figma 1:417) and
 * Testimonials (1:444). Both lines are navy Mona Sans — no italic accent
 * here. The second line is indented by 250px and led by the cross, which sits
 * at the reference render's -64° tilt and turns slowly on the spot.
 */
type BandHeadingProps = {
  lead: string;
  accent: string;
  /**
   * `large` is the reference About page's setting of the same heading:
   * 150px at 1400px and up, stepping to 120 / 80 / 50px, with the cross
   * scaled alongside it.
   */
  size?: "default" | "large";
  className?: string;
};

export function BandHeading({ lead, accent, size = "default", className }: BandHeadingProps) {
  const large = size === "large";

  return (
    <div className={cn("flex justify-center", className)}>
      <h2
        className={cn(
          "font-normal text-navy",
          large
            ? "text-[50px] leading-[60px] tracking-[-0.05em] md:text-[80px] md:leading-[80px] xl:text-[120px] xl:leading-[120px] min-[1400px]:text-[150px] min-[1400px]:leading-[150px]"
            : "fluid-heading-xl",
        )}
      >
        <span className="block">{lead}</span>
        <span className="flex items-center gap-[clamp(10px,2vw,32px)] ml-[clamp(0px,13vw,250px)]">
          <Image
            src="/icons/heading-cross.webp"
            alt=""
            width={134}
            height={134}
            className={cn(
              "shrink-0 rotate-[-64deg] animate-heading-spin",
              large ? "size-[59px] md:size-[94px] xl:size-[140px]" : "size-[clamp(32px,5.5vw,84px)]",
            )}
            unoptimized
          />
          <span>{accent}</span>
        </span>
      </h2>
    </div>
  );
}
