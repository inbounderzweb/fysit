import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type CloudinaryUploadResult = {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
};

/**
 * Uploads a file buffer to Cloudinary under a folder namespaced by `website/`.
 * Callers must validate file type/size and the caller's permission before invoking this.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: { folder: string; filename?: string }
): Promise<CloudinaryUploadResult> {
  const result = await new Promise<import("cloudinary").UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `fysit/${options.folder}`,
        public_id: options.filename,
        resource_type: "auto",
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(uploadResult);
      }
    );
    uploadStream.end(buffer);
  });

  return {
    publicId: result.public_id,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

export async function deleteFromCloudinary(publicId: string, resourceType = "image"): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

/** Videos the browser uploads straight to Cloudinary — too large to pass through this server. */
export const VIDEO_UPLOAD = {
  folder: "fysit/videos",
  formats: "mp4,webm,mov",
  maxBytes: 50 * 1024 * 1024,
} as const;

/**
 * Signs a direct browser-to-Cloudinary video upload. The folder and formats
 * are part of the signature, so the browser can't upload elsewhere or send
 * another kind of file with it.
 */
export function signVideoUpload() {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { allowed_formats: VIDEO_UPLOAD.formats, folder: VIDEO_UPLOAD.folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET ?? "");

  return {
    ...params,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  };
}

/** Looks a video up on Cloudinary itself, so its details never come from the browser. */
export async function getCloudinaryVideo(publicId: string): Promise<CloudinaryUploadResult | null> {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: "video" });
    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      resourceType: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch {
    return null;
  }
}

export { cloudinary };
