import { About } from "@/components/sections/About";
import { Appointment } from "@/components/sections/Appointment";
import { Blog } from "@/components/sections/Blog";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { DarkBanner } from "@/components/sections/DarkBanner";
import { DepartmentStrip } from "@/components/sections/DepartmentStrip";
import { FeatureBand } from "@/components/sections/FeatureBand";
import { Hero } from "@/components/sections/Hero";
import { MarqueeBand } from "@/components/sections/MarqueeBand";
import { Services } from "@/components/sections/Services";
import { Team } from "@/components/sections/Team";
import { Testimonials } from "@/components/sections/Testimonials";
import { MARQUEE_EMERGENCY, MARQUEE_PRIMARY } from "@/lib/content";

/** Section order follows the Figma frame "1920w light" top to bottom. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <MarqueeBand words={MARQUEE_PRIMARY} />
      <Services />
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
