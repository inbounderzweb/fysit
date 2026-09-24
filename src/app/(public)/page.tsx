import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { About } from "@/components/sections/About";
import { Appointment } from "@/components/sections/Appointment";
import { Blog } from "@/components/sections/Blog";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { DarkBanner } from "@/components/sections/DarkBanner";
import { DepartmentStrip } from "@/components/sections/DepartmentStrip";
import { FeatureBand } from "@/components/sections/FeatureBand";
import { Hero } from "@/components/sections/Hero";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { PhysioHighlights } from "@/components/sections/PhysioHighlights";
import { PhysioServices } from "@/components/sections/PhysioServices";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { MARQUEE_EMERGENCY, MARQUEE_PRIMARY } from "@/lib/content";

export const metadata: Metadata = buildMetadata(
  { canonical: siteConfig.url },
  { title: siteConfig.name, description: siteConfig.description }
);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  },
];

/** Section order follows the Figma frame "1920w light" top to bottom. */
export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Hero />
      <PhysioHighlights />
      <About />
      <MarqueeBand words={MARQUEE_PRIMARY} />
      <Services />
      <PhysioServices />
      <DarkBanner />
      <DepartmentStrip />
      <Team />
      <MarqueeBand words={MARQUEE_EMERGENCY} speed={68} />
      <Appointment />
      <CaseStudies />
      <FeatureBand />
      <Testimonials />
      <Blog />
    </>
  );
}
