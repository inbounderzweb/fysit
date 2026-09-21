"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsFormState } from "./actions";

export function SettingsForm({
  defaultValues,
}: {
  defaultValues: { siteName: string; tagline?: string; contactEmail?: string; contactPhone?: string; address?: string };
}) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(updateSettingsAction, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5" noValidate>
      <Field label="Site Name" name="siteName" defaultValue={defaultValues.siteName} error={state?.errors?.siteName} required />
      <Field label="Tagline" name="tagline" defaultValue={defaultValues.tagline} />
      <Field label="Contact Email" name="contactEmail" type="email" defaultValue={defaultValues.contactEmail} error={state?.errors?.contactEmail} />
      <Field label="Contact Phone" name="contactPhone" defaultValue={defaultValues.contactPhone} />

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          defaultValue={defaultValues.address}
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {state?.success && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Settings saved.</p>
      )}
      {state?.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="rounded border border-neutral-300 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error[0]}</p>}
    </div>
  );
}
