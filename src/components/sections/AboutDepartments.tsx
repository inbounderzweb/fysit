"use client";

import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/animations/Reveal";
import { WordRevealHeading } from "@/components/animations/WordRevealHeading";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { useSnapCarousel } from "@/hooks/use-snap-carousel";
import { ABOUT_PAGE, PHYSIO_SERVICES } from "@/lib/content";
import type { PhysioService } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Paints a white line icon (or the navy arrow) through an SVG used as a mask. */
function maskStyle(url: string) {
  return {
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  } as const;
}

/**
 * The reference theme's `service-item style-4`: a 16:9 photo, then a white
 * body whose 70px teal icon tile straddles the seam. On hover the card's
 * shadow deepens, the photo eases in to 110% and the icon flips on its
 * vertical axis.
 */
function DepartmentCard({ service }: { service: PhysioService }) {
  // Service hrefs are anchors on the home page.
  const href = service.href.startsWith("#") ? `/${service.href}` : service.href;

  return (
    <article className="group flex h-full flex-col rounded-[12px] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-shadow duration-500 hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-[12px]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 385px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="relative flex flex-1 flex-col rounded-b-[12px] px-[30px] pb-[30px] pt-[60px]">
        <span className="absolute -top-[35px] left-[30px] grid size-[70px] place-items-center rounded-[15px] bg-teal shadow-[0_5px_15px_rgba(0,85,255,0.15)] [perspective:400px]">
          <span
            aria-hidden
            className="size-[36px] bg-white transition-transform duration-500 group-hover:[transform:rotateY(180deg)]"
            style={maskStyle(service.icon)}
          />
        </span>

        <h4 className="mb-[10px] text-[28px] leading-[38px] tracking-[-1.12px] text-navy">
          <Link href={href} className="transition-colors hover:text-teal">
            {service.title}
          </Link>
        </h4>
        <p className="mb-[25px] line-clamp-2 text-[16px] leading-[25.6px] text-body">
          {service.description}
        </p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-[6px] self-start text-[16px] font-medium leading-[26px] text-navy transition-colors hover:text-teal"
        >
          {ABOUT_PAGE.departments.linkLabel}
          <span
            aria-hidden
            className="h-[24px] w-[25px] bg-current transition-transform duration-300 group-hover:translate-x-[4px]"
            style={maskStyle("/icons/arrow-right.svg")}
          />
        </Link>
      </div>
    </article>
  );
}

/**
 * The reference theme's dark "Our Department" band, listing our physiotherapy
 * services: a #07112f panel with 20px corners, a looping 4-up carousel that
 * advances every 5s, and a dot rail beneath. On wide screens the row starts
 * inset 50px and runs off the right edge, as the reference's does.
 */
export function AboutDepartments() {
  const { departments } = ABOUT_PAGE;
  const { sectionRef, trackRef, activeIndex, goTo, onScroll, pauseHandlers } = useSnapCarousel({
    count: PHYSIO_SERVICES.length,
    autoplayMs: 5000,
  });

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={departments.eyebrow}
      className="overflow-hidden rounded-[20px] bg-[#07112f] py-[100px] lg:py-[130px]"
      {...pauseHandlers}
    >
      <Reveal className="mx-auto flex max-w-[860px] flex-col items-center px-[30px] text-center">
        <EyebrowPill tone="dark" className="mb-[10px]">
          {departments.eyebrow}
        </EyebrowPill>
        <WordRevealHeading lead={departments.lead} accent={departments.accent} tone="white" />
      </Reveal>

      <Reveal y={40} delay={0.1}>
        <ul
          ref={trackRef}
          onScroll={onScroll}
          className={cn(
            // py-[10px] keeps the card shadows from being clipped by the scroller;
            // the 30px top margin plus that padding lands the cards 40px under
            // the heading, as in the reference.
            "mt-[30px] flex list-none snap-x snap-mandatory overflow-x-auto scroll-smooth py-[10px]",
            "gap-[5px] sm:gap-[10px] md:gap-[20px] lg:gap-[30px]",
            "mx-[40px] xl:ml-[80px] xl:mr-[30px] 2xl:ml-[50px] 2xl:mr-0",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
        >
          {/* Rendered twice so the row can loop; the copies are inert. */}
          {[...PHYSIO_SERVICES, ...PHYSIO_SERVICES].map((service, index) => {
            const isLoopCopy = index >= PHYSIO_SERVICES.length;
            return (
              <li
                key={isLoopCopy ? `${service.id}-loop` : service.id}
                inert={isLoopCopy}
                className={cn(
                  "w-full shrink-0 snap-start",
                  "sm:w-[calc((100%-10px)/2)] md:w-[calc((100%-40px)/3)] lg:w-[calc((100%-90px)/4)]",
                )}
              >
                <DepartmentCard service={service} />
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* A 26px line box, as the reference's pagination has, centres the dots
          73px below the cards. */}
      <div className="mt-[50px] flex h-[26px] items-center justify-center gap-[8px]">
        {PHYSIO_SERVICES.map((service, index) => (
          <button
            key={service.id}
            type="button"
            aria-label={`Go to ${service.title}`}
            aria-current={index === activeIndex}
            onClick={() => goTo(index)}
            className={cn(
              "size-[10px] rounded-full transition-colors duration-300",
              index === activeIndex
                ? "bg-teal shadow-[0_0_8px_rgba(0,86,210,0.6)]"
                : "bg-[#bccfe9] hover:bg-teal/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}
