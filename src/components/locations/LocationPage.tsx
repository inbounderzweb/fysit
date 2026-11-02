import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { WordRevealHeading } from "@/components/animations/WordRevealHeading";
import { ContactMap } from "@/components/sections/ContactMap";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { PageBanner } from "@/components/ui/PageBanner";
import { siteConfig } from "@/config/site";
import { LOCATIONS_COPY, OPENING_HOURS, SITE, type Location } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const BANNER_IMAGE = "/images/banner-about.jpg";
const TEAM_IMAGE = "/images/about-us.jpg";
const CORPORATE_IMAGE = "/images/service-slide-exercise-therapy.jpg";

export function locationMetadata(location: Location): Metadata {
  return buildMetadata(
    {
      canonical: `${siteConfig.url}/${location.slug}`,
      ogImage: location.images?.banner,
    },
    { title: location.metaTitle, description: location.metaDescription }
  );
}

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
const directionsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`The Fysit, ${address}`)}`;

/** Eyebrow pill over a 60/70px heading with a Playfair-italic accent. */
function Heading({
  eyebrow,
  title,
  tone = "navy",
  center = false,
}: {
  eyebrow: string;
  title: { lead: string; accent: string };
  tone?: "navy" | "white";
  center?: boolean;
}) {
  return (
    <div className={center ? "flex flex-col items-center text-center" : "flex flex-col items-start"}>
      <Reveal className="flex">
        <EyebrowPill tone={tone === "white" ? "dark" : "light"} className="mb-[10px]">
          {eyebrow}
        </EyebrowPill>
      </Reveal>
      <WordRevealHeading lead={title.lead} accent={title.accent} tone={tone} />
    </div>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M8 1a5 5 0 0 0-5 5c0 3.6 4.3 8.3 4.5 8.5a.7.7 0 0 0 1 0C8.7 14.3 13 9.6 13 6a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M3.6 1.5h2.2l1.1 3.3-1.6 1.1a8.6 8.6 0 0 0 4.8 4.8l1.1-1.6 3.3 1.1v2.2a1.6 1.6 0 0 1-1.7 1.6A12.3 12.3 0 0 1 2 3.2a1.6 1.6 0 0 1 1.6-1.7Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className}>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm.7 6.2 2.4 1.4-.7 1.2-3.1-1.8V4h1.4v3.7Z" />
    </svg>
  );
}

/**
 * A clinic page at /[slug] — the two original clinics keep the addresses they
 * had on the previous site. Built from the site's existing pieces (page
 * banner, eyebrow pills, word-reveal headings, arrow buttons, map); every
 * list-driven section hides itself when its list is empty.
 */
export function LocationPage({ location, others }: { location: Location; others: Location[] }) {
  const { stats, serviceItems: services, conditions } = location;
  const copy = LOCATIONS_COPY;
  const other = others.find((item) => item.slug !== location.slug);
  const bannerImage = location.images?.banner ?? BANNER_IMAGE;
  const teamImage = location.images?.team ?? TEAM_IMAGE;
  const corporateImage = location.images?.corporate ?? CORPORATE_IMAGE;
  const pageUrl = `${siteConfig.url}/${location.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: `${SITE.name} — ${location.name}`,
      url: pageUrl,
      telephone: location.phone,
      email: SITE.email,
      medicalSpecialty: "Physiotherapy",
      address: {
        "@type": "PostalAddress",
        streetAddress: location.address.street,
        addressLocality: `${location.address.area}, ${location.address.city}`,
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "21:00",
        },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "13:00" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: location.title, item: pageUrl },
      ],
    },
    ...(location.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: location.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageBanner
        title={location.title}
        crumbs={[{ label: "Locations" }, { label: location.name }]}
        image={bannerImage}
        titleClassName="text-[36px] leading-[46px] sm:text-[44px] sm:leading-[54px] lg:text-[60px] lg:leading-[70px]"
      />

      {/* Intro — the pitch, actions and stats beside the clinic card. */}
      <section className="bg-white py-[80px] lg:py-[120px]">
        <div className="mx-auto grid w-full max-w-[1320px] gap-[50px] px-[30px] lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-[70px] min-[1400px]:px-[10px]">
          <div>
            <Heading eyebrow={location.eyebrow} title={location.heading} />
            <Reveal delay={0.1}>
              <p className="mt-[24px] text-[16px] leading-[26px] text-body md:text-[17px] md:leading-[28px]">
                {location.intro}
              </p>
              <div className="mt-[30px] flex flex-wrap gap-[15px]">
                <ArrowButton href="/contact" label="Book Appointment" />
                <ArrowButton href="/services" label="Our Services" variant="dark" />
              </div>
            </Reveal>
            {stats.length > 0 && (
            <Reveal delay={0.15}>
              <dl className="mt-[45px] grid grid-cols-3 border-t border-rule pt-[28px]">
                {stats.map((stat, index) => (
                  // The label leads in the markup, as <dl> requires; column-reverse shows the figure first.
                  <div
                    key={stat.label}
                    className={cn("flex flex-col-reverse", index > 0 && "border-l border-rule pl-[16px] sm:pl-[28px]")}
                  >
                    <dt className="mt-[10px] text-[12px] font-medium uppercase leading-[16px] tracking-[1.2px] text-body sm:text-[13px]">
                      {stat.label}
                    </dt>
                    <dd className="flex items-start text-[36px] leading-none tracking-[-0.05em] text-navy sm:text-[48px]">
                      {stat.value}
                      {index === 0 && (
                        <span aria-hidden className="ml-[4px] mt-[4px] text-[16px] text-teal sm:text-[20px]">
                          ★
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            )}
          </div>

          <Reveal delay={0.1}>
            <aside
              aria-labelledby="clinic-card-title"
              className="relative overflow-hidden rounded-[24px] bg-[#07112f] p-[30px] text-white sm:p-[40px]"
            >
              <div aria-hidden className="absolute -right-[80px] -top-[80px] size-[240px] rounded-full bg-teal/20 blur-[60px]" />
              <h2 id="clinic-card-title" className="relative text-[28px] leading-[36px] tracking-[-0.04em]">
                {copy.visitTitle}
              </h2>

              <ul className="relative mt-[28px] flex list-none flex-col gap-[22px]">
                <li className="flex gap-[16px]">
                  <span className="grid size-[44px] shrink-0 place-items-center rounded-full bg-teal">
                    <PinIcon className="size-[18px] fill-white" />
                  </span>
                  <address className="not-italic text-[16px] leading-[24px] text-white/85">
                    {location.address.street},
                    <br />
                    {location.address.area}, {location.address.city}
                    <a
                      href={directionsHref(location.address.full)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-[6px] block text-[14px] font-medium text-teal underline-offset-4 hover:underline"
                    >
                      {copy.directions} →
                    </a>
                  </address>
                </li>
                <li className="flex gap-[16px]">
                  <span className="grid size-[44px] shrink-0 place-items-center rounded-full bg-white/10">
                    <ClockIcon className="size-[18px] fill-white" />
                  </span>
                  <dl className="flex-1 text-[15px] leading-[24px]">
                    {OPENING_HOURS.map((row) => (
                      <div key={row.label} className="flex justify-between gap-[12px]">
                        <dt className="text-white/60">{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
                <li className="flex items-center gap-[16px]">
                  <span className="grid size-[44px] shrink-0 place-items-center rounded-full bg-white/10">
                    <PhoneIcon className="size-[18px] fill-white" />
                  </span>
                  <a
                    href={telHref(location.phone)}
                    className="text-[22px] font-medium tracking-[-0.03em] transition-colors hover:text-teal"
                  >
                    {location.phone}
                  </a>
                </li>
              </ul>

              <div className="relative mt-[28px] rounded-[14px] border border-white/10 bg-white/[0.04] p-[18px]">
                <p className="text-[15px] font-medium text-teal">{copy.homeVisits.title}</p>
                <p className="mt-[4px] text-[14px] leading-[22px] text-white/70">{copy.homeVisits.body}</p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Approach — photograph against the clinic's philosophy. */}
      <section className="bg-white pb-[80px] lg:pb-[120px]">
        <div className="mx-auto grid w-full max-w-[1320px] gap-[50px] px-[30px] lg:grid-cols-2 lg:items-center lg:gap-[80px] min-[1400px]:px-[10px]">
          <Reveal className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[24px]">
              <Image
                src={location.approach.image}
                alt={`Physiotherapy session at The Fysit ${location.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-[24px] right-[24px] flex items-center gap-[12px] rounded-[12px] bg-teal px-[20px] py-[14px] text-white shadow-card">
              <PinIcon className="size-[18px] fill-white" />
              <span className="text-[15px] font-medium">{location.address.area}</span>
            </div>
          </Reveal>
          <div>
            <Heading eyebrow="Our Approach" title={location.approach.title} />
            <Reveal delay={0.1} className="mt-[24px] flex flex-col gap-[16px]">
              {location.approach.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[16px] leading-[26px] text-body">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services — numbered cards on the mint band. */}
      {services.length > 0 && (
      <section aria-labelledby="location-services" className="bg-mint py-[80px] lg:py-[120px]">
        <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-[10px]">
          <div className="grid gap-[24px] lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-[60px]">
            <div id="location-services">
              <Heading eyebrow={copy.servicesEyebrow} title={location.services} />
            </div>
            <Reveal delay={0.1}>
              <p className="text-[16px] leading-[26px] text-body lg:pb-[8px]">{location.services.intro}</p>
            </Reveal>
          </div>

          <StaggerGroup as="ul" className="mt-[50px] grid list-none gap-[20px] sm:grid-cols-2 lg:mt-[60px] lg:grid-cols-3 lg:gap-[24px]">
            {services.map((service, index) => {
              const body = (
                <>
                  <span
                    aria-hidden
                    className="font-display text-[44px] italic leading-none text-navy/15 transition-colors duration-500 group-hover:text-teal"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-[24px] text-[24px] leading-[32px] tracking-[-0.04em] text-navy transition-colors duration-500 group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-[10px] text-[15px] leading-[24px] text-body transition-colors duration-500 group-hover:text-white/70">
                    {service.description}
                  </p>
                  {service.href && (
                    <span className="mt-auto inline-flex items-center gap-[6px] pt-[20px] text-[15px] font-medium text-navy transition-colors duration-500 group-hover:text-teal">
                      Learn more
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-[4px]">
                        →
                      </span>
                    </span>
                  )}
                </>
              );
              const cardClass =
                "group flex h-full flex-col rounded-[20px] bg-white p-[28px] transition-colors duration-500 hover:bg-[#07112f] sm:p-[32px]";
              return (
                <StaggerItem as="li" key={service.title} className="h-full">
                  {service.href ? (
                    <Link href={service.href} className={cardClass}>
                      {body}
                    </Link>
                  ) : (
                    <div className={cardClass}>{body}</div>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>
      )}

      {/* Conditions — a dark band of condition chips. */}
      {conditions.length > 0 && (
      <section aria-labelledby="location-conditions" className="relative isolate overflow-hidden bg-banner py-[80px] text-white lg:py-[120px]">
        <div aria-hidden className="absolute -right-[10%] -top-[30%] -z-10 size-[60vw] max-h-[800px] max-w-[800px] rounded-full bg-teal/[0.08] blur-[140px]" />
        <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-[10px]">
          <div className="grid gap-[24px] lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-[60px]">
            <div id="location-conditions">
              <Heading eyebrow={copy.conditionsEyebrow} title={location.conditionsTitle} tone="white" />
            </div>
            <Reveal delay={0.1}>
              <p className="text-[16px] leading-[26px] text-white/70 lg:pb-[8px]">{copy.conditionsTreatment}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ul className="mt-[50px] flex list-none flex-wrap gap-[10px] lg:mt-[60px]">
              {conditions.map((condition) => (
                <li
                  key={condition}
                  className="rounded-full border border-white/15 px-[18px] py-[9px] text-[15px] leading-[22px] text-white/85 transition-colors duration-300 hover:border-teal hover:bg-teal hover:text-white"
                >
                  {condition}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-[50px] flex flex-col gap-[20px] rounded-[20px] border border-white/10 bg-white/[0.04] p-[24px] sm:flex-row sm:items-center sm:justify-between sm:p-[30px]">
              <p className="max-w-[640px] text-[17px] leading-[27px] text-white/85">{copy.conditionsCta}</p>
              <a
                href={telHref(location.phone)}
                className="inline-flex h-[53px] shrink-0 items-center gap-[12px] self-start rounded-[8px] bg-teal pl-[20px] pr-[6px] text-[16px] font-medium text-white transition-colors hover:bg-teal-dark sm:self-auto"
              >
                {location.phone}
                <span className="grid size-[41px] place-items-center rounded-[5px] bg-white">
                  <PhoneIcon className="size-[16px] fill-navy" />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      )}

      {/* Why choose — team photograph beside numbered reasons. */}
      {location.why.points.length > 0 && (
      <section aria-labelledby="location-why" className="bg-white py-[80px] lg:py-[120px]">
        <div className="mx-auto grid w-full max-w-[1320px] gap-[50px] px-[30px] lg:grid-cols-[5fr_7fr] lg:gap-[80px] min-[1400px]:px-[10px]">
          <Reveal className="lg:sticky lg:top-[120px] lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#4a4a6a] lg:aspect-[4/5]">
              <Image src={teamImage} alt="The Fysit physiotherapy team" fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <div id="location-why">
              <Heading eyebrow={copy.whyEyebrow} title={location.why.title} />
            </div>
            <ol className="mt-[40px] list-none border-b border-rule">
              {location.why.points.map((point, index) => (
                <Reveal as="li" key={point.title} delay={index * 0.06}>
                  <div className="group grid grid-cols-[52px_1fr] gap-x-[20px] border-t border-rule py-[26px] md:grid-cols-[84px_1fr] md:gap-x-[30px]">
                    <span
                      aria-hidden
                      className="font-display text-[38px] italic leading-none text-navy/20 transition-colors duration-500 group-hover:text-teal md:text-[54px]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[6px]">
                      <h3 className="text-[22px] leading-[30px] tracking-[-0.04em] text-navy md:text-[26px] md:leading-[34px]">
                        {point.title}
                      </h3>
                      <p className="mt-[8px] text-[16px] leading-[26px] text-body">{point.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
      )}

      {/* Corporate wellness — the clinic's offer for local workplaces. */}
      <section className="bg-white pb-[80px] lg:pb-[120px]">
        <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-[10px]">
          <Reveal>
            <div className="grid overflow-hidden rounded-[28px] bg-mint lg:grid-cols-2">
              <div className="relative min-h-[260px]">
                <Image src={corporateImage} alt="Physiotherapist guiding an exercise session" fill sizes="(max-width: 1024px) 100vw, 660px" className="object-cover" />
              </div>
              <div className="p-[30px] sm:p-[50px] lg:p-[60px]">
                <EyebrowPill className="mb-[14px]">{copy.corporateEyebrow}</EyebrowPill>
                <h2 className="text-[30px] leading-[38px] tracking-[-0.05em] text-navy md:text-[40px] md:leading-[48px]">
                  {location.corporate.title}
                </h2>
                {location.corporate.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-[16px] text-[16px] leading-[26px] text-body">
                    {paragraph}
                  </p>
                ))}
                <div className="mt-[28px] flex flex-wrap gap-[15px]">
                  <ArrowButton href="/services/corporate-wellness" label="Corporate Wellness" />
                  <ArrowButton href={telHref(location.phone)} label={`Call ${location.phone}`} variant="dark" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      {location.faqs.length > 0 && (
      <section aria-labelledby="location-faqs" className="bg-surface py-[80px] lg:py-[120px]">
        <div className="mx-auto w-full max-w-[920px] px-[30px]">
          <div id="location-faqs">
            <Heading eyebrow={copy.faqEyebrow} title={location.faqTitle} center />
          </div>
          <div className="mt-[50px] flex flex-col gap-[12px]">
            {location.faqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 0.05}>
                {/* Native <details>, so the answers open without JavaScript. */}
                <details
                  className="group rounded-[16px] border border-rule bg-white transition-colors open:border-teal"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-[20px] px-[24px] py-[20px] text-[18px] font-medium leading-[26px] text-navy [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span
                      aria-hidden
                      className="relative grid size-[34px] shrink-0 place-items-center rounded-full bg-navy transition-colors duration-300 group-open:bg-teal"
                    >
                      <span className="absolute h-[2px] w-[12px] bg-white" />
                      <span className="absolute h-[12px] w-[2px] bg-white transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                    </span>
                  </summary>
                  <p className="px-[24px] pb-[22px] text-[16px] leading-[26px] text-body">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Closing call to action */}
      <section className="bg-white pt-[80px] lg:pt-[120px]">
        <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-[10px]">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-[28px] bg-[#07112f] px-[24px] py-[50px] text-white sm:px-[50px] lg:px-[70px] lg:py-[70px]">
              <div aria-hidden className="absolute -bottom-[40%] -left-[10%] -z-10 size-[520px] rounded-full bg-teal/15 blur-[120px]" />
              <div className="grid gap-[40px] lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="text-[36px] leading-[44px] tracking-[-0.05em] md:text-[56px] md:leading-[64px]">
                    {copy.cta.title.lead} <span className="heading-accent">{copy.cta.title.accent}</span>
                  </h2>
                  <p className="mt-[16px] max-w-[560px] text-[16px] leading-[26px] text-white/70">{copy.cta.body}</p>
                </div>
                <ArrowButton href={copy.cta.button.href} label={copy.cta.button.label} className="self-start lg:self-end" />
              </div>

              <ul className="mt-[50px] grid list-none gap-[16px] border-t border-white/10 pt-[40px] md:grid-cols-3">
                <li className="flex gap-[14px]">
                  <PhoneIcon className="mt-[3px] size-[18px] shrink-0 fill-teal" />
                  <div>
                    <p className="text-[13px] font-medium uppercase tracking-[1.3px] text-white/50">Call us</p>
                    <a href={telHref(location.phone)} className="mt-[4px] block text-[18px] transition-colors hover:text-teal">
                      {location.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-[14px]">
                  <PinIcon className="mt-[3px] size-[18px] shrink-0 fill-teal" />
                  <div>
                    <p className="text-[13px] font-medium uppercase tracking-[1.3px] text-white/50">Visit us</p>
                    <p className="mt-[4px] text-[16px] leading-[24px]">{location.address.full}</p>
                  </div>
                </li>
                <li className="flex gap-[14px]">
                  <ClockIcon className="mt-[3px] size-[18px] shrink-0 fill-teal" />
                  <div>
                    <p className="text-[13px] font-medium uppercase tracking-[1.3px] text-white/50">Clinic hours</p>
                    <dl className="mt-[4px] text-[16px] leading-[24px]">
                      {OPENING_HOURS.map((row) => (
                        <div key={row.label} className="flex gap-[8px]">
                          <dt className="text-white/60">{row.label}:</dt>
                          <dd>{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          {other && (
            <Reveal className="mt-[24px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-1 text-center text-[16px] text-body">
              Closer to {other.name}?
              <Link href={`/${other.slug}`} className="font-medium text-teal-dark underline-offset-4 hover:underline">
                Visit our {other.name} clinic →
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      <div className="pt-[60px]">
        <ContactMap address={`The Fysit, ${location.address.full}`} />
      </div>
    </>
  );
}
