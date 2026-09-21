import type { Metadata } from "next";
import { BlogForm } from "../blog-form";
import { createBlogPostAction } from "../actions";

export const metadata: Metadata = { title: "New Blog Post" };

export default function NewBlogPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">New Blog Post</h1>
      <BlogForm action={createBlogPostAction} submitLabel="Create Post" />
    </div>
  );
}
