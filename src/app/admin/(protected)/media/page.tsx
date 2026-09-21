import type { Metadata } from "next";
import { listMediaAdmin } from "@/services/media.service";
import { MediaLibrary } from "@/components/admin/media-library";
import type { MediaItem } from "@/types/media";

export const metadata: Metadata = { title: "Media" };

export default async function MediaPage() {
  const result = await listMediaAdmin({});

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Media Library</h1>
      <MediaLibrary
        initial={{
          items: JSON.parse(JSON.stringify(result.items)) as MediaItem[],
          page: result.page,
          pages: result.pages,
          total: result.total,
        }}
      />
    </div>
  );
}
