"use client";

import { useActionState } from "react";
import { login, type LoginFormState } from "./actions";

const initialState: LoginFormState = undefined;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={state?.errors?.email ? true : undefined}
          aria-describedby={state?.errors?.email ? "email-error" : undefined}
          className="rounded border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        {state?.errors?.email && (
          <p id="email-error" className="text-sm text-red-600">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state?.errors?.password ? true : undefined}
          aria-describedby={state?.errors?.password ? "password-error" : undefined}
          className="rounded border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        {state?.errors?.password && (
          <p id="password-error" className="text-sm text-red-600">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
