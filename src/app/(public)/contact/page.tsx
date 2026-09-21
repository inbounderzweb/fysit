import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = buildMetadata(
  { canonical: `${siteConfig.url}/contact` },
  { title: "Contact Us", description: "Get in touch with The Fysit — we usually respond the same day." }
);

export default function ContactPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-neutral-900">Contact Us</h1>
        <p className="text-neutral-600">
          Fill in your details and we&apos;ll get back to you the same day.
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
