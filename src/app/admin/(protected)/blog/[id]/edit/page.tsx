import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostByIdAdmin } from "@/services/blog.service";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { BlogForm, type BlogFormDefaults } from "../../blog-form";
import { updateBlogPostAction, setBlogPostStatusAction } from "../../actions";

export const metadata: Metadata = { title: "Edit Blog Post" };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, post] = await Promise.all([getCurrentUser(), getBlogPostByIdAdmin(id)]);

  if (!post) {
    notFound();
  }

  const boundUpdate = updateBlogPostAction.bind(null, id);
  const canPublish = can(user.role, "publish", "blog");

  const featuredImage =
    post.featuredImage && typeof post.featuredImage === "object" && "secureUrl" in post.featuredImage
      ? JSON.parse(JSON.stringify(post.featuredImage))
      : null;

  const defaultValues: BlogFormDefaults = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content,
    featuredImage,
    status: post.status,
    seo: post.seo
      ? {
          title: post.seo.title ?? undefined,
          description: post.seo.description ?? undefined,
          canonical: post.seo.canonical ?? undefined,
          keywords: post.seo.keywords ?? undefined,
          ogImage: post.seo.ogImage ?? undefined,
        }
      : undefined,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Edit Blog Post</h1>
        {canPublish && (
          <div className="flex gap-2">
            {post.status !== "PUBLISHED" && (
              <form action={setBlogPostStatusAction.bind(null, id, "PUBLISHED")}>
                <button type="submit" className="rounded bg-green-600 px-3 py-1.5 text-sm text-white">
                  Publish
                </button>
              </form>
            )}
            {post.status === "PUBLISHED" && (
              <form action={setBlogPostStatusAction.bind(null, id, "DRAFT")}>
                <button type="submit" className="rounded bg-yellow-600 px-3 py-1.5 text-sm text-white">
                  Unpublish
                </button>
              </form>
            )}
            {post.status !== "ARCHIVED" && (
              <form action={setBlogPostStatusAction.bind(null, id, "ARCHIVED")}>
                <button type="submit" className="rounded bg-neutral-600 px-3 py-1.5 text-sm text-white">
                  Archive
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <BlogForm action={boundUpdate} submitLabel="Save Changes" defaultValues={defaultValues} />
    </div>
  );
}
