import Image from "next/image";

import { Reveal } from "@/components/animations/Reveal";
import { FEATURE_BAND } from "@/lib/content";

/**
 * Figma 1:299 — a full-bleed photograph, 1920 × 862. The frosted stat panel
 * sits over its right side; it is present in the live build but was flattened
 * into the background on the Figma import, so it is rebuilt here.
 */
export function FeatureBand() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden lg:h-[862px]">
      <Image
        src={FEATURE_BAND.image}
        alt={FEATURE_BAND.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1920px] items-center justify-end px-5 sm:px-8 lg:px-[300px]">
        <Reveal y={24}>
          <div className="w-full max-w-[460px] border border-white/15 bg-white/10 p-[40px] backdrop-blur-[6px]">
            <Image
              src={FEATURE_BAND.icon}
              alt=""
              width={70}
              height={70}
              className="size-[52px] lg:size-[70px]"
              unoptimized
            />
            <p className="mt-[26px] text-[24px] leading-[34px] tracking-[-0.48px] text-white lg:text-[30px] lg:leading-[43px]">
              {FEATURE_BAND.headline}
            </p>
            <p className="mt-[18px] text-[48px] font-medium leading-none tracking-[-2px] text-white lg:text-[64px]">
              {FEATURE_BAND.stat}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
