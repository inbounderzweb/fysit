import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { getBlogPostByIdAdmin } from "@/services/blog.service";
import { asPopulatedMedia } from "@/types/media";
import { BlogImageViewer } from "../../blog-image-viewer";

export const metadata: Metadata = {
  title: "Preview Blog Post",
  robots: { index: false, follow: false },
};

export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!can(user.role, "read", "blog")) notFound();

  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  const post = await getBlogPostByIdAdmin(id);
  if (!post) notFound();
  const image = asPopulatedMedia(post.featuredImage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/blog" className="text-sm text-neutral-700 underline">Back to blog list</Link>
        {can(user.role, "update", "blog") && (
          <Link href={`/admin/blog/${id}/edit`} className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">Edit Post</Link>
        )}
      </div>
      <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Admin preview · {post.status} · This shows the saved version of the post.
      </div>
      <article className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-neutral-900">{post.title}</h1>
          <p className="text-sm text-neutral-500">
            {post.publishedAt ? `Published ${new Date(post.publishedAt).toLocaleDateString()}` : "Not published"}
            {post.readingTime ? ` · ${post.readingTime} min read` : ""}
          </p>
          {post.excerpt && <p className="text-neutral-600">{post.excerpt}</p>}
        </header>
        {image && <BlogImageViewer image={{ secureUrl: image.secureUrl, altText: image.altText }} title={post.title} large />}
        {/* Matches public rendering of HTML authored by authenticated blog editors. */}
        <div className="prose prose-neutral max-w-none break-words" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </div>
  );
}
