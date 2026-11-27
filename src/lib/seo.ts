import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** schema.org BreadcrumbList for a page one or more levels below Home. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}

export type SeoFields = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  keywords?: string[] | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  robots?: string | null;
};

/**
 * Maps a content entity's `seo` subdocument (plus sensible fallbacks) to a
 * Next.js Metadata object. Every indexable public page should build its
 * `generateMetadata()` return value through this function so titles,
 * canonicals, and OG tags stay consistent across the site.
 */
export function buildMetadata(fields: SeoFields, fallback: { title: string; description?: string }): Metadata {
  const title = fields.title || fallback.title;
  const description = fields.description || fallback.description;
  const canonical = fields.canonical || undefined;
  const ogImage = fields.ogImage || siteConfig.defaultOgImage;

  return {
    title,
    description,
    keywords: fields.keywords ?? undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: fields.robots ?? undefined,
    // A page-level `openGraph` replaces the layout's block wholesale rather
    // than merging into it, so type, locale and url are restated here or
    // every page would lose them.
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      title: fields.ogTitle || title,
      description: fields.ogDescription || description,
      images: ogImage ? [{ url: ogImage, alt: fields.ogTitle || title }] : undefined,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: fields.ogTitle || title,
      description: fields.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
