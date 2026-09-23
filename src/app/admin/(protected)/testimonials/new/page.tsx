import type { Metadata } from "next";
import { TestimonialForm } from "../testimonial-form";
import { createTestimonialAction } from "../actions";

export const metadata: Metadata = { title: "Add Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Add Testimonial</h1>
      <TestimonialForm action={createTestimonialAction} submitLabel="Create Testimonial" />
    </div>
  );
}
