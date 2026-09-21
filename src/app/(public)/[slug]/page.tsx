import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPageBySlug } from "@/services/page.service";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) return {};

  return buildMetadata(
    { ...page.seo, canonical: page.seo?.canonical || `${siteConfig.url}/${page.slug}` },
    { title: page.title, description: page.excerpt ?? undefined }
  );
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-900">{page.title}</h1>

      {/* Content is authored exclusively by authenticated admins with pages
          permissions, not public user input, so rendering the stored HTML
          directly is safe here. */}
      <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
