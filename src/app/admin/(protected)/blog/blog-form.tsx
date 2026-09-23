"use client";

import { useActionState } from "react";
import { CONTENT_STATUSES } from "@/lib/constants";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { MediaPicker } from "@/components/admin/media-picker";
import type { MediaItem } from "@/types/media";
import type { BlogFormState } from "./actions";

export type BlogFormAction = (state: BlogFormState, formData: FormData) => Promise<BlogFormState>;

export type BlogFormDefaults = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: MediaItem | null;
  status?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    keywords?: string[];
    ogImage?: string;
  };
};

export function BlogForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: BlogFormAction;
  defaultValues?: BlogFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5" noValidate>
      <Field label="Title" name="title" error={state?.errors?.title} defaultValue={defaultValues?.title} required />
      <Field label="Slug" name="slug" error={state?.errors?.slug} defaultValue={defaultValues?.slug} required />
      <Field label="Excerpt" name="excerpt" defaultValue={defaultValues?.excerpt} />

      <MediaPicker
        name="featuredImage"
        label="Featured Image"
        folder="blog"
        initial={defaultValues?.featuredImage ?? null}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <RichTextEditor name="content" initialContent={defaultValues?.content} placeholder="Write your post…" />
        {state?.errors?.content && <p className="text-sm text-red-600">{state.errors.content[0]}</p>}
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
              {status}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-3 rounded border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium">SEO</legend>
        <Field label="SEO Title" name="seoTitle" defaultValue={defaultValues?.seo?.title} />
        <Field label="SEO Description" name="seoDescription" defaultValue={defaultValues?.seo?.description} />
        <Field label="Canonical URL" name="seoCanonical" defaultValue={defaultValues?.seo?.canonical} />
        <Field
          label="Keywords (comma separated)"
          name="seoKeywords"
          defaultValue={defaultValues?.seo?.keywords?.join(", ")}
        />
        <Field label="OG Image URL" name="seoOgImage" defaultValue={defaultValues?.seo?.ogImage} />
      </fieldset>

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
