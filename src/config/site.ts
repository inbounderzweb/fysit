import { SITE } from "@/lib/content";

// Brand identity, mirrored from the public site's own SITE object
// (src/lib/content.ts) so sitemap/robots/manifest/SEO fallbacks agree with
// what visitors actually see. Real values should move into SiteSettings
// (admin-editable) once the Settings screen ships; this file stays as the
// build-time fallback for metadata and structured data.
export const siteConfig = {
  name: "The Fysit",
  tagline: "Your Partner in Wellness",
  description:
    "The Fysit is a leading physiotherapy clinic in Bangalore, dedicated to offering cutting-edge treatments designed to improve your health, mobility, and overall well-being.",
  // `metadataBase` (src/app/layout.tsx) resolves every relative OG/Twitter
  // image path against this value, so a missing NEXT_PUBLIC_SITE_URL used to
  // fall back to "http://localhost:3000" — a URL no external crawler
  // (WhatsApp, Facebook, iMessage…) can ever reach, silently killing link
  // previews in production. Falling back to SITE.url instead means a
  // deployment that never got the env var configured still emits the real
  // domain; NEXT_PUBLIC_SITE_URL remains the way to override it (e.g. for a
  // staging deploy on its own subdomain).
  url: process.env.NEXT_PUBLIC_SITE_URL || SITE.url,
  // The share card the SEO team set on the previous site (og-imagenew.png).
  defaultOgImage: "/images/og-image.png",
  locale: "en_IN",
  /** Official profiles — also emitted as `sameAs` in the Organization JSON-LD. */
  socialProfiles: [
    "https://www.linkedin.com/company/thefysit/",
    "https://www.facebook.com/profile.php?id=61552058424229",
    "https://www.instagram.com/thefysit/",
    "https://www.youtube.com/@thefysit",
  ],
  /**
   * Analytics / Search Console fallbacks, used when Admin → Settings leaves a
   * field blank. The defaults are the ones the SEO team set up on the previous
   * WordPress site (GA4 runs inside that GTM container), so tracking and
   * Search Console continue unbroken at launch. The GTM default is
   * production-only so local development never sends visits to the live
   * container.
   */
  gtmId:
    process.env.NEXT_PUBLIC_GTM_ID ||
    (process.env.NODE_ENV === "production" ? "GTM-K8XHQRW3" : ""),
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "KaQ79vAPw6gETaLDjNp0XiTCOL0033JtifjYmHm3SlQ",
} as const;
