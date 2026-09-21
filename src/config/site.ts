// Real values should move into SiteSettings (admin-editable) once the
// Settings screen ships; this file stays as the build-time fallback for
// metadata and structured data.
export const siteConfig = {
  name: "The Fysit",
  tagline: "Wellness Simplified",
  description:
    "The Fysit is a leading physiotherapy clinic in Bangalore, dedicated to offering cutting-edge treatments designed to improve your health, mobility, and overall well-being.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultOgImage: "/og-default.png",
  locale: "en_US",
} as const;
