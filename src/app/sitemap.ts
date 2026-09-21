import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listPublishedPages } from "@/services/page.service";
import { listPublishedBlogSlugs } from "@/services/blog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    { url: `${siteConfig.url}/contact`, lastModified: new Date() },
  ];

  try {
    const [pages, posts] = await Promise.all([listPublishedPages(), listPublishedBlogSlugs()]);

    const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${siteConfig.url}/${page.slug}`,
      lastModified: page.updatedAt,
    }));

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    }));

    return [...staticRoutes, ...pageRoutes, ...blogRoutes];
  } catch (error) {
    console.error("Failed to build sitemap from database", error);
    return staticRoutes;
  }
}
