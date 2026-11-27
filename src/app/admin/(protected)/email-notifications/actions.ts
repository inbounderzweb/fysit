"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { notificationEmailsSchema } from "@/validations/settings.schema";
import { updateNotificationEmails } from "@/services/settings.service";
import { logAction } from "@/services/audit.service";

export type NotificationsFormState = { error?: string; success?: boolean } | undefined;

export async function updateNotificationEmailsAction(
  _prev: NotificationsFormState,
  formData: FormData
): Promise<NotificationsFormState> {
  const user = await getCurrentUser();
  if (!can(user.role, "update", "settings")) {
    return { error: "You do not have permission to update settings." };
  }

  let submitted: unknown;
  try {
    submitted = JSON.parse(String(formData.get("emails")));
  } catch {
    return { error: "The list couldn’t be read. Reload the page and try again." };
  }

  const validated = notificationEmailsSchema.safeParse(submitted);
  if (!validated.success) {
    const issue = validated.error.issues[0];
    const row = typeof issue.path[0] === "number" ? `Address ${issue.path[0] + 1}: ` : "";
    return { error: `${row}${issue.message}` };
  }

  await updateNotificationEmails(validated.data, user.id);
  await logAction({ userId: user.id, action: "SETTINGS_UPDATE", entity: "SiteSettings" });
  revalidatePath("/admin/email-notifications");

  return { success: true };
}
