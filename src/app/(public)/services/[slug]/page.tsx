import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/animations/Reveal";
import { DepartmentCard } from "@/components/sections/AboutDepartments";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { PageBanner } from "@/components/ui/PageBanner";
import { siteConfig } from "@/config/site";
import { OPENING_HOURS, SERVICES_PAGE, SITE } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getServiceSummaries, SERVICE_FALLBACK_IMAGE } from "@/lib/services-public";
import { cn } from "@/lib/utils";
import { getPublishedServiceBySlug } from "@/services/service.service";
import { asPopulatedMedia } from "@/types/media";

const RELATED_COUNT = 3;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata(
    {
      ...service.seo,
      canonical: service.seo?.canonical || `${siteConfig.url}/services/${service.slug}`,
      ogImage: service.seo?.ogImage || asPopulatedMedia(service.image)?.secureUrl,
    },
    { title: service.name, description: service.shortDescription }
  );
}

/** Eyebrow pill over a heading with a Playfair-italic accent, sized for the content column. */
function SectionTitle({ eyebrow, lead, accent, id }: { eyebrow: string; lead: string; accent: string; id: string }) {
  return (
    <Reveal className="mb-[30px] flex flex-col items-start">
      <EyebrowPill className="mb-[10px]">{eyebrow}</EyebrowPill>
      <h2 id={id} className="text-[34px] leading-[42px] tracking-[-0.05em] text-navy md:text-[44px] md:leading-[52px]">
        {lead} <span className="heading-accent">{accent}</span>
      </h2>
    </Reveal>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([getPublishedServiceBySlug(slug), getServiceSummaries()]);

  if (!service) {
    notFound();
  }

  const { detail } = SERVICES_PAGE;
  const image = asPopulatedMedia(service.image);
  const banner = asPopulatedMedia(service.bannerImage) ?? image;
  const related = allServices.filter((item) => item.slug !== service.slug).slice(0, RELATED_COUNT);
  // Without a cover image, show the same placeholder photo as the service's card.
  const coverFallback = allServices.find((item) => item.slug === service.slug)?.image ?? SERVICE_FALLBACK_IMAGE;
  const pageUrl = `${siteConfig.url}/services/${service.slug}`;
  const phoneHref = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.shortDescription,
      url: pageUrl,
      image: image?.secureUrl,
      serviceType: "Physiotherapy",
      provider: { "@type": "MedicalBusiness", name: siteConfig.name, url: siteConfig.url, telephone: SITE.phone },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
        { "@type": "ListItem", position: 3, name: service.name, item: pageUrl },
      ],
    },
    ...(service.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((faq) => ({
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
        title={service.name}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.name }]}
        image={banner?.secureUrl}
        titleClassName="text-[36px] leading-[46px] sm:text-[44px] sm:leading-[54px] lg:text-[60px] lg:leading-[70px]"
      />

      <section className="bg-white py-[70px] lg:py-[120px]">
        <div className="mx-auto grid w-full max-w-[1320px] gap-[60px] px-[30px] lg:grid-cols-[2fr_1fr] lg:gap-[50px] min-[1400px]:px-[10px]">
          <article className="min-w-0">
            {/* Overview */}
            <Reveal>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[20px]">
                <Image
                  src={image?.secureUrl ?? coverFallback}
                  alt={image?.altText || service.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 840px"
                  loading="eager"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="pt-[40px] lg:pt-[50px]">
              {service.tagline && (
                <Reveal>
                  <p className="mb-[20px] border-l-2 border-teal pl-[20px] text-[22px] leading-[32px] tracking-[-0.03em] text-navy md:text-[26px] md:leading-[36px]">
                    {service.tagline}
                  </p>
                </Reveal>
              )}
              {/* Authored by signed-in staff with service permissions through the
                  Tiptap editor — not visitor input — so the stored HTML is rendered. */}
              <div className="blog-prose" dangerouslySetInnerHTML={{ __html: service.description }} />
            </div>

            {service.features.length > 0 && (
              <section aria-labelledby="service-benefits" className="mt-[70px] lg:mt-[90px]">
                <SectionTitle id="service-benefits" eyebrow={detail.benefitsEyebrow} {...detail.benefitsTitle} />
                <StaggerGroup as="ul" className="grid list-none gap-[15px] sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <StaggerItem as="li" key={feature}>
                      <div className="group flex h-full items-start gap-[15px] rounded-[16px] bg-mint p-[20px] transition-colors duration-300 hover:bg-navy">
                        <span
                          aria-hidden
                          className="grid size-[30px] shrink-0 place-items-center rounded-full bg-teal text-white transition-transform duration-300 group-hover:scale-110"
                        >
                          <svg viewBox="0 0 16 16" className="size-[14px] fill-none stroke-current stroke-[2.2]">
                            <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="pt-[3px] text-[16px] font-medium leading-[24px] text-navy transition-colors duration-300 group-hover:text-white">
                          {feature}
                        </span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            )}

            {service.process.length > 0 && (
              <section aria-labelledby="service-process" className="mt-[70px] lg:mt-[90px]">
                <SectionTitle id="service-process" eyebrow={detail.processEyebrow} {...detail.processTitle} />
                <ol className="list-none border-b border-rule">
                  {service.process.map((step, index) => (
                    <Reveal as="li" key={index} delay={index * 0.06}>
                      <div className="group grid grid-cols-[52px_1fr] gap-x-[20px] border-t border-rule py-[28px] md:grid-cols-[84px_1fr] md:gap-x-[30px]">
                        <span
                          aria-hidden
                          className="font-display text-[38px] italic leading-none text-navy/20 transition-colors duration-500 group-hover:text-teal md:text-[54px]"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[6px]">
                          <h3 className="text-[22px] leading-[30px] tracking-[-0.04em] text-navy md:text-[26px] md:leading-[34px]">
                            {step.title}
                          </h3>
                          {step.description && (
                            <p className="mt-[8px] text-[16px] leading-[26px] text-body">{step.description}</p>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </section>
            )}

            {service.faqs.length > 0 && (
              <section aria-labelledby="service-faqs" className="mt-[70px] lg:mt-[90px]">
                <SectionTitle id="service-faqs" eyebrow={detail.faqEyebrow} {...detail.faqTitle} />
                <div className="flex flex-col gap-[12px]">
                  {service.faqs.map((faq, index) => (
                    <Reveal key={index} delay={index * 0.05}>
                      {/* Native <details>, so the answers open without JavaScript. */}
                      <details
                        className="group rounded-[16px] border border-rule bg-white transition-colors open:border-teal open:bg-mint"
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
              </section>
            )}
          </article>

          <aside aria-label="Services sidebar" className="flex flex-col gap-[30px] lg:sticky lg:top-[110px] lg:self-start">
            {allServices.length > 0 && (
              <Reveal>
                <nav
                  aria-labelledby="sidebar-services"
                  className="rounded-[20px] border border-[#f0f0f5] bg-white p-[25px] shadow-[0_0_8px_0_rgba(240,240,245,0.5)] sm:p-[30px]"
                >
                  <h2 id="sidebar-services" className="mb-[20px] text-[24px] leading-[34px] tracking-[-0.03rem] text-navy">
                    {detail.sidebarTitle}
                  </h2>
                  <ul className="flex list-none flex-col gap-[10px]">
                    {allServices.map((item) => {
                      const active = item.slug === service.slug;
                      return (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "group flex items-center justify-between gap-[12px] rounded-[10px] px-[18px] py-[14px] text-[16px] font-medium leading-[24px] transition-colors duration-300",
                              active ? "bg-teal text-white" : "bg-surface text-navy hover:bg-navy hover:text-white",
                            )}
                          >
                            {item.title}
                            <svg
                              viewBox="0 0 16 16"
                              aria-hidden
                              className="size-[14px] shrink-0 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-[3px]"
                            >
                              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-[20px] bg-[#07112f] p-[30px] text-white">
                <div aria-hidden className="absolute -right-[60px] -top-[60px] size-[180px] rounded-full bg-teal/20 blur-[50px]" />
                <h2 className="relative text-[26px] leading-[34px] tracking-[-0.04em]">{detail.help.title}</h2>
                <p className="relative mt-[12px] text-[16px] leading-[26px] text-white/70">{detail.help.body}</p>
                <a
                  href={phoneHref}
                  className="relative mt-[22px] flex items-center gap-[12px] text-[22px] font-medium tracking-[-0.03em] transition-colors hover:text-teal"
                >
                  <span aria-hidden className="grid size-[44px] place-items-center rounded-full bg-teal">
                    <svg viewBox="0 0 16 16" className="size-[18px] fill-white">
                      <path d="M3.6 1.5h2.2l1.1 3.3-1.6 1.1a8.6 8.6 0 0 0 4.8 4.8l1.1-1.6 3.3 1.1v2.2a1.6 1.6 0 0 1-1.7 1.6A12.3 12.3 0 0 1 2 3.2a1.6 1.6 0 0 1 1.6-1.7Z" />
                    </svg>
                  </span>
                  {SITE.phone}
                </a>
                <ArrowButton href={detail.help.cta.href} label={detail.help.cta.label} className="relative mt-[24px]" />

                <dl className="relative mt-[28px] border-t border-white/15 pt-[20px] text-[15px] leading-[24px]">
                  {OPENING_HOURS.map((row) => (
                    <div key={row.label} className="flex justify-between gap-[12px] py-[4px]">
                      <dt className="text-white/60">{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-services" className="bg-mint py-[80px] lg:py-[110px]">
          <div className="mx-auto w-full max-w-[1320px] px-[30px] min-[1400px]:px-[10px]">
            <div className="flex flex-wrap items-end justify-between gap-[20px]">
              <Reveal className="flex flex-col items-start">
                <EyebrowPill className="mb-[10px]">{detail.related.eyebrow}</EyebrowPill>
                <h2
                  id="related-services"
                  className="text-[36px] leading-[46px] tracking-[-0.05em] text-navy md:text-[60px] md:leading-[70px]"
                >
                  {detail.related.lead} <span className="heading-accent">{detail.related.accent}</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <ArrowButton href="/services" label="View All Services" variant="dark" />
              </Reveal>
            </div>
            <StaggerGroup
              as="ul"
              className="mt-[60px] grid list-none grid-cols-1 gap-x-[30px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((item) => (
                <StaggerItem as="li" key={item.id} className="h-full">
                  <DepartmentCard service={item} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </>
  );
}
