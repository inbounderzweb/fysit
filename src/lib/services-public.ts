import "server-only";

import { listPublishedServices } from "@/services/service.service";
import { DEFAULT_SERVICE_ICON } from "@/lib/service-icons";
import { asPopulatedMedia } from "@/types/media";
import type { PhysioService } from "@/lib/types";

/** Physiotherapy photos that stand in for a service saved without a cover image. */
const PLACEHOLDER_IMAGES = [
  "/images/service-slide-manual-therapy.jpg",
  "/images/service-slide-exercise-therapy.jpg",
  "/images/case-physio.jpg",
  "/images/service-slide-back-neck.jpg",
  "/images/case-therapy-facility.jpg",
  "/images/service-slide-sports-injury.jpg",
  "/images/service-slide-knee-pain.jpg",
  "/images/service-slide-foot-ankle.jpg",
];

/**
 * Placeholders go by the service's position in the list, so up to eight
 * services all get different photos; the detail page reuses its card's.
 */
function placeholderImage(index: number): string {
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
}

export const SERVICE_FALLBACK_IMAGE = PLACEHOLDER_IMAGES[0];

export type ServiceSummary = PhysioService & { slug: string };

/**
 * Published services from Admin → Services, in their admin order, shaped for
 * the existing service card (`DepartmentCard`). An unreachable database reads
 * as "no services" so the page still renders its empty state.
 */
export async function getServiceSummaries(): Promise<ServiceSummary[]> {
  try {
    const items = await listPublishedServices();
    return items.map((item, index) => ({
      id: item._id.toString(),
      slug: item.slug,
      title: item.name,
      description: item.shortDescription,
      image: asPopulatedMedia(item.image)?.secureUrl ?? placeholderImage(index),
      icon: item.icon || DEFAULT_SERVICE_ICON,
      href: `/services/${item.slug}`,
    }));
  } catch (error) {
    console.error("Services: could not load published services", error);
    return [];
  }
}
