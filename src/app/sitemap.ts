import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listPublishedPages } from "@/services/page.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date() },
  ];

  try {
    const pages = await listPublishedPages();
    const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${siteConfig.url}/${page.slug}`,
      lastModified: page.updatedAt,
    }));
    return [...staticRoutes, ...pageRoutes];
  } catch (error) {
    console.error("Failed to build sitemap from database", error);
    return staticRoutes;
  }
}
