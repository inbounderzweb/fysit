import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Singleton collection — exactly one document is expected to exist.
const siteSettingsSchema = new Schema(
  {
    siteName: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    logo: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    socialLinks: {
      type: Map,
      of: String,
      default: undefined,
    },
    // The clinic's Google Business profile, entered by hand from Google. The
    // reviews section only shows a rating summary once rating and count are set.
    googleReviews: {
      rating: { type: Number, min: 1, max: 5 },
      count: { type: Number, min: 0 },
      url: { type: String, trim: true },
    },
    // Tracking and Search Console, managed by the SEO team. Each blank value
    // falls back to its NEXT_PUBLIC_* environment variable (config/site.ts).
    analytics: {
      gtmId: { type: String, trim: true },
      gaId: { type: String, trim: true },
      googleSiteVerification: { type: String, trim: true },
    },
    // Notified of new enquiries in addition to DEFAULT_NOTIFICATION_EMAIL.
    notificationEmails: { type: [String], default: undefined },
    // The homepage banner behind the hero heading. "video" keeps the built-in
    // clip until one is uploaded; "image" shows the desktop/mobile pair.
    heroBanner: {
      mediaType: { type: String, enum: ["image", "video"], default: "video" },
      desktopImage: { type: Schema.Types.ObjectId, ref: "Media" },
      mobileImage: { type: Schema.Types.ObjectId, ref: "Media" },
      video: { type: Schema.Types.ObjectId, ref: "Media" },
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettings: Model<SiteSettingsDocument> =
  models.SiteSettings ?? model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);
