import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The oversized two-line heading used by Case Studies (Figma 1:417) and
 * Testimonials (1:444). Both lines are navy Mona Sans — no italic accent
 * here. The second line is indented by 250px and led by a 134px cross.
 */
type BandHeadingProps = {
  lead: string;
  accent: string;
  className?: string;
};

export function BandHeading({ lead, accent, className }: BandHeadingProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <h2 className="fluid-heading-xl font-normal text-navy">
        <span className="block">{lead}</span>
        <span className="flex items-center gap-[18px] ml-[clamp(0px,13vw,250px)]">
          <Image
            src="/icons/heading-cross.webp"
            alt=""
            width={134}
            height={134}
            className="size-[clamp(42px,7vw,134px)] shrink-0"
            unoptimized
          />
          <span>{accent}</span>
        </span>
      </h2>
    </div>
  );
}
