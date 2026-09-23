"use client";

import { useActionState } from "react";
import { submitEnquiryAction, type ContactFormState } from "./actions";

const initialState: ContactFormState = undefined;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiryAction, initialState);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-medium">Thanks for reaching out!</p>
        <p className="text-sm">We&apos;ve received your message and will get back to you the same day.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <Field label="Name" name="name" error={state?.errors?.name} required />
      <Field label="Email" name="email" type="email" error={state?.errors?.email} required />
      <Field label="Phone" name="phone" type="tel" error={state?.errors?.phone} />
      <Field label="Subject" name="subject" error={state?.errors?.subject} />

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        {state?.errors?.message && <p className="text-sm text-red-600">{state.errors.message[0]}</p>}
      </div>

      {/* Honeypot: hidden from real visitors via CSS, not `type="hidden"`,
          so form-filling bots that skip hidden inputs still populate it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {state?.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
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
        required={required}
        className="rounded border border-neutral-300 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error[0]}</p>}
    </div>
  );
}
