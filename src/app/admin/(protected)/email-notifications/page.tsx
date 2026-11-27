import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { isEmailConfigured } from "@/lib/email/gmail";
import { getExtraNotificationEmails } from "@/services/settings.service";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Alert } from "@/components/admin/ui/feedback";
import { NotificationsForm } from "./notifications-form";

export const metadata: Metadata = { title: "Email notifications" };

export default async function EmailNotificationsPage() {
  const user = await getCurrentUser();
  if (!can(user.role, "update", "settings")) redirect("/admin/dashboard");
  const emails = await getExtraNotificationEmails();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Email notifications" description="Who gets an email when someone books or sends an enquiry." />
      {!isEmailConfigured() && (
        <Alert tone="warning" title="Email sending is not set up" className="max-w-5xl">
          No notifications or booking confirmations will be sent until the Gmail settings are added to the server.
        </Alert>
      )}
      <NotificationsForm emails={emails} />
    </div>
  );
}
