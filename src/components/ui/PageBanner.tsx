import Image from "next/image";
import Link from "next/link";

import { EdgeNotch } from "@/components/ui/EdgeNotch";
import { cn } from "@/lib/utils";

/**
 * The reference theme's `.page-title` band: a photo darkened by a three-stop
 * gradient stack, the page heading over it, and a white breadcrumb tab
 * notched into the foot of the band so it reads as part of the page below.
 *
 * The band carries its own top padding rather than relying on a spacer,
 * because the site header is an absolute overlay (components/layout/Header)
 * and has to have room to sit inside it.
 */
type Crumb = {
  label: string;
  /** Omit on the current page — it renders as plain text. */
  href?: string;
};

type PageBannerProps = {
  title: string;
  /** Everything after "Home", which is always prepended. */
  crumbs: Crumb[];
  image?: string;
  /** Decorative by default; the heading already names the page. */
  imageAlt?: string;
  /**
   * Replaces the default 40/50px → 60/70px title scale rather than layering
   * over it — two font sizes in the same CSS layer would not reliably resolve.
   * Pass a full size/leading set when a long title needs a smaller one.
   */
  titleClassName?: string;
};

/**
 * Sampled from the reference band: three stacked gradients over the photo.
 * `#001a1e` is the same ink the design tokens already carry.
 */
const SCRIM =
  "linear-gradient(274deg, #001a1e00 38%, #001a1e8a 70%, #001a1e), " +
  "linear-gradient(1deg, #001a1e00 55%, #001a1e33 83%, #001a1eb5), " +
  "linear-gradient(#001a1e00 47%, #001a1e33)";

export function PageBanner({
  title,
  crumbs,
  image = "/images/banner-care.jpg",
  imageAlt = "",
  titleClassName,
}: PageBannerProps) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];

  return (
    <section className="relative overflow-hidden rounded-b-[30px] bg-ink">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        loading="eager"
        className="object-cover object-[center_top_10%]"
      />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SCRIM }} />

      {/* The reference's container: 1320px with a 12px gutter at desktop, so
          the title sits 192px in on a 1680px screen; wider gutters below. */}
      <div className="relative mx-auto w-full max-w-[1320px] px-[42px] md:px-[36px] xl:px-[12px]">
        <div className="max-w-[660px] pt-[180px] md:pt-[220px]">
          <h1
            className={cn(
              "text-balance font-medium tracking-[-0.05em] text-white",
              titleClassName ?? "text-[40px] leading-[50px] md:text-[60px] md:leading-[70px]",
            )}
          >
            {title}
          </h1>

          <nav
            aria-label="Breadcrumb"
            className="relative mt-[60px] inline-flex rounded-t-[15px] bg-white px-[15px] pb-[10px] pt-[15px] md:mt-[100px]"
          >
            {/* Folds the tab's white into the page body behind the band. */}
            <EdgeNotch corner="tl" className="absolute -left-5 bottom-0" />
            <EdgeNotch corner="tr" className="absolute -right-5 bottom-0" />

            <ol className="flex flex-wrap items-center gap-x-[10px] gap-y-1">
              {trail.map((crumb, index) => {
                const isLast = index === trail.length - 1;

                return (
                  <li
                    key={`${crumb.label}-${index}`}
                    className="flex items-center gap-x-[10px] text-[12px] font-semibold uppercase leading-[12px] tracking-[1px] text-navy"
                  >
                    {index > 0 && (
                      <span aria-hidden className="text-navy/40">
                        /
                      </span>
                    )}

                    {index === 0 && (
                      <span
                        aria-hidden
                        className="grid size-[26px] shrink-0 place-items-center rounded-[5px] bg-teal"
                      >
                        <svg viewBox="0 0 16 16" className="size-[14px] fill-white">
                          <path d="M8 1.5 1 6.6V14a.5.5 0 0 0 .5.5H6V10h4v4.5h4.5A.5.5 0 0 0 15 14V6.6L8 1.5Z" />
                        </svg>
                      </span>
                    )}

                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="transition-colors hover:text-teal">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? "page" : undefined}
                        className="max-w-[180px] truncate sm:max-w-[360px]"
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
