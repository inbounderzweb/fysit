import type { Metadata } from "next";

import { Reveal } from "@/components/animations/Reveal";
import { WordRevealHeading } from "@/components/animations/WordRevealHeading";
import { ContactDetails, type ContactInfo } from "@/components/sections/ContactDetails";
import { ContactMap } from "@/components/sections/ContactMap";
import { EyebrowPill } from "@/components/ui/EyebrowPill";
import { PageBanner } from "@/components/ui/PageBanner";
import { siteConfig } from "@/config/site";
import { CONTACT_PAGE } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/services/settings.service";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/contact` },
  { title: "Contact Us", description: "Get in touch with The Fysit — we usually respond the same day." }
);

/**
 * The address, email and phone saved under Admin → Settings, falling back
 * to the built-in defaults for any that are blank or when the database
 * can't be reached.
 */
async function getContactInfo(): Promise<ContactInfo> {
  const { defaults } = CONTACT_PAGE;
  try {
    const settings = await getSiteSettings();
    return {
      address: settings.address || defaults.address,
      email: settings.contactEmail || defaults.email,
      phone: settings.contactPhone || defaults.phone,
    };
  } catch (error) {
    console.error("Contact page: falling back to default contact details", error);
    return { ...defaults };
  }
}

/**
 * Section order follows the reference theme's Contact page: banner, then the
 * details and the booking form side by side (form first once they stack),
 * then the map.
 */
export default async function ContactPage() {
  const info = await getContactInfo();
  const { form } = CONTACT_PAGE;

  return (
    <>
      <PageBanner
        title={CONTACT_PAGE.banner.title}
        crumbs={[{ label: CONTACT_PAGE.banner.title }]}
        image={CONTACT_PAGE.banner.image}
      />

      <section className="bg-white px-[30px]">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col-reverse gap-[50px] py-[120px] min-[1025px]:flex-row min-[1025px]:gap-0">
          <div className="p-[10px] min-[1025px]:w-2/5 min-[1025px]:border-r min-[1025px]:border-[#d1ced7] min-[1025px]:pr-[50px] min-[1367px]:pr-[100px]">
            <ContactDetails info={info} />
          </div>

          <div className="p-[10px] min-[1025px]:w-3/5 min-[1025px]:pl-[50px] min-[1367px]:pl-[100px]">
            <Reveal className="flex">
              <EyebrowPill className="mb-[10px]">{form.eyebrow}</EyebrowPill>
            </Reveal>
            <WordRevealHeading lead={form.title} size="page" />
            <Reveal delay={0.05}>
              <p className="mt-[20px] text-[16px] leading-[25.6px] text-body">{form.body}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-[20px]">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <ContactMap address={info.address} />
    </>
  );
}
