import type { Metadata } from "next";
import { getSiteSettings } from "@/services/settings.service";
import { SettingsForm } from "./settings-form";
import { PageHeader } from "@/components/admin/ui/page-header";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Clinic details, Google reviews and tracking codes used across the website." />
      <SettingsForm
        defaultValues={{
          siteName: settings.siteName,
          tagline: settings.tagline ?? undefined,
          contactEmail: settings.contactEmail ?? undefined,
          contactPhone: settings.contactPhone ?? undefined,
          address: settings.address ?? undefined,
          googleRating: settings.googleReviews?.rating ?? undefined,
          googleReviewCount: settings.googleReviews?.count ?? undefined,
          googleReviewsUrl: settings.googleReviews?.url ?? undefined,
          gtmId: settings.analytics?.gtmId ?? undefined,
          gaId: settings.analytics?.gaId ?? undefined,
          googleSiteVerification: settings.analytics?.googleSiteVerification ?? undefined,
        }}
      />
    </div>
  );
}
