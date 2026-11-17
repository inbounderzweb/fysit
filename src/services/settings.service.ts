import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
// Registers the Media model so the banner's media can be populated.
import "@/models/Media";
import { siteConfig } from "@/config/site";
import type { HeroBannerInput, SettingsInput } from "@/validations/settings.schema";

export async function getSiteSettings() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();
  if (settings) return settings;

  // No settings document yet — fall back to the build-time config so the
  // form has sensible starting values instead of appearing empty.
  return {
    siteName: siteConfig.name,
    tagline: siteConfig.tagline,
    contactEmail: "",
    contactPhone: "",
    address: "",
    googleReviews: undefined,
  };
}

export type GoogleReviewsSummary = { rating: number; count: number; url?: string };

/** The clinic's Google rating as entered in Settings, or null until both numbers are set. */
export async function getGoogleReviewsSummary(): Promise<GoogleReviewsSummary | null> {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().select("googleReviews").lean();
  const reviews = settings?.googleReviews;
  if (!reviews?.rating || reviews.count == null) return null;
  return { rating: reviews.rating, count: reviews.count, url: reviews.url || undefined };
}

export async function updateSiteSettings(input: SettingsInput, userId: string) {
  await connectToDatabase();
  const { googleRating, googleReviewCount, googleReviewsUrl, ...details } = input;
  return SiteSettings.findOneAndUpdate(
    {},
    {
      ...details,
      // A blank field clears the stored value, so the summary can be hidden again.
      googleReviews: { rating: googleRating, count: googleReviewCount, url: googleReviewsUrl || undefined },
      updatedBy: userId,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

/** The homepage banner with its media documents populated. */
export async function getHeroBanner() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne()
    .select("heroBanner")
    .populate(["heroBanner.desktopImage", "heroBanner.mobileImage", "heroBanner.video"])
    .lean();
  return settings?.heroBanner ?? null;
}

export async function updateHeroBanner(input: HeroBannerInput, userId: string) {
  await connectToDatabase();
  return SiteSettings.findOneAndUpdate(
    {},
    {
      $set: {
        heroBanner: {
          mediaType: input.mediaType,
          desktopImage: input.desktopImage || undefined,
          mobileImage: input.mobileImage || undefined,
          video: input.video || undefined,
        },
        updatedBy: userId,
      },
      // The banner may be saved before the clinic details ever are.
      $setOnInsert: { siteName: siteConfig.name },
    },
    { new: true, upsert: true }
  );
}
