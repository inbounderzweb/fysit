import type { Metadata } from "next";

import { AboutDepartments } from "@/components/sections/AboutDepartments";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AboutMission } from "@/components/sections/AboutMission";
import { AboutTeam } from "@/components/sections/AboutTeam";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { PageBanner } from "@/components/ui/PageBanner";
import { siteConfig } from "@/config/site";
import { ABOUT, ABOUT_PAGE, MARQUEE_PRIMARY } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/about` },
  { title: ABOUT_PAGE.banner.title, description: ABOUT.body },
);

/** Section order follows the reference theme's About Us page top to bottom. */
export default function AboutPage() {
  return (
    <>
      <PageBanner
        title={ABOUT_PAGE.banner.title}
        crumbs={[{ label: ABOUT_PAGE.banner.title }]}
        image={ABOUT_PAGE.banner.image}
      />
      <AboutMission />
      <AboutIntro />
      <MarqueeBand words={MARQUEE_PRIMARY} size="fixed" />
      <AboutDepartments />
      <AboutTeam />
      <Testimonials headingSize="large" />
    </>
  );
}
