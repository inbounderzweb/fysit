import Image from "next/image";
import Link from "next/link";

import { EdgeNotch } from "@/components/ui/EdgeNotch";
import { cn } from "@/lib/utils";
import type { PopulatedTerm } from "@/types/blog";

/**
 * The reference theme's `.post-card.style-1`: a 25px-radius outlined card
 * whose 20px-radius image carries the publish date on a tab notched into its
 * foot, over a title and an author / category footer.
 *
 * The same shape already appears on the home page (sections/Blog.tsx), which
 * renders the Figma copy; this one is the database-backed version used by
 * /blog.
 */
type BlogCardProps = {
  slug: string;
  title: string;
  image: { src: string; alt: string } | null;
  /** Pre-formatted for display — see `formatPostDate`. */
  date: string | null;
  dateTime?: string;
  author: string | null;
  category: PopulatedTerm | null;
  className?: string;
};

export function BlogCard({
  slug,
  title,
  image,
  date,
  dateTime,
  author,
  category,
  className,
}: BlogCardProps) {
  const href = `/blog/${slug}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-[25px] border border-rule bg-white",
        "transition-shadow duration-300 hover:shadow-card",
        className,
      )}
    >
      <div className="relative">
        {image ? (
          <Link
            href={href}
            tabIndex={-1}
            aria-hidden
            className="block overflow-hidden rounded-[20px]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={700}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
              className="aspect-[700/600] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </Link>
        ) : (
          <div aria-hidden className="aspect-[700/600] w-full rounded-[20px] bg-surface" />
        )}

        {date && (
          <p className="absolute bottom-0 left-[30px] rounded-t-[20px] bg-white px-[24px] pb-[4px] pt-[7px] text-[13px] font-medium uppercase leading-[20px] text-navy sm:left-[50px] sm:text-[14px]">
            <EdgeNotch corner="tl" className="absolute -left-5 bottom-0" />
            <EdgeNotch corner="tr" className="absolute -right-5 bottom-0" />
            <time dateTime={dateTime}>{date}</time>
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col px-[25px] pb-[30px] pt-[28px] sm:px-[35px]">
        <h3 className="text-[24px] leading-[34px] tracking-[-0.04em] text-navy lg:text-[28px] lg:leading-[38px]">
          <Link href={href} className="transition-colors hover:text-teal">
            {title}
          </Link>
        </h3>

        {(author || category) && (
          <div className="mt-auto flex flex-wrap items-center gap-x-[15px] gap-y-[10px] pt-[20px] text-[12px] font-medium uppercase leading-[20px] text-navy">
            {author && <span>{author}</span>}
            {category && (
              <Link
                href={`/blog?category=${encodeURIComponent(category.slug)}`}
                className="rounded-full border border-[#e3e3e2] px-[16px] py-[7px] transition-colors hover:border-teal hover:bg-teal hover:text-white"
              >
                {category.name}
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
