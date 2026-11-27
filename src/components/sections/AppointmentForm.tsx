"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";

import { submitEnquiryAction, type ContactFormState } from "@/app/(public)/contact/actions";
import { APPOINTMENT } from "@/lib/content";
import { cn } from "@/lib/utils";

const FIELD =
  "h-[50px] w-full rounded-[5px] border border-line bg-white px-[21px] text-[16px] text-navy placeholder:text-body/70 focus:border-teal focus:outline-none aria-invalid:border-[#dc3232]";

export function AppointmentForm({ doctorNames }: { doctorNames: string[] }) {
  const { form } = APPOINTMENT;
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(submitEnquiryAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state?.errors;

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  // onSubmit rather than `action`, so React keeps what the visitor typed.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      aria-label="Book an appointment"
      noValidate
      className="mt-[20px] grid grid-cols-1 gap-[16px] sm:grid-cols-2"
    >
      <Field label={form.name} error={errors?.name}>
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder={form.name}
          maxLength={120}
          required
          aria-invalid={Boolean(errors?.name)}
          className={FIELD}
        />
      </Field>
      <Field label={form.email} error={errors?.email}>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder={form.email}
          required
          aria-invalid={Boolean(errors?.email)}
          className={FIELD}
        />
      </Field>
      <Field label={form.phone} error={errors?.phone}>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder={form.phone}
          aria-invalid={Boolean(errors?.phone)}
          className={FIELD}
        />
      </Field>
      <Field label="Department" error={errors?.department}>
        <select name="department" className={FIELD} defaultValue="">
          <option value="">{form.departments[0]}</option>
          {form.departments.slice(1).map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
      <Field label="Doctor" error={errors?.doctor}>
        <select name="doctor" className={FIELD} defaultValue="">
          <option value="">{form.doctors[0]}</option>
          {doctorNames.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
      <Field label="Preferred date" error={errors?.preferredDate}>
        <input type="date" name="preferredDate" aria-invalid={Boolean(errors?.preferredDate)} className={FIELD} />
      </Field>

      <Field label={form.messagePlaceholder} error={errors?.message} className="sm:col-span-2">
        <textarea
          name="message"
          rows={5}
          placeholder={form.messagePlaceholder}
          maxLength={2000}
          required
          aria-invalid={Boolean(errors?.message)}
          className={cn(FIELD, "h-[150px] resize-none py-[14px]")}
        />
      </Field>

      {/* Honeypot: hidden from real visitors, but bots tend to fill it in. */}
      <div className="hidden" aria-hidden="true">
        <input name="company" aria-label="Company" tabIndex={-1} autoComplete="off" />
      </div>

      <div aria-live="polite" className="empty:hidden sm:col-span-2">
        {state?.success && (
          <p className="rounded-[8px] border-2 border-teal px-[16px] py-[10px] text-[14px] leading-[22px] text-navy">
            {form.success}
          </p>
        )}
        {state?.message && (
          <p
            role="alert"
            className="rounded-[8px] border-2 border-[#dc3232] px-[16px] py-[10px] text-[14px] leading-[22px] text-navy"
          >
            {state.message}
          </p>
        )}
      </div>

      <div className="mt-[13px] flex flex-wrap items-center gap-[20px] sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="h-[54px] w-full whitespace-nowrap rounded-[8px] bg-teal px-[30px] text-[16px] font-medium text-white transition-colors duration-300 hover:bg-teal-dark disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[204px]"
        >
          {pending ? "Sending…" : form.submit}
        </button>
      </div>
    </form>
  );
}

/** Visually hidden label, as the design relies on placeholders. */
function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="sr-only">{label}</span>
      {children}
      {error && <span className="mt-[6px] block text-[13px] leading-[18px] text-[#dc3232]">{error[0]}</span>}
    </label>
  );
}
