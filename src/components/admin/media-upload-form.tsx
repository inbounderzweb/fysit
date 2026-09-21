"use client";

import { useRef, useState } from "react";
import { uploadFileWithProgress } from "@/lib/upload-with-progress";
import type { MediaItem } from "@/types/media";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export function MediaUploadForm({
  folder = "general",
  onUploaded,
}: {
  folder?: string;
  onUploaded: (media: MediaItem) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image size must not exceed 2 MB.");
      return;
    }

    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const result = await uploadFileWithProgress<MediaItem>("/api/media", formData, setProgress);
    setProgress(null);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    onUploaded(result.data);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          isDragging ? "border-indigo-500 bg-indigo-50" : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
        }`}
      >
        <p className="text-sm font-medium text-neutral-700">Drag & drop an image, or click to browse</p>
        <p className="text-xs text-neutral-500">JPG, PNG, WEBP, or AVIF — up to 2 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.target.value = "";
          }}
        />
      </div>

      {progress !== null && (
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-neutral-500">Uploading… {progress}%</p>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
