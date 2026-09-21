import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { TestimonialsSection } from "@/components/public/testimonials-section";

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

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{siteConfig.name}</h1>
        <p className="text-neutral-600">{siteConfig.tagline}</p>
        <p className="text-sm text-neutral-500">
          This is a placeholder homepage. Real content is managed through the admin CMS.
        </p>
      </div>

      <TestimonialsSection />
    </div>
  );
}
