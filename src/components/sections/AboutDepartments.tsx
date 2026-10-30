import { AboutDepartmentsCarousel } from "@/components/sections/AboutDepartmentsCarousel";
import { PHYSIO_SERVICES } from "@/lib/content";
import { getServiceSummaries } from "@/lib/services-public";

/**
 * The About page's "Our Department" carousel. Shows the published services
 * from Admin → Services, each card linking to its own page, and falls back to
 * the built-in cards until any are published.
 */
export async function AboutDepartments() {
  const services = await getServiceSummaries();
  return <AboutDepartmentsCarousel services={services.length > 0 ? services : PHYSIO_SERVICES} />;
}
