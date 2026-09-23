import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { asPopulatedMedia } from "@/types/media";
import type { TermWithCount } from "@/types/blog";
import { formatPostDate } from "@/lib/utils";

/**
 * The reference theme's `.themeht-sidebar`: search, recent articles,
 * categories and a tag cloud, each in a soft-shadowed 8px card under a
 * pinned heading.
 *
 * Widgets with nothing to show are skipped rather than rendered empty —
 * categories and tags are optional on a post, so a site that has not used
 * them yet gets a shorter sidebar instead of empty boxes.
 */
type RecentPost = {
  slug: string;
  title: string;
  publishedAt?: Date | null;
  featuredImage?: unknown;
};

type BlogSidebarProps = {
  recent: RecentPost[];
  categories: TermWithCount[];
  tags: TermWithCount[];
  /** Pre-fills the search box when the visitor arrived from it. */
  search?: string;
  className?: string;
};

function Widget({
  title,
  children,
  labelledBy,
}: {
  title?: string;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="rounded-[8px] border border-[#f0f0f5] bg-white p-[25px] shadow-[0_0_8px_0_rgba(240,240,245,0.5)] sm:p-[30px]"
    >
      {title && (
        <h2
          id={labelledBy}
          className="relative mb-[25px] pl-[30px] text-[22px] font-normal leading-[32px] tracking-[-0.03rem] text-navy sm:text-[24px] sm:leading-[34px]"
        >
          <span aria-hidden className="absolute bottom-[4px] left-0 text-[18px] leading-none">
            📌
          </span>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function BlogSidebar({
  recent,
  categories,
  tags,
  search,
  className,
}: BlogSidebarProps) {
  return (
    <aside
      aria-label="Blog sidebar"
      className={cn("flex flex-col gap-[30px] lg:gap-[50px] lg:pl-[50px]", className)}
    >
      {/* Search — a plain GET form, so it works with JavaScript disabled. */}
      <Widget>
        <form action="/blog" className="relative">
          <label htmlFor="blog-search" className="sr-only">
            Search the blog
          </label>
          <input
            id="blog-search"
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search Here"
            className="h-[50px] w-full rounded-[8px] border border-rule bg-white pl-[16px] pr-[60px] text-[15px] leading-[22px] text-navy transition-colors placeholder:text-body/60 focus:border-teal focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 grid size-[50px] place-items-center rounded-r-[8px] bg-teal text-white transition-colors hover:bg-teal-dark"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-[18px] fill-current">
              <path d="M11.74 10.34a6 6 0 1 0-1.4 1.4l3.2 3.2a1 1 0 0 0 1.4-1.4l-3.2-3.2ZM6.5 10.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </form>
      </Widget>

      {recent.length > 0 && (
        <Widget title="Recent Articles" labelledBy="widget-recent">
          <ul className="flex flex-col gap-[15px]">
            {recent.map((post) => {
              const image = asPopulatedMedia(post.featuredImage);
              const date = formatPostDate(post.publishedAt, "short");

              return (
                <li key={post.slug} className="flex items-center gap-[15px]">
                  {image ? (
                    <Image
                      src={image.secureUrl}
                      alt={image.altText ?? post.title}
                      width={70}
                      height={70}
                      sizes="70px"
                      className="size-[70px] shrink-0 rounded-[6px] object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="size-[70px] shrink-0 rounded-[6px] bg-surface"
                    />
                  )}

                  <div className="min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 text-[15px] font-medium leading-[22px] text-navy transition-colors hover:text-teal"
                    >
                      {post.title}
                    </Link>
                    {date && (
                      <span className="mt-[4px] block text-[13px] leading-[20px] text-body">
                        {date}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Widget>
      )}

      {categories.length > 0 && (
        <Widget title="Categories" labelledBy="widget-categories">
          <ul>
            {categories.map((category, index) => (
              <li
                key={category.slug}
                className={cn(
                  "relative pl-[25px] text-[14px] leading-[22px] text-body",
                  index < categories.length - 1 &&
                    "mb-[12px] border-b border-dashed border-rule pb-[8px]",
                )}
              >
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden
                  className="absolute left-0 top-[4px] size-[14px] fill-teal"
                >
                  <path d="M6 3.5 10.5 8 6 12.5 4.6 11.1 7.7 8 4.6 4.9 6 3.5Z" />
                </svg>
                <Link
                  href={`/blog?category=${encodeURIComponent(category.slug)}`}
                  className="text-[15px] font-medium leading-[22px] text-navy transition-colors hover:text-teal"
                >
                  {category.name}
                </Link>{" "}
                ({category.count})
              </li>
            ))}
          </ul>
        </Widget>
      )}

      {tags.length > 0 && (
        <Widget title="Popular Tag" labelledBy="widget-tags">
          <div className="flex flex-wrap gap-[7px]">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                className="rounded-full border border-rule px-[15px] py-[5px] text-[13px] font-medium leading-[20px] text-navy transition-colors hover:border-teal hover:bg-teal hover:text-white"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </Widget>
      )}
    </aside>
  );
}
