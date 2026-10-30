import type { Metadata } from "next";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { WordRevealHeading } from "@/components/animations/WordRevealHeading";
import { Appointment } from "@/components/sections/Appointment";
import { DepartmentCard } from "@/components/sections/AboutDepartments";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { PageBanner } from "@/components/ui/PageBanner";
import { siteConfig } from "@/config/site";
import { MARQUEE_PRIMARY, SERVICES_PAGE, SITE } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getServiceSummaries } from "@/lib/services-public";

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/services` },
  {
    title: "Our Services",
    description:
      "Clinical physiotherapy, doorstep physiotherapy and workplace wellness programmes from The Fysit in Bangalore.",
  }
);

/**
 * /services — the published services from Admin → Services as the About
 * page's department cards, under an editorial intro, then the marquee and
 * booking band the home page already uses.
 */
export default async function ServicesPage() {
  const services = await getServiceSummaries();
  const { intro, empty } = SERVICES_PAGE;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Our Services",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `${siteConfig.url}${service.href}`,
    })),
  };

  return (
    <>
      {services.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <PageBanner
        title={SERVICES_PAGE.banner.title}
        crumbs={[{ label: SERVICES_PAGE.banner.title }]}
        image={SERVICES_PAGE.banner.image}
      />

      <section className="bg-white py-[80px] lg:py-[120px]">
        <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-[10px]">
          {/* Intro — heading on the left, the pitch and a count hung off its foot. */}
          <div className="grid gap-[30px] lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-[60px]">
            <div>
              <Reveal className="flex">
                <EyebrowPill className="mb-[10px]">{intro.eyebrow}</EyebrowPill>
              </Reveal>
              <WordRevealHeading lead={intro.lead} accent={intro.accent} />
            </div>
            <Reveal delay={0.1} className="lg:pb-[8px]">
              <p className="text-[16px] leading-[26px] text-body md:text-[17px] md:leading-[28px]">{intro.body}</p>
              {services.length > 0 && (
                <p className="mt-[20px] flex items-baseline gap-[10px] border-t border-rule pt-[20px] text-navy">
                  <span className="text-[44px] leading-none tracking-[-0.05em]">
                    {String(services.length).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] font-medium uppercase tracking-[1.4px] text-body">
                    {services.length === 1 ? "Specialised service" : "Specialised services"}
                  </span>
                </p>
              )}
            </Reveal>
          </div>

          {services.length === 0 ? (
            <Reveal className="mt-[60px] rounded-[25px] border border-rule bg-white px-[25px] py-[60px] text-center sm:px-[35px]">
              <h2 className="text-[24px] leading-[34px] tracking-[-0.03rem] text-navy lg:text-[28px] lg:leading-[38px]">
                {empty.title}
              </h2>
              <p className="mx-auto mt-[12px] max-w-[520px] text-[16px] leading-[26px] text-body">{empty.body}</p>
              <div className="mt-[30px] flex flex-wrap justify-center gap-[15px]">
                <ArrowButton href="/contact" label="Book an Appointment" />
                <ArrowButton href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`} label={SITE.phone} variant="dark" />
              </div>
            </Reveal>
          ) : (
            <StaggerGroup
              as="ul"
              className="mt-[70px] grid list-none grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:mt-[90px] lg:grid-cols-3"
            >
              {services.map((service) => (
                <StaggerItem as="li" key={service.id} className="h-full">
                  <DepartmentCard service={service} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      <MarqueeBand words={MARQUEE_PRIMARY} size="fixed" />
      <Appointment />
    </>
  );
}
