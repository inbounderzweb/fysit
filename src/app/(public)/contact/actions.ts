"use server";

import { headers } from "next/headers";
import { enquiryInputSchema, type EnquiryInput } from "@/validations/enquiry.schema";
import { createEnquiry } from "@/services/enquiry.service";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactFormState = {
  errors?: Partial<Record<keyof EnquiryInput, string[]>>;
  message?: string;
  success?: boolean;
} | undefined;

const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function submitEnquiryAction(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const validated = enquiryInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    company: formData.get("company") || undefined,
  });

  if (!validated.success) {
    // A filled honeypot fails the "company" field's max(0) rule — reported
    // as a generic error rather than tipping off the bot to what happened.
    if (validated.error.flatten().fieldErrors.company) {
      return { message: "Something went wrong. Please try again." };
    }
    return { errors: validated.error.flatten().fieldErrors };
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const rateLimit = checkRateLimit(`contact:${ip}`, CONTACT_RATE_LIMIT);
  if (!rateLimit.allowed) {
    return { message: "Too many submissions. Please try again later." };
  }

  await createEnquiry(validated.data, ip);

  return { success: true };
}
