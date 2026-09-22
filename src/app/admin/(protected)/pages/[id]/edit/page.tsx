import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageByIdAdmin } from "@/services/page.service";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { PageForm } from "../../page-form";
import { updatePageAction, setPageStatusAction } from "../../actions";

export const metadata: Metadata = { title: "Edit Page" };

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, page] = await Promise.all([getCurrentUser(), getPageByIdAdmin(id)]);

  if (!page) {
    notFound();
  }

  const boundUpdate = updatePageAction.bind(null, id);
  const canPublish = can(user.role, "publish", "pages");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Edit Page</h1>
        {canPublish && (
          <div className="flex gap-2">
            {page.status !== "PUBLISHED" && (
              <form action={setPageStatusAction.bind(null, id, "PUBLISHED")}>
                <button type="submit" className="rounded bg-green-600 px-3 py-1.5 text-sm text-white">
                  Publish
                </button>
              </form>
            )}
            {page.status === "PUBLISHED" && (
              <form action={setPageStatusAction.bind(null, id, "DRAFT")}>
                <button type="submit" className="rounded bg-yellow-600 px-3 py-1.5 text-sm text-white">
                  Unpublish
                </button>
              </form>
            )}
            {page.status !== "ARCHIVED" && (
              <form action={setPageStatusAction.bind(null, id, "ARCHIVED")}>
                <button type="submit" className="rounded bg-neutral-600 px-3 py-1.5 text-sm text-white">
                  Archive
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <PageForm
        action={boundUpdate}
        submitLabel="Save Changes"
        defaultValues={{
          title: page.title,
          slug: page.slug,
          content: page.content,
          excerpt: page.excerpt ?? undefined,
          featuredImage: page.featuredImage ?? undefined,
          status: page.status,
          seo: page.seo
            ? {
                title: page.seo.title ?? undefined,
                description: page.seo.description ?? undefined,
                canonical: page.seo.canonical ?? undefined,
                keywords: page.seo.keywords ?? undefined,
                ogImage: page.seo.ogImage ?? undefined,
              }
            : undefined,
        }}
      />
    </div>
  );
}
