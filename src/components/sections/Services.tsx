import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SERVICES, SERVICES_HEADING } from "@/lib/content";

/** Figma 1:144 … 1:231 — 3 × 2 grid, 420px cards on a 30px gutter. */
export function Services() {
  return (
    <section id="services" className="bg-white pb-[60px] pt-[70px] lg:pb-[110px] lg:pt-[130px]">
      <Container size="wide">
        <Reveal className="flex flex-col items-center text-center">
          <EyebrowPill>{SERVICES_HEADING.eyebrow}</EyebrowPill>
          <SectionHeading
            lead={SERVICES_HEADING.lead}
            accent={SERVICES_HEADING.accent}
            className="mt-[10px] max-w-[715px] text-center"
          />
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-[42px] grid list-none grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service, index) => (
            <StaggerItem as="li" key={service.id} className="h-full">
              <ServiceCard service={service} featured={index === 1} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
