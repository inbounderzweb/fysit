import { z } from "zod";
import { CONTENT_STATUSES } from "@/lib/constants";

export const testimonialInputSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(120),
  authorRole: z.string().trim().max(120).optional(),
  company: z.string().trim().max(120).optional(),
  quote: z.string().trim().min(1, "Testimonial content is required").max(1000),
  image: z.string().trim().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  source: z.enum(["google", "other"]).default("other"),
  reviewDate: z.coerce
    .date({ error: "Enter a valid date" })
    .max(new Date(Date.now() + 24 * 60 * 60 * 1000), "The review date can’t be in the future")
    .optional(),
  reviewUrl: z.string().trim().url("Enter a full link, starting with https://").max(500).optional(),
  status: z.enum(CONTENT_STATUSES).default("DRAFT"),
});

export type TestimonialInput = z.infer<typeof testimonialInputSchema>;
