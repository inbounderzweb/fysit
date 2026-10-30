import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listPublishedPages } from "@/services/page.service";
import { listPublishedBlogSlugs } from "@/services/blog.service";
import { listPublishedServiceSlugs } from "@/services/service.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/services`, lastModified: new Date() },
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    { url: `${siteConfig.url}/contact`, lastModified: new Date() },
  ];

  try {
    const [pages, posts, services] = await Promise.all([
      listPublishedPages(),
      listPublishedBlogSlugs(),
      listPublishedServiceSlugs(),
    ]);

    const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${siteConfig.url}/${page.slug}`,
      lastModified: page.updatedAt,
    }));

    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    }));

    const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: service.updatedAt,
    }));

    return [...staticRoutes, ...pageRoutes, ...blogRoutes, ...serviceRoutes];
  } catch (error) {
    console.error("Failed to build sitemap from database", error);
    return staticRoutes;
  }
}
