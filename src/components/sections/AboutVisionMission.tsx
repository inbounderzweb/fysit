import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_PAGE } from "@/lib/content";
import { cn } from "@/lib/utils";

const LABEL = "text-[14px] font-semibold uppercase leading-[24px] tracking-[-0.48px]";

function VisionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-[34px]" aria-hidden>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-[34px]" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" />
    </svg>
  );
}

type CardProps = {
  index: string;
  label: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  dark?: boolean;
  children?: React.ReactNode;
};

/**
 * One half of the pair. The vision card sits on navy and the mission card on
 * white, so the two read as a set without repeating each other. Both lift on
 * hover, and the icon tile turns a quarter-step to answer the pointer.
 */
function Card({ index, label, title, body, icon, dark, children }: CardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card p-[30px] transition-all duration-500 hover:-translate-y-[6px] md:p-[45px]",
        dark
          ? "bg-navy text-white shadow-[0_25px_60px_-25px_rgba(15,30,76,0.6)]"
          : "border border-[#e6ebf1] bg-white text-navy shadow-card hover:shadow-[0_30px_60px_-25px_rgba(8,29,82,0.25)]",
      )}
    >
      {/* Oversized index, ghosted into the corner. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-[6px] -top-[22px] select-none text-[150px] font-semibold leading-none tracking-[-0.05em] transition-transform duration-700 group-hover:-translate-x-[10px] md:text-[190px]",
          dark ? "text-white/[0.05]" : "text-navy/[0.04]",
        )}
      >
        {index}
      </span>
      {/* Soft teal glow that blooms on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[120px] -left-[120px] size-[260px] rounded-full bg-teal opacity-0 blur-[90px] transition-opacity duration-700 group-hover:opacity-30"
      />

      <div className="relative flex items-center gap-[18px]">
        <span
          className={cn(
            "grid size-[70px] shrink-0 place-items-center rounded-[15px] transition-transform duration-500 group-hover:rotate-[8deg]",
            dark ? "bg-teal text-white" : "bg-teal text-white shadow-[0_8px_20px_-8px_rgba(67,194,209,0.7)]",
          )}
        >
          {icon}
        </span>
        <h3 className={cn(LABEL, dark ? "text-teal" : "text-teal-dark")}>{label}</h3>
      </div>

      <p
        className={cn(
          "relative mt-[30px] text-[20px] font-normal leading-[30px] tracking-[-0.5px] md:text-[22px] md:leading-[33px]",
          dark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </p>
      <span
        aria-hidden
        className="relative mt-[25px] block h-px w-[60px] bg-teal transition-all duration-500 group-hover:w-[120px]"
      />
      <p className={cn("relative mt-[25px] text-[16px] leading-[25.6px]", dark ? "text-white/75" : "text-body")}>
        {body}
      </p>
      {children}
    </article>
  );
}

/**
 * About page: the clinic's vision and mission, introduced by the site's usual
 * eyebrow pill and two-face heading, then set as a contrasting pair of cards
 * that rise in one after the other.
 */
export function AboutVisionMission() {
  const { eyebrow, lead, accent, body, vision, mission } = ABOUT_PAGE.visionMission;

  return (
    <section className="relative overflow-hidden bg-surface py-[80px] md:py-[120px]">
      <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-0">
        <div className="flex flex-col gap-[25px] lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="flex flex-col items-start gap-[20px]">
            <EyebrowPill>{eyebrow}</EyebrowPill>
            <SectionHeading lead={lead} accent={accent} className="max-w-[620px]" />
          </Reveal>
          <Reveal delay={0.1} className="lg:max-w-[440px]">
            <p className="text-[16px] leading-[25.6px] text-body">{body}</p>
          </Reveal>
        </div>

        <StaggerGroup className="mt-[50px] grid gap-[30px] md:mt-[70px] lg:grid-cols-2">
          <StaggerItem>
            <Card index="01" label={vision.label} title={vision.title} body={vision.body} icon={<VisionIcon />} dark />
          </StaggerItem>
          <StaggerItem>
            <Card index="02" label={mission.label} title={mission.title} body={mission.body} icon={<MissionIcon />} />
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
