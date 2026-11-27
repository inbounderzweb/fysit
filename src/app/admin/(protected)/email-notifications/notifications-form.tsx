"use client";

import { startTransition, useActionState } from "react";
import { updateNotificationEmailsAction, type NotificationsFormState } from "./actions";
import { Card } from "@/components/admin/ui/card";
import { Field, FormFooter, FormSection, Input } from "@/components/admin/ui/form";
import { Alert } from "@/components/admin/ui/feedback";
import { buttonClasses } from "@/components/admin/ui/button";
import { ListEditor } from "@/components/admin/list-editor";
import { DEFAULT_NOTIFICATION_EMAIL, MAX_EXTRA_NOTIFICATION_EMAILS } from "@/lib/constants";

export function NotificationsForm({ emails }: { emails: string[] }) {
  const [state, formAction, pending] = useActionState<NotificationsFormState, FormData>(
    updateNotificationEmailsAction,
    undefined
  );

  // onSubmit rather than `action`, so the list stays as typed after an error.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <Card className="max-w-5xl">
      <form onSubmit={handleSubmit} noValidate>
        <FormSection title="Default address" description="Always notified.">
          <Field label="Default notification email" htmlFor="defaultEmail">
            <Input id="defaultEmail" value={DEFAULT_NOTIFICATION_EMAIL} readOnly disabled />
          </Field>
        </FormSection>

        <FormSection
          title="Additional addresses"
          description={`These get the same notification. Up to ${MAX_EXTRA_NOTIFICATION_EMAILS}; everyone listed can see the other addresses.`}
        >
          <ListEditor
            name="emails"
            asStrings
            fields={[{ key: "email", label: "Email address", placeholder: "name@example.com" }]}
            initial={emails.map((email) => ({ email }))}
            addLabel="Add email"
            emptyText="No additional addresses. Only the default address is notified."
            max={MAX_EXTRA_NOTIFICATION_EMAILS}
            invalid={Boolean(state?.error)}
          />
        </FormSection>

        <FormFooter>
          <div aria-live="polite" className="sm:mr-auto">
            {state?.success && <Alert tone="success">Notification addresses saved.</Alert>}
            {state?.error && <Alert tone="error">{state.error}</Alert>}
          </div>
          <button type="submit" disabled={pending} className={buttonClasses()}>
            {pending ? "Saving…" : "Save addresses"}
          </button>
        </FormFooter>
      </form>
    </Card>
  );
}
