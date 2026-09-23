"use client";

import { useRef } from "react";
import { cloudinaryThumbnail } from "@/lib/cloudinary-url";
import type { PopulatedMedia } from "@/types/media";

export function BlogImageViewer({ image, title, large = false }: {
  image: PopulatedMedia | null;
  title: string;
  large?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  if (!image) return <span className="text-xs text-neutral-400">No image</span>;

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`View image for ${title}`}
        className={`overflow-hidden rounded border border-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${large ? "w-full cursor-zoom-in" : "h-14 w-20 cursor-zoom-in"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- admin media preview */}
        <img src={cloudinaryThumbnail(image.secureUrl, large ? 1200 : 160)} alt={image.altText || title} loading="lazy" className={large ? "max-h-[32rem] w-full object-contain" : "h-full w-full object-cover"} />
      </button>
      <dialog
        ref={dialog}
        aria-label={`Image for ${title}`}
        className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-xl bg-white p-4 shadow-xl backdrop:bg-black/70"
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="font-medium text-neutral-900">{title}</p>
          <button type="button" onClick={() => dialog.current?.close()} className="rounded border border-neutral-300 px-3 py-2 text-sm">Close</button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- display original image in viewer */}
        <img src={image.secureUrl} alt={image.altText || title} loading="lazy" className="max-h-[70vh] w-full object-contain" />
      </dialog>
    </>
  );
}
