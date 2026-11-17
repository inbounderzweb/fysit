/**
 * Inserts an f_auto,q_auto,w_<width> transformation into a Cloudinary
 * delivery URL so admin thumbnails (media grid, picker) don't ship the full
 * original asset just to render a small square preview. Public pages don't
 * need this — next/image already resizes/optimizes those server-side.
 */
export function cloudinaryThumbnail(secureUrl: string, width = 300): string {
  const marker = "/upload/";
  const index = secureUrl.indexOf(marker);
  if (index === -1) return secureUrl;

  const insertAt = index + marker.length;
  // A video has no still to resize until Cloudinary is asked for one: the
  // same URL with an image extension returns a poster frame.
  const rest = isCloudinaryVideo(secureUrl)
    ? secureUrl.slice(insertAt).replace(/\.[a-z0-9]+$/i, ".jpg")
    : secureUrl.slice(insertAt);
  return `${secureUrl.slice(0, insertAt)}f_auto,q_auto,w_${width}/${rest}`;
}

export function isCloudinaryVideo(secureUrl: string): boolean {
  return secureUrl.includes("/video/upload/");
}
