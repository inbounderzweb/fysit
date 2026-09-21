"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { cloudinaryThumbnail } from "@/lib/cloudinary-url";
import type { MediaItem } from "@/types/media";
import type { MediaUsage } from "@/services/media.service";

export function MediaDetailModal({
  media,
  onClose,
  onDeleted,
}: {
  media: MediaItem;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [altText, setAltText] = useState(media.altText ?? "");
  const [usage, setUsage] = useState<MediaUsage[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/media/${media._id}`)
      .then((res) => res.json())
      .then((data: { usage: MediaUsage[] }) => setUsage(data.usage ?? []))
      .catch(() => setUsage([]));
  }, [media._id]);

  async function saveAltText() {
    setIsSaving(true);
    await fetch(`/api/media/${media._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ altText }),
    });
    setIsSaving(false);
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    const res = await fetch(`/api/media/${media._id}`, { method: "DELETE" });

    if (res.status === 409) {
      const body = await res.json();
      setError(body.error);
      setUsage(body.usage ?? []);
      setIsDeleting(false);
      return;
    }

    if (!res.ok) {
      setError("Failed to delete media.");
      setIsDeleting(false);
      return;
    }

    onDeleted(media._id);
  }

  const isReferenced = (usage?.length ?? 0) > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media detail"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Media Detail</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-800">
            ✕
          </button>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview */}
        <img
          src={cloudinaryThumbnail(media.secureUrl, 800)}
          alt={media.altText ?? ""}
          className="w-full rounded-lg border border-neutral-200"
        />

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="text-neutral-500">Filename</dt>
          <dd className="text-neutral-900">{media.filename}</dd>
          <dt className="text-neutral-500">Dimensions</dt>
          <dd className="text-neutral-900">
            {media.width}×{media.height}
          </dd>
          <dt className="text-neutral-500">Size</dt>
          <dd className="text-neutral-900">{formatBytes(media.bytes)}</dd>
          <dt className="text-neutral-500">Uploaded</dt>
          <dd className="text-neutral-900">{new Date(media.createdAt).toLocaleDateString()}</dd>
        </dl>

        <div className="flex flex-col gap-1">
          <label htmlFor="altText" className="text-sm font-medium text-neutral-700">
            Alt Text
          </label>
          <div className="flex gap-2">
            <input
              id="altText"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              placeholder="Describe this image for accessibility"
            />
            <button
              type="button"
              onClick={saveAltText}
              disabled={isSaving}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50 disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-neutral-700">Used In</p>
          {usage === null && <p className="text-sm text-neutral-500">Checking…</p>}
          {usage?.length === 0 && <p className="text-sm text-neutral-500">Not used anywhere.</p>}
          {usage && usage.length > 0 && (
            <ul className="list-inside list-disc text-sm text-neutral-700">
              {usage.map((entry) => (
                <li key={`${entry.type}-${entry.id}`}>
                  {entry.type === "blog" ? "Blog" : "Testimonial"}: {entry.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleDelete}
          disabled={isReferenced || isDeleting}
          title={isReferenced ? "This image is currently being used and cannot be deleted." : undefined}
          className="w-fit rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isDeleting ? "Deleting…" : "Delete Image"}
        </button>
      </div>
    </div>
  );
}
