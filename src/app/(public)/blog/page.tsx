import type { Metadata } from "next";
import Link from "next/link";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/ui/PageBanner";
import { listPublishedBlogPosts } from "@/services/blog.service";
import { getCategoryBySlug, getTagBySlug } from "@/services/taxonomy.service";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { formatPostDate, toDateTimeAttr } from "@/lib/utils";
import { asPopulatedMedia } from "@/types/media";
import { asPopulatedAuthor, asPopulatedTerm } from "@/types/blog";

/** Three cards per row, three rows — the reference grid's page size. */
const POSTS_PER_PAGE = 9;

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/blog` },
  { title: "Blog", description: "Health, recovery, and wellness insights from The Fysit." }
);

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}) {
  const { page, category, tag, q } = await searchParams;

  const [result, activeCategory, activeTag] = await Promise.all([
    listPublishedBlogPosts({
      page,
      limit: POSTS_PER_PAGE,
      categorySlug: category,
      tagSlug: tag,
      search: q,
    }),
    category ? getCategoryBySlug(category) : null,
    tag ? getTagBySlug(tag) : null,
  ]);

  // The banner and the empty state both describe what the visitor is looking
  // at, so the filter is resolved to a label once here.
  const filterLabel = activeCategory?.name ?? activeTag?.name ?? (q ? `“${q}”` : null);
  const isFiltered = Boolean(category || tag || q);

  return (
    <>
      <PageBanner
        title={activeCategory?.name ?? activeTag?.name ?? "Blog"}
        crumbs={
          filterLabel && !q
            ? [{ label: "Blog", href: "/blog" }, { label: filterLabel }]
            : [{ label: "Blog" }]
        }
      />

      <section className="py-[70px] lg:py-[120px]">
        <Container>
          {isFiltered && (
            <Reveal className="mb-[40px] flex flex-wrap items-center gap-x-[15px] gap-y-2">
              <p className="text-[16px] leading-[26px] text-body">
                {result.total} {result.total === 1 ? "post" : "posts"}
                {q ? <> matching {filterLabel}</> : filterLabel ? <> in {filterLabel}</> : null}
              </p>
              <Link
                href="/blog"
                className="text-[14px] font-medium uppercase leading-[20px] text-teal-dark underline underline-offset-4 transition-colors hover:text-teal"
              >
                Clear filter
              </Link>
            </Reveal>
          )}

          {result.items.length === 0 ? (
            <Reveal className="rounded-[25px] border border-rule bg-white px-[25px] py-[60px] text-center sm:px-[35px]">
              <h2 className="text-[24px] leading-[34px] tracking-[-0.03rem] text-navy lg:text-[28px] lg:leading-[38px]">
                {isFiltered ? "No posts match that yet" : "No posts published yet"}
              </h2>
              <p className="mx-auto mt-[12px] max-w-[520px] text-[16px] leading-[26px] text-body">
                {isFiltered
                  ? "Try a different category, tag, or search term."
                  : "New health, recovery, and wellness articles will appear here."}
              </p>
            </Reveal>
          ) : (
            <StaggerGroup
              as="ul"
              className="grid list-none grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]"
            >
              {result.items.map((post) => {
                const image = asPopulatedMedia(post.featuredImage);
                const author = asPopulatedAuthor(post.author);

                return (
                  <StaggerItem as="li" key={post.slug} className="h-full">
                    <BlogCard
                      slug={post.slug}
                      title={post.title}
                      image={
                        image
                          ? { src: image.secureUrl, alt: image.altText ?? post.title }
                          : null
                      }
                      date={formatPostDate(post.publishedAt)}
                      dateTime={toDateTimeAttr(post.publishedAt)}
                      author={author?.name ?? null}
                      category={asPopulatedTerm(post.category)}
                    />
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          )}

          <BlogPagination
            page={result.page}
            pages={result.pages}
            query={{ category, tag, q }}
          />
        </Container>
      </section>
    </>
  );
}
