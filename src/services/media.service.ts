import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import { Media } from "@/models/Media";
import { BlogPost } from "@/models/BlogPost";
import { Testimonial } from "@/models/Testimonial";
import { Doctor } from "@/models/Doctor";
import { Service } from "@/models/Service";
import { Location } from "@/models/Location";
import { SiteSettings } from "@/models/SiteSettings";
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryVideo, VIDEO_UPLOAD } from "@/lib/cloudinary";
import { getPagination, totalPages, startOfMonth } from "@/lib/utils";

export type MediaUsage = { type: "blog" | "testimonial" | "doctor" | "service" | "location" | "homepage"; id: string; title: string };

export class MediaInUseError extends Error {
  usage: MediaUsage[];
  constructor(usage: MediaUsage[]) {
    super("This image is currently being used and cannot be deleted.");
    this.name = "MediaInUseError";
    this.usage = usage;
  }
}

export async function listMediaAdmin(params: {
  search?: string;
  page?: string | number;
  limit?: string | number;
  type?: "image" | "video";
}) {
  await connectToDatabase();
  const { page, limit, skip } = getPagination(params);
  const filter = {
    ...(params.search && {
      $or: [
        { filename: { $regex: params.search, $options: "i" } },
        { publicId: { $regex: params.search, $options: "i" } },
        { altText: { $regex: params.search, $options: "i" } },
      ],
    }),
    ...(params.type && { resourceType: params.type }),
  };

  const [items, count] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Media.countDocuments(filter),
  ]);

  return { items, page, limit, total: count, pages: totalPages(count, limit) };
}

export async function getMediaById(id: string) {
  await connectToDatabase();
  return Media.findById(id).lean();
}

export async function uploadMedia(
  buffer: Buffer,
  meta: { filename: string; folder: string; altText?: string },
  userId: string
) {
  await connectToDatabase();
  const result = await uploadToCloudinary(buffer, { folder: meta.folder });

  return Media.create({
    publicId: result.publicId,
    secureUrl: result.secureUrl,
    resourceType: result.resourceType,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    filename: meta.filename,
    altText: meta.altText,
    folder: meta.folder,
    uploadedBy: userId,
  });
}

export class VideoRegistrationError extends Error {}

/**
 * Records a video the browser has already uploaded straight to Cloudinary.
 * Everything stored is read back from Cloudinary, not taken from the request;
 * a video outside the upload folder is refused and an oversized one removed.
 */
export async function registerUploadedVideo(publicId: string, filename: string, userId: string) {
  if (!publicId.startsWith(`${VIDEO_UPLOAD.folder}/`)) {
    throw new VideoRegistrationError("That video wasn’t uploaded through the admin.");
  }

  const video = await getCloudinaryVideo(publicId);
  if (!video) throw new VideoRegistrationError("The uploaded video couldn’t be found on Cloudinary.");

  if (video.bytes > VIDEO_UPLOAD.maxBytes) {
    await deleteFromCloudinary(publicId, "video");
    throw new VideoRegistrationError("Video size must not exceed 50 MB.");
  }

  await connectToDatabase();
  const existing = await Media.findOne({ publicId }).lean();
  if (existing) return existing;

  return Media.create({
    ...video,
    filename,
    folder: "videos",
    uploadedBy: userId,
  });
}

export async function updateMediaMetadata(id: string, updates: { altText?: string; caption?: string }) {
  await connectToDatabase();
  return Media.findByIdAndUpdate(id, updates, { new: true }).lean();
}

export async function findMediaUsage(id: string): Promise<MediaUsage[]> {
  await connectToDatabase();
  const [blogPosts, testimonials, doctors, services, locations, homepage] = await Promise.all([
    BlogPost.find({ featuredImage: id }).select("title").lean(),
    Testimonial.find({ image: id }).select("authorName").lean(),
    Doctor.find({ photo: id }).select("name").lean(),
    Service.find({ $or: [{ image: id }, { bannerImage: id }] }).select("name").lean(),
    Location.find({
      $or: [{ bannerImage: id }, { teamImage: id }, { corporateImage: id }, { "approach.image": id }],
    })
      .select("name")
      .lean(),
    SiteSettings.exists({
      $or: [{ "heroBanner.desktopImage": id }, { "heroBanner.mobileImage": id }, { "heroBanner.video": id }],
    }),
  ]);

  return [
    ...blogPosts.map((post) => ({ type: "blog" as const, id: post._id.toString(), title: post.title })),
    ...testimonials.map((t) => ({ type: "testimonial" as const, id: t._id.toString(), title: t.authorName })),
    ...doctors.map((d) => ({ type: "doctor" as const, id: d._id.toString(), title: d.name })),
    ...services.map((s) => ({ type: "service" as const, id: s._id.toString(), title: s.name })),
    ...locations.map((l) => ({ type: "location" as const, id: l._id.toString(), title: l.name })),
    ...(homepage ? [{ type: "homepage" as const, id: homepage._id.toString(), title: "Homepage banner" }] : []),
  ];
}

export async function deleteMedia(id: string): Promise<void> {
  await connectToDatabase();
  const usage = await findMediaUsage(id);
  if (usage.length > 0) {
    throw new MediaInUseError(usage);
  }

  const media = await Media.findById(id);
  if (!media) return;

  await deleteFromCloudinary(media.publicId, media.resourceType);
  await Media.findByIdAndDelete(id);
}

export async function getMediaStats() {
  await connectToDatabase();
  const [total, totalThisMonth] = await Promise.all([
    Media.countDocuments(),
    Media.countDocuments({ createdAt: { $gte: startOfMonth() } }),
  ]);
  return { total, totalThisMonth };
}
