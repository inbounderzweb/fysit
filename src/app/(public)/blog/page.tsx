import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listPublishedBlogPosts } from "@/services/blog.service";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { asPopulatedMedia } from "@/types/media";

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/blog` },
  { title: "Blog", description: "Health, recovery, and wellness insights from The Fysit." }
);

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const result = await listPublishedBlogPosts({ page });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold text-neutral-900">Blog</h1>

      {result.items.length === 0 && <p className="text-neutral-500">No posts published yet.</p>}

      <div className="grid gap-8 sm:grid-cols-2">
        {result.items.map((post) => {
          const image = asPopulatedMedia(post.featuredImage);

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 hover:border-neutral-300"
            >
              {image && (
                <Image
                  src={image.secureUrl}
                  alt={image.altText ?? post.title}
                  width={480}
                  height={270}
                  className="aspect-video w-full rounded-lg object-cover"
                />
              )}
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-neutral-900">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-neutral-600">{post.excerpt}</p>}
                <p className="text-xs text-neutral-400">
                  {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()} · {post.readingTime} min read
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Page {result.page} of {result.pages}
        </span>
        <div className="flex gap-2">
          {result.page > 1 && (
            <Link href={`/blog?page=${result.page - 1}`} className="underline">
              Previous
            </Link>
          )}
          {result.page < result.pages && (
            <Link href={`/blog?page=${result.page + 1}`} className="underline">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
