import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { signVideoUpload } from "@/lib/cloudinary";
import { logAction } from "@/services/audit.service";
import * as mediaService from "@/services/media.service";

/**
 * Videos go from the browser straight to Cloudinary — a hero clip is far
 * larger than this server should buffer. GET hands out a signed upload;
 * POST records the finished upload in the media library.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!can(user.role, "create", "media")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(signVideoUpload());
}

const registerSchema = z.object({
  publicId: z.string().trim().min(1).max(300),
  filename: z.string().trim().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!can(user.role, "create", "media")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid video details." }, { status: 400 });
  }

  try {
    const media = await mediaService.registerUploadedVideo(parsed.data.publicId, parsed.data.filename, user.id);

    await logAction({
      userId: user.id,
      action: "MEDIA_UPLOAD",
      entity: "Media",
      entityId: media._id.toString(),
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    if (error instanceof mediaService.VideoRegistrationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    throw error;
  }
}
