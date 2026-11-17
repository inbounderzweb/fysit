"use client";

import { useRef, useState } from "react";
import { uploadFileWithProgress } from "@/lib/upload-with-progress";
import { Button } from "@/components/admin/ui/button";
import { Alert } from "@/components/admin/ui/feedback";
import { UploadIcon } from "@/components/admin/icons";
import type { MediaItem } from "@/types/media";

const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPTED = ["video/mp4", "video/webm", "video/quicktime"];

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  allowed_formats: string;
};

/**
 * Picks and uploads one video. The file goes from the browser straight to
 * Cloudinary on a signature from our API, then is recorded in the media
 * library; the chosen video's id is submitted with the form as `name`.
 */
export function VideoUploadField({
  name,
  label,
  initial = null,
}: {
  name: string;
  label: string;
  initial?: MediaItem | null;
}) {
  const [selected, setSelected] = useState<MediaItem | null>(initial);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError("Only MP4, WEBM and MOV videos are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Video size must not exceed 50 MB. Compress it and try again.");
      return;
    }

    setProgress(0);
    try {
      const signRes = await fetch("/api/media/video");
      if (!signRes.ok) throw new Error("You don’t have permission to upload videos.");
      const sign = (await signRes.json()) as UploadSignature;

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sign.apiKey);
      body.append("timestamp", String(sign.timestamp));
      body.append("signature", sign.signature);
      body.append("folder", sign.folder);
      body.append("allowed_formats", sign.allowed_formats);

      const uploaded = await uploadFileWithProgress<{ public_id: string }>(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`,
        body,
        setProgress,
      );
      if (!uploaded.ok) throw new Error(uploaded.error);

      const saveRes = await fetch("/api/media/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: uploaded.data.public_id, filename: file.name }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) throw new Error(saved?.error ?? "Upload failed.");

      setSelected(saved as MediaItem);
    } catch (uploadError) {
      setError((uploadError as Error).message || "Upload failed.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isUploading = progress !== null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-slate-700">{label}</span>
      <input type="hidden" name={name} value={selected?._id ?? ""} />
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {selected && !isUploading ? (
        <div className="overflow-hidden rounded-xl border border-line">
          <video
            src={selected.secureUrl}
            className="aspect-video w-full bg-slate-900 object-cover"
            muted
            loop
            autoPlay
            playsInline
            controls
          />
          <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2.5">
            <p className="min-w-0 truncate text-xs text-slate-500">{selected.filename}</p>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={() => inputRef.current?.click()}>
                Replace
              </Button>
              <Button variant="danger-soft" size="sm" onClick={() => setSelected(null)}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-slate-50/60 px-4 py-7 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/40 disabled:cursor-wait"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-card">
            <UploadIcon className="size-5" />
          </span>
          <span className="text-sm font-medium text-slate-700">
            {isUploading ? "Uploading video…" : "Upload a video"}
          </span>
          <span className="text-xs text-slate-500">MP4, WEBM or MOV, up to 50 MB</span>
        </button>
      )}

      {isUploading && (
        <div className="flex flex-col gap-1">
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Video upload progress"
          >
            <div className="h-full rounded-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs tabular-nums text-slate-500">
            {progress < 100 ? `Uploading… ${progress}%` : "Processing…"}
          </p>
        </div>
      )}

      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
