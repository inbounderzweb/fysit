"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/utils";
import { cloudinaryThumbnail } from "@/lib/cloudinary-url";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { MediaDetailModal } from "@/components/admin/media-detail-modal";
import type { MediaItem } from "@/types/media";

type ListResponse = { items: MediaItem[]; page: number; pages: number; total: number };

export function MediaLibrary({ initial }: { initial: ListResponse }) {
  const [data, setData] = useState<ListResponse>(initial);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), limit: "24" });
      if (search) params.set("search", search);

      fetch(`/api/media?${params.toString()}`)
        .then((res) => res.json())
        .then(setData)
        .catch(() => {});
    }, 250);

    return () => clearTimeout(timeout);
  }, [search, page]);

  function handleUploaded(media: MediaItem) {
    setIsUploadOpen(false);
    setData((prev) => ({ ...prev, items: [media, ...prev.items], total: prev.total + 1 }));
  }

  function handleDeleted(id: string) {
    setSelected(null);
    setData((prev) => ({ ...prev, items: prev.items.filter((item) => item._id !== id), total: prev.total - 1 }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by filename, alt text…"
          className="w-full max-w-sm rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Upload Media
        </button>
      </div>

      {data.items.length === 0 && <p className="text-sm text-neutral-500">No media yet.</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.items.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => setSelected(item)}
            className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-left hover:ring-2 hover:ring-indigo-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only grid */}
            <img
              src={cloudinaryThumbnail(item.secureUrl, 300)}
              alt={item.altText ?? ""}
              className="aspect-square w-full object-cover"
            />
            <div className="flex flex-col gap-0.5 p-2">
              <p className="truncate text-xs font-medium text-neutral-900">{item.filename}</p>
              <p className="text-xs text-neutral-500">
                {item.width}×{item.height} · {formatBytes(item.bytes)}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Page {data.page} of {data.pages} · {data.total} total
        </span>
        <div className="flex gap-2">
          {data.page > 1 && (
            <button type="button" onClick={() => setPage((p) => p - 1)} className="underline">
              Previous
            </button>
          )}
          {data.page < data.pages && (
            <button type="button" onClick={() => setPage((p) => p + 1)} className="underline">
              Next
            </button>
          )}
        </div>
      </div>

      {isUploadOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Upload media"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Upload Media</h2>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                aria-label="Close"
                className="text-neutral-500 hover:text-neutral-800"
              >
                ✕
              </button>
            </div>
            <MediaUploadForm onUploaded={handleUploaded} />
          </div>
        </div>
      )}

      {selected && (
        <MediaDetailModal media={selected} onClose={() => setSelected(null)} onDeleted={handleDeleted} />
      )}
    </div>
  );
}
