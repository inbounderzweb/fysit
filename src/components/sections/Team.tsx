import Image from "next/image";
import Link from "next/link";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DOCTORS, TEAM_HEADING } from "@/lib/content";

const SOCIALS = [
  { label: "Facebook", href: "#", icon: "/icons/social-facebook.svg" },
  { label: "X", href: "#", icon: "/icons/social-twitter.svg" },
  { label: "WhatsApp", href: "#", icon: "/icons/social-whatsapp.svg" },
];

/**
 * Figma 1:371 … 1:412 — three 413px cards on a 30px gutter. Each photo is
 * square with a 66 × 59 badge notched into its lower-right corner.
 */
export function Team() {
  return (
    <section id="team" className="bg-white pb-[50px] pt-[70px] lg:pb-[90px] lg:pt-[130px]">
      <Container>
        <Reveal className="flex flex-col items-center text-center">
          <EyebrowPill>{TEAM_HEADING.eyebrow}</EyebrowPill>
          <SectionHeading
            lead={TEAM_HEADING.lead}
            accent={TEAM_HEADING.accent}
            className="mt-[10px] max-w-[715px] text-center"
          />
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-[41px] grid list-none grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {DOCTORS.map((doctor) => (
            <StaggerItem as="li" key={doctor.id}>
              <article className="group">
                <div className="relative overflow-hidden rounded-[20px]">
                  <Image
                    src={doctor.image}
                    alt={`Portrait of ${doctor.name}`}
                    width={413}
                    height={413}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 413px"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* Share tab — Figma 1:385; the live build reveals the
                      social links on hover (`team-share-icon`). */}
                  <span className="absolute bottom-0 right-0 flex items-end rounded-tl-[20px] bg-white">
                    <span className="flex max-w-0 items-center gap-3 overflow-hidden transition-all duration-500 group-hover:max-w-[120px] group-hover:pl-4">
                      {SOCIALS.map((social) => (
                        <Link
                          key={social.label}
                          href={social.href}
                          aria-label={`${doctor.name} on ${social.label}`}
                          className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
                        >
                          <Image
                            src={social.icon}
                            alt=""
                            width={16}
                            height={16}
                            unoptimized
                          />
                        </Link>
                      ))}
                    </span>
                    <span className="grid h-[59px] w-[66px] shrink-0 place-items-center">
                      <Image
                        src="/icons/share.svg"
                        alt=""
                        width={22}
                        height={22}
                        className="transition-transform duration-500 group-hover:rotate-90"
                        unoptimized
                      />
                    </span>
                  </span>
                </div>

                <h3 className="mt-[19px] text-[28px] leading-[40px] tracking-[-1.12px] text-navy">
                  <Link
                    href={doctor.href}
                    className="transition-colors hover:text-teal"
                  >
                    {doctor.name}
                  </Link>
                </h3>
                <p className="text-[16px] leading-[22px] text-body">
                  {doctor.role}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
