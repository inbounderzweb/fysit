import { GoogleReviewsSection } from "@/components/sections/GoogleReviewsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { TESTIMONIALS } from "@/lib/content";
import type { Testimonial } from "@/lib/types";
import { getGoogleReviewsSummary, type GoogleReviewsSummary } from "@/services/settings.service";
import { listActiveTestimonials } from "@/services/testimonial.service";
import { asPopulatedMedia } from "@/types/media";

/** "Mar 2026". Formatted here, in UTC, so server and browser always agree. */
const MONTH_YEAR = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "UTC" });

/**
 * Published testimonials from the admin panel, in their admin order. Falls
 * back to the built-in set when none are published yet, or when the database
 * can't be reached, so the section never renders empty.
 */
async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const items = await listActiveTestimonials(20);
    if (items.length === 0) return TESTIMONIALS;

    return items.map((item) => ({
      id: item._id.toString(),
      name: item.authorName,
      role: [item.authorRole, item.company].filter(Boolean).join(", "),
      quote: item.quote,
      avatar: asPopulatedMedia(item.image)?.secureUrl,
      rating: item.rating ?? undefined,
      source: item.source === "google" ? "google" : "other",
      date: item.reviewDate
        ? { label: MONTH_YEAR.format(item.reviewDate), iso: item.reviewDate.toISOString().slice(0, 10) }
        : undefined,
      url: item.reviewUrl || undefined,
    }));
  } catch (error) {
    console.error("Testimonials: falling back to built-in content", error);
    return TESTIMONIALS;
  }
}

async function getSummary(): Promise<GoogleReviewsSummary | null> {
  try {
    return await getGoogleReviewsSummary();
  } catch {
    return null;
  }
}

type TestimonialsProps = {
  /** Passed to the band heading — the About page uses the reference's larger setting. */
  headingSize?: "default" | "large";
};

export async function Testimonials({ headingSize = "default" }: TestimonialsProps) {
  const [reviews, summary] = await Promise.all([getTestimonials(), getSummary()]);

  // The Google layout carries Google's logo, so it shows only real Google
  // data: the clinic's rating from Settings and reviews marked as posted on
  // Google. Until both exist, the neutral layout shows every testimonial.
  const googleReviews = reviews.filter((review) => review.source === "google");
  if (summary && googleReviews.length > 0) {
    return <GoogleReviewsSection reviews={googleReviews} summary={summary} headingSize={headingSize} />;
  }

  return <ReviewsSection reviews={reviews} summary={summary} headingSize={headingSize} />;
}
