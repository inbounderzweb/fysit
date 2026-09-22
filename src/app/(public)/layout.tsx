import type { Metadata, Viewport } from "next";
import { Mona_Sans, Playfair_Display } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE } from "@/lib/content";

import "./globals.css";

/**
 * Figma uses Mona Sans throughout, with every text node pinned to the
 * variable width axis at `"wdth" 100`. Loading the `wdth` axis keeps that
 * available; `globals.css` applies it on `body`.
 */
const monaSans = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-mona-sans",
});

/** Accent face used italic inside section headings (Figma node 1:106). */
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "healthcare",
    "medical clinic",
    "cardiology",
    "dental care",
    "family medicine",
    "emergency care",
    "health checkup",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/images/hero-slide-1.jpg",
        width: 1920,
        height: 1080,
        alt: SITE.tagline,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/images/hero-slide-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icons/logo.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#17a2b8",
  width: "device-width",
  initialScale: 1,
};

// Fonts, the public-only stylesheet (./globals.css, not loaded on admin
// routes), and the marketing header/footer live here instead of the shared
// root layout, so admin pages never inherit this site's fonts, tokens, or
// chrome. See src/app/layout.tsx for why the split works.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${monaSans.variable} ${playfair.variable} font-sans antialiased`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-teal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
