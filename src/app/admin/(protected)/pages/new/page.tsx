import type { Metadata } from "next";
import { PageForm } from "../page-form";
import { createPageAction } from "../actions";

export const metadata: Metadata = { title: "New Page" };

export default function NewPagePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">New Page</h1>
      <PageForm action={createPageAction} submitLabel="Create Page" />
    </div>
  );
}
