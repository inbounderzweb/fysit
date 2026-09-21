// Placeholder brand identity. Real values should move into SiteSettings
// (admin-editable) once the Settings screen ships; this file stays as the
// build-time fallback for metadata and structured data.
export const siteConfig = {
  name: "Fysit",
  tagline: "Placeholder tagline — update via admin settings",
  description: "Placeholder site description — update via admin settings.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  defaultOgImage: "/og-default.png",
  locale: "en_US",
} as const;
