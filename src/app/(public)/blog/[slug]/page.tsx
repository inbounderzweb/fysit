import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedBlogPostBySlug } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { asPopulatedMedia } from "@/types/media";

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

  const image = asPopulatedMedia(post.featuredImage);
  const author =
    post.author && typeof post.author === "object" && "name" in post.author
      ? (post.author as { name: string })
      : null;

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

  return (
    <article className="flex flex-col gap-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-neutral-900">{post.title}</h1>
        <p className="text-sm text-neutral-500">
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
          {author && <> · By {author.name}</>}
          {post.readingTime && <> · {post.readingTime} min read</>}
        </p>
      </header>

      {image && (
        <Image
          src={image.secureUrl}
          alt={image.altText ?? post.title}
          width={900}
          height={506}
          className="w-full rounded-xl object-cover"
          priority
        />
      )}

      {/* Content is authored exclusively by authenticated admins with blog
          permissions via the Tiptap editor — not public user input — so
          rendering the stored HTML directly is safe here. */}
      <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
