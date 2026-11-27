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
import { MARQUEE_EMERGENCY, MARQUEE_PRIMARY, SITE } from "@/lib/content";
import { getHeroMedia } from "@/lib/hero-public";
import { AboutTeam } from "@/components/sections/AboutTeam";

const HOME_TITLE = `${siteConfig.name} | Physiotherapy Clinic in Bangalore`;

const baseMetadata = buildMetadata(
  { canonical: siteConfig.url },
  { title: HOME_TITLE, description: siteConfig.description }
);

// `absolute` skips the layout's "%s | The Fysit" template, which would
// otherwise repeat the brand name.
export const metadata: Metadata = { ...baseMetadata, title: { absolute: HOME_TITLE } };

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    image: `${siteConfig.url}${siteConfig.defaultOgImage}`,
    description: siteConfig.description,
    telephone: SITE.phone,
    email: SITE.email,
    medicalSpecialty: "Physiotherapy",
    areaServed: { "@type": "City", name: "Bangalore" },
    sameAs: siteConfig.socialProfiles,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  },
];

/** Section order follows the Figma frame "1920w light" top to bottom. */
export default async function HomePage() {
  const heroMedia = await getHeroMedia();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Hero media={heroMedia} />
      {/* <PhysioHighlights /> */}
      <About />
      <MarqueeBand words={MARQUEE_PRIMARY} />
      <PhysioHighlights />
      {/* <Services /> */}
      <PhysioServices />
      <DarkBanner />
      <DepartmentStrip />
      {/* <Team /> */}
      <AboutTeam/>
      <MarqueeBand words={MARQUEE_EMERGENCY} speed={68} />
      <Appointment />
      {/* <CaseStudies /> */}
      <FeatureBand />
      <Testimonials />
      <Blog />
    </>
  );
}
