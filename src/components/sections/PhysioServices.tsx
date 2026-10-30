import { PhysioServicesCarousel } from "@/components/sections/PhysioServicesCarousel";
import { PHYSIO_SERVICES } from "@/lib/content";
import { getServiceSummaries } from "@/lib/services-public";

/**
 * The home page's "Conditions We Treat" carousel. Shows the published
 * services from Admin → Services, each card linking to its own page, and
 * falls back to the built-in cards until any are published.
 */
export async function PhysioServices() {
  const services = await getServiceSummaries();
  return <PhysioServicesCarousel services={services.length > 0 ? services : PHYSIO_SERVICES} />;
}
