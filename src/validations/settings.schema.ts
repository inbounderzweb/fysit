import { z } from "zod";

export const settingsInputSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required").max(120),
  tagline: z.string().trim().max(160).optional(),
  contactEmail: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  contactPhone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(300).optional(),
  googleRating: z.coerce.number().min(1, "Between 1 and 5").max(5, "Between 1 and 5").optional(),
  googleReviewCount: z.coerce.number().int("Whole number only").min(0).optional(),
  googleReviewsUrl: z.string().trim().url("Enter a full link, starting with https://").max(500).optional(),
});

export type SettingsInput = z.infer<typeof settingsInputSchema>;

const mediaId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Choose the file again.")
  .optional()
  .or(z.literal(""));

export const heroBannerInputSchema = z
  .object({
    mediaType: z.enum(["image", "video"]),
    desktopImage: mediaId,
    mobileImage: mediaId,
    video: mediaId,
  })
  .refine((value) => value.mediaType !== "image" || !!value.desktopImage, {
    path: ["desktopImage"],
    message: "Choose a desktop image to show the banner as a photo.",
  });

export type HeroBannerInput = z.infer<typeof heroBannerInputSchema>;
