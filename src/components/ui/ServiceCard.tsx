import Image from "next/image";
import Link from "next/link";

import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Figma 1:152 — 420 × 418.19, 35px gutters, a 100px teal icon tile, a rule at
 * 324.19 and the "Explore Service" link beneath. Card two in the first row
 * carries the drop shadow (1:165); every card takes it on hover.
 */
type ServiceCardProps = {
  service: Service;
  featured?: boolean;
};

export function ServiceCard({ service, featured = false }: ServiceCardProps) {
  return (
    <article
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden rounded-[8px] bg-white px-[35px] pb-[40px] pt-[48px]",
        "border transition-shadow duration-300",
        featured
          ? "border-transparent shadow-[0_20px_35px_-10px_rgba(8,29,82,0.13)]"
          : "border-line hover:shadow-[0_20px_35px_-10px_rgba(8,29,82,0.13)]",
      )}
    >
      {/* Photo behind the icon tile, revealed on hover (live `service-img-wrap`) */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[35px] right-[36px] top-[48px] -z-10 block h-[100px] overflow-hidden rounded-[15px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <Image
          src={service.hoverImage}
          alt=""
          fill
          sizes="347px"
          className="object-cover"
        />
      </span>

      <span
        className={cn(
          "grid size-[100px] shrink-0 place-items-center rounded-[15px] bg-teal text-white",
          "transition-colors duration-500 group-hover:bg-teal/0",
        )}
      >
        <Image
          src={service.icon}
          alt=""
          width={54}
          height={54}
          className="size-[54px]"
          unoptimized
        />
      </span>

      <h3 className="mt-[39px] text-[28px] leading-[38px] tracking-[-1.12px] text-navy">
        <Link href={service.href} className="transition-colors hover:text-teal">
          {service.title}
        </Link>
      </h3>

      <p className="mt-[19px] line-clamp-2 text-[16px] leading-[25.6px] text-body">
        {service.description}
      </p>

      <hr className="mt-[27px] border-0 border-t border-rule" />

      <Link
        href={service.href}
        className="mt-[27px] inline-flex items-center gap-[7px] text-[16px] font-medium leading-[26px] text-navy transition-colors hover:text-teal"
      >
        Explore Service
        <Image
          src="/icons/service-explore-arrow.svg"
          alt=""
          width={25}
          height={24}
          className="transition-transform duration-300 group-hover:translate-x-1"
          unoptimized
        />
        <span className="sr-only">— {service.title}</span>
      </Link>
    </article>
  );
}
