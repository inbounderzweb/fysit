import type { Metadata } from "next";
import { getHeroBanner } from "@/services/settings.service";
import { asPopulatedMedia } from "@/types/media";
import type { MediaItem } from "@/types/media";
import { PageHeader } from "@/components/admin/ui/page-header";
import { HeroBannerForm } from "./hero-banner-form";

export const metadata: Metadata = { title: "Homepage banner" };

// Serialised so populated Media documents can cross into the client form.
const toItem = (value: unknown): MediaItem | null =>
  asPopulatedMedia(value) ? JSON.parse(JSON.stringify(value)) : null;

export default async function HomepageBannerPage() {
  const banner = await getHeroBanner();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Homepage banner"
        description="The photo or video behind the heading at the top of the homepage."
      />
      <HeroBannerForm
        defaultValues={{
          mediaType: banner?.mediaType === "image" ? "image" : "video",
          desktopImage: toItem(banner?.desktopImage),
          mobileImage: toItem(banner?.mobileImage),
          video: toItem(banner?.video),
        }}
      />
    </div>
  );
}
