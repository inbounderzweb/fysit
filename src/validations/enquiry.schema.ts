import { z } from "zod";

export const enquiryInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(150).optional(),
  // Appointment details from the Contact page form; all optional so a
  // plain message still goes through.
  department: z.string().trim().max(120).optional(),
  doctor: z.string().trim().max(120).optional(),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
  // Honeypot: real users never see or fill this field; bots that
  // autofill every input do. Non-empty means "reject silently".
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;

/** The raw field values of either booking form, ready for `enquiryInputSchema`. */
export function enquiryFromFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject") || undefined,
    department: formData.get("department") || undefined,
    doctor: formData.get("doctor") || undefined,
    preferredDate: formData.get("preferredDate") || undefined,
    message: formData.get("message"),
    company: formData.get("company") || undefined,
  };
}
