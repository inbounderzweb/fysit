import Link from "next/link";

/**
 * The reference theme's `.post-navigation`: an eyebrow with a filled circular
 * arrow, over the neighbouring post's title. Previous sits left, next sits
 * right; the two stack on narrow screens.
 */
type Neighbour = { slug: string; title: string } | null;

type PostNavigationProps = {
  previous: Neighbour;
  next: Neighbour;
};

function Arrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <span
      aria-hidden
      className="absolute top-0 grid size-[40px] place-items-center rounded-full bg-teal text-white transition-colors group-hover:bg-teal-dark"
      style={direction === "prev" ? { left: 0 } : { right: 0 }}
    >
      <svg
        viewBox="0 0 16 16"
        className={`size-[18px] fill-current ${direction === "prev" ? "rotate-180" : ""}`}
      >
        <path d="M8.8 2.8 7.4 4.2 10.2 7H2.5v2h7.7l-2.8 2.8 1.4 1.4L14 8 8.8 2.8Z" />
      </svg>
    </span>
  );
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="More posts"
      className="mt-[60px] grid gap-[30px] border-t border-rule pt-[40px] sm:grid-cols-2"
    >
      {previous ? (
        <Link href={`/blog/${previous.slug}`} rel="prev" className="group relative block pl-[50px]">
          <Arrow direction="prev" />
          <span className="text-[14px] font-semibold uppercase leading-[30px] tracking-[0.5px] text-body">
            Previous
          </span>
          <span className="mt-[6px] block text-[18px] font-medium leading-[26px] text-navy transition-colors group-hover:text-teal lg:text-[20px] lg:leading-[28px]">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}

      {next && (
        <Link
          href={`/blog/${next.slug}`}
          rel="next"
          className="group relative block pr-[50px] sm:text-right"
        >
          <Arrow direction="next" />
          <span className="text-[14px] font-semibold uppercase leading-[30px] tracking-[0.5px] text-body">
            Next
          </span>
          <span className="mt-[6px] block text-[18px] font-medium leading-[26px] text-navy transition-colors group-hover:text-teal lg:text-[20px] lg:leading-[28px]">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
