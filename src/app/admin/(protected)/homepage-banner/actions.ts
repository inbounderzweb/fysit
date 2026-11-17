"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { heroBannerInputSchema, type HeroBannerInput } from "@/validations/settings.schema";
import { updateHeroBanner } from "@/services/settings.service";
import { logAction } from "@/services/audit.service";

export type HeroBannerFormState = {
  errors?: Partial<Record<keyof HeroBannerInput, string[]>>;
  message?: string;
  success?: boolean;
} | undefined;

export async function updateHeroBannerAction(
  _prev: HeroBannerFormState,
  formData: FormData,
): Promise<HeroBannerFormState> {
  const user = await getCurrentUser();
  if (!can(user.role, "update", "settings")) {
    return { message: "You do not have permission to change the homepage banner." };
  }

  const validated = heroBannerInputSchema.safeParse({
    mediaType: formData.get("mediaType"),
    desktopImage: formData.get("desktopImage") || undefined,
    mobileImage: formData.get("mobileImage") || undefined,
    video: formData.get("video") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await updateHeroBanner(validated.data, user.id);
  await logAction({ userId: user.id, action: "SETTINGS_UPDATE", entity: "SiteSettings" });
  revalidatePath("/admin/homepage-banner");
  revalidatePath("/");

  return { success: true };
}
