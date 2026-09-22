// Brand identity, mirrored from the public site's own SITE object
// (src/lib/content.ts) so sitemap/robots/manifest/SEO fallbacks agree with
// what visitors actually see. Real values should move into SiteSettings
// (admin-editable) once the Settings screen ships; this file stays as the
// build-time fallback for metadata and structured data.
export const siteConfig = {
  name: "The Fysit",
  tagline: "Your Trusted Partner Health and Wellness",
  description:
    "We’re committed to offering compassionate and comprehensive healthcare tailored to your needs. At TheFysit, your health is our priority every step of the way.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultOgImage: "/images/hero-slide-1.jpg",
  locale: "en_US",
} as const;
