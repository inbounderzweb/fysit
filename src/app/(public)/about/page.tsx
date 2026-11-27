import type { Metadata } from "next";

import { AboutDepartments } from "@/components/sections/AboutDepartments";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutMission } from "@/components/sections/AboutMission";
import { AboutTeam } from "@/components/sections/AboutTeam";
import { AboutVisionMission } from "@/components/sections/AboutVisionMission";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageBanner } from "@/components/ui/PageBanner";
import { siteConfig } from "@/config/site";
import { ABOUT, ABOUT_PAGE, MARQUEE_PRIMARY } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/about` },
  {
    title: "About Us — Physiotherapy Clinic in Bangalore",
    description:
      "Meet The Fysit: personalised, evidence-based physiotherapy in Bangalore for pain relief, injury rehabilitation, home visits and corporate wellness.",
  },
);

const jsonLd = [
  breadcrumbJsonLd([{ name: ABOUT_PAGE.banner.title, path: "/about" }]),
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${siteConfig.url}/about`,
    name: ABOUT_PAGE.banner.title,
    description: ABOUT.body,
    about: { "@id": `${siteConfig.url}/#organization` },
  },
];

/** Section order follows the reference theme's About Us page top to bottom. */
export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageBanner
        title={ABOUT_PAGE.banner.title}
        crumbs={[{ label: ABOUT_PAGE.banner.title }]}
        image={ABOUT_PAGE.banner.image}
      />
      <AboutMission />
      <AboutIntro />
      <AboutVisionMission />
      <MarqueeBand words={MARQUEE_PRIMARY} size="fixed" />
      <AboutDepartments />
      <AboutTeam />
      <Testimonials headingSize="large" />
    </>
  );
}
