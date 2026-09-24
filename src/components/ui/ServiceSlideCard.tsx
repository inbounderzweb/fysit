import Image from "next/image";
import Link from "next/link";

import type { PhysioService } from "@/lib/types";
import { cn } from "@/lib/utils";

type ServiceSlideCardProps = {
  service: PhysioService;
  className?: string;
};

/**
 * One card in the "Physiotherapy Services" carousel: a square photo flush to
 * the card's top, then title and copy, with a rounded-square arrow button
 * nested into a notch bitten out of the bottom-right corner (`.card-pocket`
 * carves the notch; the button sits outside the masked body so it survives).
 * Proportions are measured off the reference render, scaled to a 300px card.
 */
export function ServiceSlideCard({ service, className }: ServiceSlideCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <div className="card-pocket flex h-full flex-col overflow-hidden rounded-[16px] bg-white">
        <Image
          src={service.image}
          alt={service.title}
          width={300}
          height={300}
          sizes="(max-width: 640px) 80vw, 300px"
          className="aspect-square w-full shrink-0 object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />

        <div className="flex flex-1 flex-col px-[30px] pb-[28px] pt-[26px]">
          <h3 className="text-[20px] leading-[28px] tracking-[-0.8px] text-navy">
            <Link href={service.href} className="transition-colors hover:text-sky">
              {service.title}
            </Link>
          </h3>
          {/* The extra right padding keeps the clamped second line clear of
              the pocket, which reaches 52px in from the card's right edge. */}
          <p className="mt-[9px] line-clamp-2 pr-[26px] text-[15px] leading-[24px] text-body">
            {service.description}
          </p>
        </div>
      </div>

      <Link
        href={service.href}
        aria-label={`Learn more about ${service.title}`}
        className={cn(
          "absolute bottom-0 right-0 grid size-[36px] place-items-center rounded-[14px]",
          "bg-navy transition-colors duration-300 group-hover:bg-sky",
        )}
      >
        <Image
          src="/icons/arrow-up-right.svg"
          alt=""
          width={15}
          height={14}
          className="-rotate-45 brightness-0 invert transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          unoptimized
        />
      </Link>
    </article>
  );
}
