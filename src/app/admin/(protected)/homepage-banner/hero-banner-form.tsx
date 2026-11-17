"use client";

import { useActionState, useState } from "react";
import { updateHeroBannerAction, type HeroBannerFormState } from "./actions";
import { Card } from "@/components/admin/ui/card";
import { FormFooter, FormSection } from "@/components/admin/ui/form";
import { Alert } from "@/components/admin/ui/feedback";
import { buttonClasses } from "@/components/admin/ui/button";
import { MediaPicker } from "@/components/admin/media-picker";
import { VideoUploadField } from "@/components/admin/video-upload-field";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/media";

type MediaType = "image" | "video";

export type HeroBannerFormDefaults = {
  mediaType: MediaType;
  desktopImage: MediaItem | null;
  mobileImage: MediaItem | null;
  video: MediaItem | null;
};

const OPTIONS: { value: MediaType; title: string; description: string }[] = [
  { value: "image", title: "Image", description: "A still photo, with a separate crop for phones." },
  { value: "video", title: "Video", description: "A muted, looping clip. Uses the built-in video until one is uploaded." },
];

export function HeroBannerForm({ defaultValues }: { defaultValues: HeroBannerFormDefaults }) {
  const [state, formAction, pending] = useActionState<HeroBannerFormState, FormData>(
    updateHeroBannerAction,
    undefined,
  );
  const [mediaType, setMediaType] = useState<MediaType>(defaultValues.mediaType);
  const errors = state?.errors;

  return (
    <Card className="max-w-5xl">
      <form action={formAction} noValidate>
        <FormSection title="Show" description="Choose what plays behind the homepage heading.">
          <div role="radiogroup" aria-label="Banner type" className="grid gap-3 sm:grid-cols-2">
            {OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                  mediaType === option.value
                    ? "border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/15"
                    : "border-line hover:border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name="mediaType"
                  value={option.value}
                  checked={mediaType === option.value}
                  onChange={() => setMediaType(option.value)}
                  className="mt-0.5 accent-primary-600"
                />
                <span>
                  <span className="block text-sm font-medium text-navy-900">{option.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-slate-500">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </FormSection>

        {/* Both sections stay mounted so switching back keeps what was chosen. */}
        <div className={cn(mediaType !== "image" && "hidden")}>
          <FormSection
            title="Banner images"
            description="The heading and buttons sit over the bottom-left, so keep the subject top or right."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <MediaPicker
                  name="desktopImage"
                  label="Desktop image (required)"
                  initial={defaultValues.desktopImage}
                  folder="banners"
                />
                <SizeHint>1920 × 1080 px (16:9), landscape. WEBP or JPG under 2 MB.</SizeHint>
                {errors?.desktopImage && (
                  <p className="text-xs font-medium text-red-600">{errors.desktopImage[0]}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <MediaPicker
                  name="mobileImage"
                  label="Mobile image"
                  initial={defaultValues.mobileImage}
                  folder="banners"
                />
                <SizeHint>
                  1080 × 1920 px (9:16), portrait. Keep the subject in the top half. Without one, phones show
                  the desktop image cropped.
                </SizeHint>
              </div>
            </div>
          </FormSection>
        </div>

        <div className={cn(mediaType !== "video" && "hidden")}>
          <FormSection
            title="Banner video"
            description="Plays muted and on a loop. Leave empty to keep the built-in video."
          >
            <VideoUploadField name="video" label="Video" initial={defaultValues.video} />
            <SizeHint>
              1920 × 1080 px (16:9), 10–20 seconds, MP4 (H.264) under 15 MB for fast loading. No sound needed.
            </SizeHint>
          </FormSection>
        </div>

        <FormFooter>
          <div aria-live="polite" className="sm:mr-auto">
            {state?.success && <Alert tone="success">Banner saved. The homepage has been updated.</Alert>}
            {state?.message && <Alert tone="error">{state.message}</Alert>}
          </div>
          <button type="submit" disabled={pending} className={buttonClasses()}>
            {pending ? "Saving…" : "Save banner"}
          </button>
        </FormFooter>
      </form>
    </Card>
  );
}

function SizeHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs leading-5 text-slate-500">
      <span className="font-medium text-slate-600">Recommended: </span>
      {children}
    </p>
  );
}
