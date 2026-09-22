import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { PostNavigation } from "@/components/blog/PostNavigation";
import { Container } from "@/components/ui/Container";
import { PageBanner } from "@/components/ui/PageBanner";
import {
  getAdjacentBlogPosts,
  getPublishedBlogPostBySlug,
  listRecentPublishedBlogPosts,
} from "@/services/blog.service";
import { listBlogCategories, listBlogTags } from "@/services/taxonomy.service";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { formatPostDate, toDateTimeAttr } from "@/lib/utils";
import { asPopulatedMedia } from "@/types/media";
import { asPopulatedAuthor, asPopulatedTerm, asPopulatedTerms } from "@/types/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};

  return buildMetadata(
    { ...post.seo, canonical: post.seo?.canonical || `${siteConfig.url}/blog/${post.slug}` },
    { title: post.title, description: post.excerpt ?? undefined }
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [adjacent, recent, categories, tags] = await Promise.all([
    getAdjacentBlogPosts(post),
    listRecentPublishedBlogPosts(3, post.slug),
    listBlogCategories(),
    listBlogTags(),
  ]);

  const image = asPopulatedMedia(post.featuredImage);
  const author = asPopulatedAuthor(post.author);
  const category = asPopulatedTerm(post.category);
  const postTags = asPopulatedTerms(post.tags);
  const publishedOn = formatPostDate(post.publishedAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: image?.secureUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: author ? { "@type": "Person", name: author.name } : undefined,
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  // The reference lays the meta row out as `author / date / category`, each
  // item separated by a slash and the row closed by a rule.
  const meta: React.ReactNode[] = [];
  if (author) meta.push(author.name);
  if (publishedOn) {
    meta.push(<time dateTime={toDateTimeAttr(post.publishedAt)}>{publishedOn}</time>);
  }
  if (post.readingTime) meta.push(`${post.readingTime} min read`);
  if (category) {
    meta.push(
      <Link
        href={`/blog?category=${encodeURIComponent(category.slug)}`}
        className="transition-colors hover:text-teal"
      >
        {category.name}
      </Link>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageBanner
        title={post.title}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        titleClassName="text-[32px] leading-[42px] sm:text-[40px] sm:leading-[50px] lg:text-[60px] lg:leading-[70px]"
      />

      <section className="py-[70px] lg:py-[120px]">
        <Container>
          <div className="grid gap-[50px] lg:grid-cols-[2fr_1fr] lg:gap-0">
            <article>
              {image && (
                <Image
                  src={image.secureUrl}
                  alt={image.altText ?? post.title}
                  width={image.width ?? 1200}
                  height={image.height ?? 675}
                  sizes="(max-width: 1024px) 100vw, 840px"
                  loading="eager"
                  className="h-auto w-full rounded-[20px] object-cover"
                />
              )}

              <div className={image ? "pt-[40px] lg:pt-[50px]" : undefined}>
                {meta.length > 0 && (
                  <ul className="mb-[30px] flex flex-wrap items-center gap-x-[30px] gap-y-[10px] border-b border-rule pb-[30px] text-[14px] font-medium uppercase leading-[20px] text-navy">
                    {meta.map((item, index) => (
                      <li
                        key={index}
                        className={
                          index < meta.length - 1
                            ? "relative after:absolute after:-right-[18px] after:top-0 after:text-navy/40 after:content-['/']"
                            : undefined
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Content is authored exclusively by authenticated admins with
                    blog permissions via the Tiptap editor — not public user
                    input — so rendering the stored HTML directly is safe here. */}
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.content }} />

                {postTags.length > 0 && (
                  <div className="mt-[40px] flex flex-wrap items-center gap-[8px]">
                    <span className="mr-[7px] text-[14px] font-medium uppercase leading-[22px] text-navy">
                      Tags:
                    </span>
                    {postTags.map((tag) => (
                      <Link
                        key={tag.slug}
                        href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                        className="rounded-full border border-rule px-[15px] py-[5px] text-[14px] font-medium leading-[22px] text-navy transition-colors hover:border-teal hover:bg-teal hover:text-white"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <PostNavigation
                previous={adjacent.previous ? { slug: adjacent.previous.slug, title: adjacent.previous.title } : null}
                next={adjacent.next ? { slug: adjacent.next.slug, title: adjacent.next.title } : null}
              />
            </article>

            <BlogSidebar recent={recent} categories={categories} tags={tags} />
          </div>
        </Container>
      </section>
    </>
  );
}
