import "server-only";

import { cache } from "react";

import { HERO_BANNER } from "@/lib/content";
import { getHeroBanner } from "@/services/settings.service";
import { asPopulatedMedia, type PopulatedMedia } from "@/types/media";

export type HeroImage = { src: string; width: number; height: number; alt: string };

export type HeroMedia =
  | { type: "video"; src: string }
  | { type: "image"; desktop: HeroImage; mobile: HeroImage };

const DEFAULT_MEDIA: HeroMedia = { type: "video", src: HERO_BANNER.video };

function toHeroImage(media: PopulatedMedia): HeroImage {
  return {
    src: media.secureUrl,
    width: media.width ?? 1920,
    height: media.height ?? 1080,
    alt: media.altText ?? "",
  };
}

/**
 * What plays behind the hero, as set under Admin → Homepage banner: the
 * desktop/mobile image pair, or a video. The built-in clip stands in when
 * nothing is chosen yet, or if the database can't be reached.
 */
export const getHeroMedia = cache(async (): Promise<HeroMedia> => {
  try {
    const banner = await getHeroBanner();
    if (!banner) return DEFAULT_MEDIA;

    if (banner.mediaType === "image") {
      const desktop = asPopulatedMedia(banner.desktopImage);
      if (!desktop) return DEFAULT_MEDIA;
      const mobile = asPopulatedMedia(banner.mobileImage) ?? desktop;
      return { type: "image", desktop: toHeroImage(desktop), mobile: toHeroImage(mobile) };
    }

    const video = asPopulatedMedia(banner.video);
    return video ? { type: "video", src: video.secureUrl } : DEFAULT_MEDIA;
  } catch {
    return DEFAULT_MEDIA;
  }
});
