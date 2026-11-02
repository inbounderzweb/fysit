import "server-only";

import { cache } from "react";

import { LOCATIONS, NAV_ITEMS, type Location } from "@/lib/content";
import type { NavItem } from "@/lib/types";
import { listPublishedLocations } from "@/services/location.service";
import { asPopulatedMedia } from "@/types/media";

const imageUrl = (value: unknown) => asPopulatedMedia(value)?.secureUrl;

/**
 * The clinics shown on the website: those published under Admin → Locations,
 * in their admin order, or the built-in pair until any are published (or if
 * the database can't be reached). Cached per request, since the header and
 * the page both ask for it.
 */
export const getWebsiteLocations = cache(async (): Promise<Location[]> => {
  try {
    const items = await listPublishedLocations();
    if (items.length === 0) return LOCATIONS;

    return items.map((item) => {
      const street = item.address?.street ?? "";
      const area = item.address?.area ?? "";
      const city = item.address?.city ?? "";
      const title = (value?: { lead?: string | null; accent?: string | null } | null) => ({
        lead: value?.lead ?? "",
        accent: value?.accent ?? "",
      });
      const full = [street, area, city].filter(Boolean).join(", ");

      return {
        id: item._id.toString(),
        slug: item.slug,
        name: item.name,
        title: item.title,
        metaTitle: item.seo?.title || item.title,
        metaDescription: item.seo?.description || item.intro || `Physiotherapy at ${full}.`,
        eyebrow: item.eyebrow ?? "",
        heading: title(item.heading),
        intro: item.intro ?? "",
        address: { street, area, city, full },
        phone: item.phone ?? "",
        approach: {
          title: title(item.approach?.title),
          paragraphs: item.approach?.paragraphs ?? [],
          // Without an upload, a built-in clinic keeps its own photo.
          image:
            imageUrl(item.approach?.image) ??
            LOCATIONS.find((location) => location.slug === item.slug)?.approach.image ??
            "/images/case-physio.jpg",
        },
        services: {
          lead: item.services?.lead ?? "",
          accent: item.services?.accent ?? "",
          intro: item.services?.intro ?? "",
        },
        conditionsTitle: title(item.conditionsTitle),
        why: {
          title: title(item.why?.title),
          points: (item.why?.points ?? []).map((point) => ({ title: point.title ?? "", body: point.body ?? "" })),
        },
        corporate: { title: item.corporate?.title ?? "", paragraphs: item.corporate?.paragraphs ?? [] },
        faqTitle: title(item.faqTitle),
        faqs: item.faqs.map((faq) => ({ question: faq.question ?? "", answer: faq.answer ?? "" })),
        stats: item.stats.map((stat) => ({ value: stat.value ?? "", label: stat.label ?? "" })),
        serviceItems: item.serviceItems.map((service) => ({
          title: service.title ?? "",
          description: service.description ?? "",
          href: service.href || undefined,
        })),
        conditions: item.conditions,
        images: {
          banner: imageUrl(item.bannerImage),
          team: imageUrl(item.teamImage),
          corporate: imageUrl(item.corporateImage),
        },
      };
    });
  } catch (error) {
    console.error("Locations: falling back to built-in content", error);
    return LOCATIONS;
  }
});

/** The header menu, with the Locations dropdown listing the website's clinics. */
export async function getNavItems(): Promise<NavItem[]> {
  const locations = await getWebsiteLocations();
  return NAV_ITEMS.map((item) =>
    item.children
      ? {
          ...item,
          href: locations[0] ? `/${locations[0].slug}` : item.href,
          children: locations.map((location) => ({
            label: location.name,
            href: `/${location.slug}`,
            note: location.address.street,
          })),
        }
      : item
  );
}
