"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";

import { CONTACT_PAGE, DOCTORS, PHYSIO_SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";
import { submitEnquiryAction, type ContactFormState } from "./actions";

const initialState: ContactFormState = undefined;

/**
 * Sampled from the reference form: 50px fields, 1px #dcdcdc border, 8px
 * radius, 14px navy text and placeholder, turning teal on focus.
 */
const FIELD =
  "block h-[50px] w-full rounded-[8px] border bg-white px-[20px] py-[10px] text-[14px] leading-[26px] text-navy outline-none transition-colors duration-300 placeholder:text-navy focus:border-teal";

/** The reference's grey chevron, drawn 21px at 8px in from the right. */
const SELECT_ARROW = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")",
  backgroundPosition: "calc(100% - 8px) 50%",
  backgroundSize: "21px 21px",
  backgroundRepeat: "no-repeat",
} as const;

const DEPARTMENTS = PHYSIO_SERVICES.map((service) => service.title);
const DOCTOR_NAMES = DOCTORS.map((doctor) => doctor.name);

export function ContactForm() {
  const { form } = CONTACT_PAGE;
  const [state, formAction, pending] = useActionState(submitEnquiryAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Submitting through onSubmit rather than the `action` prop stops React
  // from clearing the fields after every attempt, so a visitor keeps what
  // they typed when validation fails. The form is cleared only on success.
  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  const errors = state?.errors;

  return (
    <form ref={formRef} onSubmit={handleSubmit} aria-label="Contact form" noValidate>
      <div className="grid grid-cols-1 gap-x-[24px] gap-y-[16px] md:grid-cols-2">
        <Field label={form.name} error={errors?.name}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.name}
            required
            maxLength={120}
            aria-invalid={Boolean(errors?.name)}
            className={fieldClass(errors?.name)}
          />
        </Field>

        <Field label={form.email} error={errors?.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.email}
            required
            aria-invalid={Boolean(errors?.email)}
            className={fieldClass(errors?.email)}
          />
        </Field>

        <Field label={form.phone} error={errors?.phone}>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={form.phone}
            aria-invalid={Boolean(errors?.phone)}
            className={fieldClass(errors?.phone)}
          />
        </Field>

        <Field label={form.department} error={errors?.department}>
          <select
            name="department"
            defaultValue=""
            aria-invalid={Boolean(errors?.department)}
            className={cn(fieldClass(errors?.department), "appearance-none rounded-[10px] pr-[36px]")}
            style={SELECT_ARROW}
          >
            <option value="">{form.department}</option>
            {DEPARTMENTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label={form.doctor} error={errors?.doctor}>
          <select
            name="doctor"
            defaultValue=""
            aria-invalid={Boolean(errors?.doctor)}
            className={cn(fieldClass(errors?.doctor), "appearance-none rounded-[10px] pr-[36px]")}
            style={SELECT_ARROW}
          >
            <option value="">{form.doctor}</option>
            {DOCTOR_NAMES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label={form.date} error={errors?.preferredDate}>
          <input
            name="preferredDate"
            type="date"
            aria-invalid={Boolean(errors?.preferredDate)}
            className={fieldClass(errors?.preferredDate)}
          />
        </Field>

        <Field label={form.message} error={errors?.message} className="md:col-span-2">
          <textarea
            name="message"
            rows={5}
            placeholder={form.message}
            required
            maxLength={2000}
            aria-invalid={Boolean(errors?.message)}
            className={cn(fieldClass(errors?.message), "h-[150px] resize-y")}
          />
        </Field>
      </div>

      {/* Honeypot: hidden from real visitors via CSS, not `type="hidden"`,
          so form-filling bots that skip hidden inputs still populate it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-[47px] flex flex-wrap items-center gap-[24px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[54px] rounded-[8px] bg-teal px-[30px] py-[14px] text-[16px] font-medium leading-[26px] text-white transition-colors duration-500 ease-in-out hover:bg-[#07112f] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Sending…" : form.submit}
        </button>
        {pending && (
          <span
            aria-hidden
            className="size-[24px] animate-spin rounded-full border-[3px] border-navy/20 border-t-navy"
          />
        )}
      </div>

      <div aria-live="polite">
        {state?.success && (
          <p className="mt-[24px] rounded-[8px] border-2 border-teal px-[16px] py-[10px] text-[14px] leading-[22px] text-navy">
            {form.success}
          </p>
        )}
        {state?.message && (
          <p
            role="alert"
            className="mt-[24px] rounded-[8px] border-2 border-[#dc3232] px-[16px] py-[10px] text-[14px] leading-[22px] text-navy"
          >
            {state.message}
          </p>
        )}
        {errors && !state?.message && (
          <p
            role="alert"
            className="mt-[24px] rounded-[8px] border-2 border-[#ffb900] px-[16px] py-[10px] text-[14px] leading-[22px] text-navy"
          >
            One or more fields have an error. Please check and try again.
          </p>
        )}
      </div>
    </form>
  );
}

function fieldClass(error?: string[]) {
  return cn(FIELD, error ? "border-[#dc3232]" : "border-[#dcdcdc]");
}

/** Visually hidden label, as the reference relies on placeholders. */
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
