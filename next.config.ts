import type { NextConfig } from "next";

/**
 * Permanent redirects from the previous WordPress site's URLs (taken from its
 * live sitemaps on 2026-11-27) to their pages on this site, so rankings and
 * backlinks carry over at launch. The old theme's demo content (shop,
 * products, events, sample team members, layout pages) is deliberately left
 * to 404 so search engines drop it.
 *
 * WordPress URLs end in "/"; Next first strips the slash, then these apply.
 */
const LEGACY_PAGES: Record<string, string> = {
  "/about-us": "/about",
  "/who-we-are": "/about",
  "/contact-us": "/contact",
  "/clinic-home": "/",
  "/category/blogs": "/blog",
  "/category/uncategorized": "/blog",
  "/clinical-physiotherapy": "/services/clinical-physiotherapy",
  "/corporate-wellness": "/services/corporate-wellness",
  "/doorstep-physiotherapy": "/services/doorstep-physiotherapy",
  "/ergonomics-training": "/services/ergonomics-training",
  "/ergonomics-training-2-2": "/services/ergonomics-training",
  "/group-fitness-class": "/services/group-fitness-classes",
  "/home-office-physiotherapy": "/services/home-office-ergonomics",
  "/mental-wellness-program": "/services/mental-wellness-program",
  "/virtual-fitness-class": "/services/virtual-fitness-classes",
  "/virtual-fitness-classes-webinars": "/services/virtual-fitness-classes",
  "/orthopedic-doctor-in-kasturi-nagar": "/physiotherapy-center-in-kasturi-nagar",
  "/orthopedic-doctor-in-sadanandanagar": "/physiotherapy-center-in-sadanandanagar",
};

/**
 * Old blog posts lived at the site root; here they live under /blog. Each
 * redirects to /blog/<same slug>, so a post must be published in Admin → Blog
 * with that exact slug for its redirect to land on a live page.
 */
const LEGACY_POST_SLUGS = [
  "why-your-neck-pain-isnt-going-away-and-how-physiotherapy-fixes-it",
  "posture-correction-guide-fix-your-sitting-habits-in-7-days",
  "dry-needling-vs-electrotherapy-which-is-better",
  "ai-in-physiotherapy-how-technology-is-changing-rehabilitation",
  "why-physiotherapy-is-essential-in-2026-benefits-treatments-recovery-solutions-for-modern-lifestyles",
  "trapezitis-causes-symptoms-and-treatment-explained",
  "calisthenics-complete-guide-benefits-exercises",
  "forearm-exercises-15-ways-to-build-grip-strength-at-home-or-in-the-gym",
  "15-best-at-home-flexibility-exercises-for-better-mobility",
  "best-yoga-poses-for-back-pain-a-physiotherapists-complete-guide",
  "sciatica-pain-causes-symptoms-and-how-physiotherapy-can-help",
  "what-does-an-orthopedic-doctor-treat-a-complete-guide-to-bone-joint-and-muscle-health",
  "8-best-rear-delt-exercises-to-build-strong-pain-free-shoulders",
  "at-home-workouts-a-simple-and-safe-guide-for-every-fitness-level",
  "why-sitting-all-day-can-affect-your-spine-a-physiotherapists-guide-to-back-and-neck-health",
  "physiotherapy-for-stroke-recovery-at-home-improving-everyday-movement-and-functional-independence",
  "how-to-create-a-safe-home-rehabilitation-space-equipment-flooring-and-exercise-essentials",
  "can-physiotherapy-at-home-help-people-with-limited-mobility-a-complete-guide-for-families",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    return [
      ...Object.entries(LEGACY_PAGES).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...LEGACY_POST_SLUGS.map((slug) => ({
        source: `/${slug}`,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
      // The one post whose slug changed in the move.
      {
        source: "/cartilage-vs-ligament",
        destination: "/blog/cartilage-vs-ligament-whats-the-difference-and-why-does-it-matter",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
