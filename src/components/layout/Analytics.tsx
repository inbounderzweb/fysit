import Script from "next/script";

import { siteConfig } from "@/config/site";

/**
 * Google Tag Manager or Google Analytics 4 for the public site only (admin
 * routes never load it). Driven by environment variables so the SEO team can
 * switch tracking on without a code change:
 *
 * - NEXT_PUBLIC_GTM_ID (e.g. GTM-XXXXXXX) — preferred; GA4 and any other tags
 *   are then managed inside the GTM container.
 * - NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXXXXX) — used only when no GTM ID is set,
 *   so a GA4 tag set up inside GTM is never double-counted.
 *
 * With neither set, nothing is rendered.
 */
export function Analytics() {
  const { gtmId, gaId } = siteConfig;

  if (gtmId) {
    return (
      <>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      </>
    );
  }

  if (gaId) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
          strategy="afterInteractive"
        />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
        </Script>
      </>
    );
  }

  return null;
}
