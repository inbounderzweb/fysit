import "server-only";

import { listActiveDoctors } from "@/services/doctor.service";
import { DOCTORS } from "@/lib/content";
import { asPopulatedMedia } from "@/types/media";
import type { Doctor } from "@/lib/types";

/** Shown when a doctor in the admin has no photo yet. */
const PLACEHOLDER_PHOTO = "/images/doctor-01.jpg";

/**
 * Active doctors from the admin panel (Admin → Doctors), in their admin order,
 * shaped for the website. Returns `null` when none are active or the database
 * can't be reached, so each caller can fall back to its built-in content.
 */
export async function getWebsiteDoctors(): Promise<Doctor[] | null> {
  try {
    const items = await listActiveDoctors();
    if (items.length === 0) return null;

    return items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      role: item.designation,
      image: asPopulatedMedia(item.photo)?.secureUrl ?? PLACEHOLDER_PHOTO,
      href: "#team",
      qualifications: item.qualifications ?? undefined,
      socialLinks: {
        facebook: item.socialLinks?.facebook ?? undefined,
        x: item.socialLinks?.x ?? undefined,
        whatsapp: item.socialLinks?.whatsapp ?? undefined,
      },
    }));
  } catch (error) {
    console.error("Doctors: falling back to built-in content", error);
    return null;
  }
}

/** Names for the booking forms' doctor dropdowns, with the same fallback. */
export async function getDoctorNames(): Promise<string[]> {
  const doctors = (await getWebsiteDoctors()) ?? DOCTORS;
  return doctors.map((doctor) => doctor.name);
}
