import type { Metadata } from "next";
import { getSiteSettings } from "@/services/settings.service";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
      <SettingsForm
        defaultValues={{
          siteName: settings.siteName,
          tagline: settings.tagline ?? undefined,
          contactEmail: settings.contactEmail ?? undefined,
          contactPhone: settings.contactPhone ?? undefined,
          address: settings.address ?? undefined,
        }}
      />
    </div>
  );
}
