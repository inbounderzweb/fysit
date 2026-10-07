import { Rubik } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { WordRevealHeading } from "@/components/animations/WordRevealHeading";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { EdgeNotch } from "@/components/ui/EdgeNotch";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { ABOUT_PAGE, DOCTORS } from "@/lib/content";
import type { Doctor } from "@/lib/types";

/**
 * The reference sets its outlined "250+" in Rubik. Mona Sans is a variable
 * font whose glyphs keep overlapping contours, so stroking it draws stray
 * seams inside the numerals; Rubik's static outlines stroke cleanly.
 */
const rubik = Rubik({ subsets: ["latin"], weight: "600", display: "swap" });

const SOCIALS = [
  { label: "Facebook", icon: "/icons/social-facebook.svg" },
  { label: "X", icon: "/icons/social-twitter.svg" },
  { label: "WhatsApp", icon: "/icons/social-whatsapp.svg" },
];

const SHARE_MASK = {
  maskImage: "url(/icons/share-nodes.svg)",
  WebkitMaskImage: "url(/icons/share-nodes.svg)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as const;

/**
 * The reference theme's `team-member`: a square portrait with a white tab
 * rising out of its foot, 50px in from the right, cradling a navy share
 * button. Hovering zooms the portrait to 110%, turns the button teal and lifts
 * a teal pill of social links 30px into view above it.
 */
function DoctorCard({ doctor }: { doctor: Doctor }) {
  // Doctor hrefs are anchors on the home page.
  const href = doctor.href.startsWith("#") ? `/${doctor.href}` : doctor.href;

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden rounded-[20px]">
        <Image
          src={doctor.image}
          alt={`Portrait of ${doctor.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 350px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <ul
          aria-label={`${doctor.name} on social media`}
          className="pointer-events-none absolute bottom-[50px] right-[57.5px] flex w-[51px] list-none flex-col gap-[10px] rounded-full bg-teal px-[8px] py-[10px] opacity-0 transition-all duration-500 group-focus-within:pointer-events-auto group-focus-within:-translate-y-[30px] group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:-translate-y-[30px] group-hover:opacity-100"
        >
          {SOCIALS.map((social) => (
            <li key={social.label}>
              <Link
                href="#"
                aria-label={`${doctor.name} on ${social.label}`}
                className="grid size-[35px] place-items-center rounded-full bg-white transition-transform hover:scale-110"
              >
                <Image src={social.icon} alt="" width={16} height={16} unoptimized />
              </Link>
            </li>
          ))}
        </ul>

        <span className="absolute -bottom-px right-[50px] h-[59px] w-[66px] rounded-t-[50px] bg-white px-[10px] pt-[14px]">
          <EdgeNotch corner="tl" radius={12} className="absolute -left-[12px] bottom-0" />
          <EdgeNotch corner="tr" radius={12} className="absolute -right-[12px] bottom-0" />
          <span className="grid size-[44px] place-items-center rounded-full bg-navy transition-colors duration-500 group-hover:bg-teal">
            <span aria-hidden className="size-[20px] bg-white" style={SHARE_MASK} />
          </span>
        </span>
      </div>

      <div className="pt-[20px]">
        <h4 className="text-[28px] leading-[38px] tracking-[-1.12px] text-navy">
          <Link href={href} className="transition-colors hover:text-teal">
            {doctor.name}
          </Link>
        </h4>
        <p className="mt-[5px] text-[16px] font-medium leading-[26px] text-body">{doctor.role}</p>
      </div>
    </article>
  );
}

/**
 * The reference About page's team block: the heading, an outlined "250+" and
 * a dark button on the left, four doctors in a 2 × 2 grid on the right.
 */
export function AboutTeam() {
  const { team } = ABOUT_PAGE;

  return (
    <section id="team" className="bg-white pb-[30px] pt-[100px] md:pt-[130px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-[60px] px-[40px] xl:grid-cols-[511fr_729fr] min-[1400px]:px-[10px]">
        <Reveal className="flex flex-col items-start">
          <EyebrowPill className="mb-[10px]">{team.eyebrow}</EyebrowPill>
          <WordRevealHeading lead={team.lead} accent={team.accent} />

          {/* Outlined numerals: white fill under a 1px stroke, as sampled. */}
          <p className={`${rubik.className} mt-[60px] text-[80px] font-semibold leading-[60px] tracking-[-0.05em] text-white [-webkit-text-stroke:1px_#270000] md:text-[100px] md:leading-[80px]`}>
            {team.stat}
          </p>
          <p className="mt-[10px] text-[20px] leading-[30px] tracking-[-0.48px] text-navy">
            {team.statLabel}
          </p>
          <ArrowButton href={team.cta.href} label={team.cta.label} variant="dark" className="mt-[20px]" />
        </Reveal>

        <StaggerGroup as="ul" className="grid list-none grid-cols-1 gap-[30px] lg:grid-cols-2">
          {DOCTORS.slice(0, 4).map((doctor) => (
            <StaggerItem as="li" key={doctor.id}>
              <DoctorCard doctor={doctor} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
