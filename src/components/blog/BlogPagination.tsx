import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The reference theme's `.post-grid-pagination`: 42px outlined squares with
 * the current page filled in the brand colour, bracketed by word buttons.
 *
 * Every link carries the active `?category` / `?tag` / `?q` through, so
 * paging never silently drops the filter the visitor is browsing under.
 */
type BlogPaginationProps = {
  page: number;
  pages: number;
  /** The current query minus `page` — filters to preserve across pages. */
  query?: Record<string, string | undefined>;
};

/** How many numbered links to show around the current page. */
const WINDOW = 5;

function hrefFor(page: number, query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));

  const search = params.toString();
  return search ? `/blog?${search}` : "/blog";
}

function windowFor(page: number, pages: number): number[] {
  const half = Math.floor(WINDOW / 2);
  const start = Math.max(1, Math.min(page - half, pages - WINDOW + 1));
  const end = Math.min(pages, start + WINDOW - 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * Shared geometry only. Colour lives on the two variants below, because
 * `cn` concatenates rather than de-duplicates — a base `bg-white` here would
 * still beat the current page's `bg-teal` in the stylesheet's own order.
 */
const CELL =
  "grid h-[36px] min-w-[36px] place-items-center rounded-[8px] border " +
  "px-[10px] text-[14px] font-medium transition-colors sm:h-[42px] sm:min-w-[42px] sm:text-[16px]";

const LINK = "border-rule bg-white text-navy hover:border-teal hover:bg-teal hover:text-white";

const CURRENT = "border-teal bg-teal text-white";

export function BlogPagination({ page, pages, query = {} }: BlogPaginationProps) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="Blog pagination" className="mt-[40px] flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-[6px] sm:gap-[10px]">
        {page > 1 && (
          <li>
            <Link
              href={hrefFor(page - 1, query)}
              rel="prev"
              className={cn(CELL, LINK, "px-[12px] sm:px-[20px]")}
            >
              Prev
            </Link>
          </li>
        )}

        {windowFor(page, pages).map((number) => {
          const isCurrent = number === page;

          return (
            <li key={number}>
              {isCurrent ? (
                <span aria-current="page" className={cn(CELL, CURRENT)}>
                  {number}
                </span>
              ) : (
                <Link
                  href={hrefFor(number, query)}
                  aria-label={`Page ${number}`}
                  className={cn(CELL, LINK)}
                >
                  {number}
                </Link>
              )}
            </li>
          );
        })}

        {page < pages && (
          <li>
            <Link
              href={hrefFor(page + 1, query)}
              rel="next"
              className={cn(CELL, LINK, "px-[12px] sm:px-[20px]")}
            >
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
