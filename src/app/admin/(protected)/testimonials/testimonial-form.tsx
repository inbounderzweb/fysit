"use client";

import { useActionState } from "react";
import { CONTENT_STATUSES } from "@/lib/constants";
import { MediaPicker } from "@/components/admin/media-picker";
import type { MediaItem } from "@/types/media";
import type { TestimonialFormState } from "./actions";

export type TestimonialFormAction = (
  state: TestimonialFormState,
  formData: FormData
) => Promise<TestimonialFormState>;

export type TestimonialFormDefaults = {
  authorName?: string;
  authorRole?: string;
  company?: string;
  quote?: string;
  image?: MediaItem | null;
  rating?: number;
  status?: string;
};

export function TestimonialForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: TestimonialFormAction;
  defaultValues?: TestimonialFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5" noValidate>
      <Field
        label="Name"
        name="authorName"
        error={state?.errors?.authorName}
        defaultValue={defaultValues?.authorName}
        required
      />
      <Field label="Designation" name="authorRole" defaultValue={defaultValues?.authorRole} />
      <Field label="Company" name="company" defaultValue={defaultValues?.company} />

      <MediaPicker name="image" label="Photo" folder="testimonials" initial={defaultValues?.image ?? null} />

      <div className="flex flex-col gap-1">
        <label htmlFor="quote" className="text-sm font-medium">
          Testimonial
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          required
          defaultValue={defaultValues?.quote}
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        {state?.errors?.quote && <p className="text-sm text-red-600">{state.errors.quote[0]}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="rating" className="text-sm font-medium">
          Rating (1–5, optional)
        </label>
        <input
          id="rating"
          name="rating"
          type="number"
          min={1}
          max={5}
          defaultValue={defaultValues?.rating}
          className="w-24 rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={defaultValues?.status ?? "DRAFT"}
          className="rounded border border-neutral-300 px-3 py-2"
        >
          {CONTENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status === "PUBLISHED" ? "ACTIVE" : status === "ARCHIVED" ? "ARCHIVED" : "INACTIVE"}
            </option>
          ))}
        </select>
      </div>

      {state?.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  required,
}: {
  label: string;
  name: string;
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
        defaultValue={defaultValue}
        required={required}
        className="rounded border border-neutral-300 px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error[0]}</p>}
    </div>
  );
}
