import { z } from "zod";

export const EMAIL_LIMITS = {
  /** Combined across to, cc and bcc. */
  recipients: 20,
  subject: 200,
  html: 500_000,
  text: 200_000,
} as const;

// CR, LF and other control characters are what turn a header value into extra
// headers ("Subject: hi\r\nBcc: …"), so header fields refuse them outright.
const SINGLE_LINE = /^[^\u0000-\u001f\u007f\u0085\u2028\u2029]*$/;

// A bare address only: "Name <a@b.com>" and comma-separated lists are refused.
const address = z
  .string({ error: "Enter a valid email address" })
  .trim()
  .max(254, "Email address is too long")
  .pipe(z.email("Enter a valid email address"));

/** Accepts one address or an array of them, and always yields an array. */
function addressList(requiredMessage: string) {
  return z.preprocess(
    (value) => (typeof value === "string" ? [value] : value),
    z
      .array(address, { error: requiredMessage })
      .min(1, requiredMessage)
      .max(EMAIL_LIMITS.recipients, `No more than ${EMAIL_LIMITS.recipients} recipients`)
  );
}

// strictObject: unknown fields (from, headers, attachments, raw …) are errors,
// not silently ignored, so a caller can never believe they were applied.
export const emailMessageSchema = z
  .strictObject({
    to: addressList("Recipient is required"),
    cc: addressList("Enter a valid email address").optional(),
    bcc: addressList("Enter a valid email address").optional(),
    replyTo: address.optional(),
    subject: z
      .string({ error: "Subject is required" })
      .trim()
      .min(1, "Subject is required")
      .max(EMAIL_LIMITS.subject)
      .regex(SINGLE_LINE, "Subject must be a single line"),
    html: z.string().max(EMAIL_LIMITS.html, "HTML content is too large").optional(),
    text: z.string().max(EMAIL_LIMITS.text, "Text content is too large").optional(),
  })
  .superRefine((message, ctx) => {
    if (!message.html?.trim() && !message.text?.trim()) {
      ctx.addIssue({ code: "custom", path: ["content"], message: "Provide html or text content" });
    }
    const total = message.to.length + (message.cc?.length ?? 0) + (message.bcc?.length ?? 0);
    if (total > EMAIL_LIMITS.recipients) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: `No more than ${EMAIL_LIMITS.recipients} recipients across to, cc and bcc`,
      });
    }
  });

/** What callers pass in: recipients may be a single string or an array. */
export type EmailMessageInput = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
};

export type EmailMessage = z.output<typeof emailMessageSchema>;
