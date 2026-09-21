"use client";

import { useEffect, useState } from "react";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { cloudinaryThumbnail } from "@/lib/cloudinary-url";
import type { MediaItem } from "@/types/media";

export function MediaPicker({
  name,
  label,
  initial = null,
  folder = "general",
}: {
  name: string;
  label: string;
  initial?: MediaItem | null;
  folder?: string;
}) {
  const [selected, setSelected] = useState<MediaItem | null>(initial);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input type="hidden" name={name} value={selected?._id ?? ""} />

      {selected ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-only picker preview, not a public page */}
          <img
            src={cloudinaryThumbnail(selected.secureUrl, 160)}
            alt={selected.altText ?? ""}
            className="h-20 w-20 rounded-lg border border-neutral-200 object-cover"
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-600">{selected.filename}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="text-sm text-indigo-600 underline"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-sm text-red-600 underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-fit rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Select Image
        </button>
      )}

      {isOpen && (
        <MediaPickerModal
          folder={folder}
          onClose={() => setIsOpen(false)}
          onSelect={(media) => {
            setSelected(media);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function MediaPickerModal({
  folder,
  onClose,
  onSelect,
}: {
  folder: string;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
}) {
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tab !== "library") return;
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      setIsLoading(true);
      const params = new URLSearchParams({ limit: "24" });
      if (search) params.set("search", search);

      fetch(`/api/media?${params.toString()}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { items: MediaItem[] }) => setItems(data.items ?? []))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [tab, search]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Select media"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Media Library</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-neutral-500 hover:text-neutral-800">
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2 border-b border-neutral-200">
          <TabButton active={tab === "library"} onClick={() => setTab("library")}>
            Choose From Library
          </TabButton>
          <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
            Upload New
          </TabButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "library" ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by filename, alt text…"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />

              {isLoading && <p className="text-sm text-neutral-500">Loading…</p>}
              {!isLoading && items.length === 0 && (
                <p className="text-sm text-neutral-500">No media found.</p>
              )}

              <div className="grid grid-cols-4 gap-3">
                {items.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className="group overflow-hidden rounded-lg border border-neutral-200 hover:ring-2 hover:ring-indigo-500"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-only picker grid */}
                    <img
                      src={cloudinaryThumbnail(item.secureUrl, 200)}
                      alt={item.altText ?? ""}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <MediaUploadForm folder={folder} onUploaded={onSelect} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
        active ? "border-indigo-600 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
      }`}
    >
      {children}
    </button>
  );
}
