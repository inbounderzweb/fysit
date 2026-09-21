import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPostsAdmin } from "@/services/blog.service";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { CONTENT_STATUSES, type ContentStatus } from "@/lib/constants";
import { deleteBlogPostAction } from "./actions";
import { asPopulatedMedia } from "@/types/media";
import { BlogImageViewer } from "./blog-image-viewer";

export const metadata: Metadata = { title: "Blog" };

function parseStatus(value: string | undefined): ContentStatus | undefined {
  return CONTENT_STATUSES.includes(value as ContentStatus) ? (value as ContentStatus) : undefined;
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const [user, result] = await Promise.all([
    getCurrentUser(),
    listBlogPostsAdmin({
      page: params.page,
      status: parseStatus(params.status),
      search: params.search,
    }),
  ]);

  const canCreate = can(user.role, "create", "blog");
  const canDelete = can(user.role, "delete", "blog");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Blog</h1>
        {canCreate && (
          <Link href="/admin/blog/new" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
            New Post
          </Link>
        )}
      </div>

      <form method="get" className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Search by title…"
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {CONTENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Image</th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Updated</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {result.items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-neutral-500">
                  No blog posts yet.
                </td>
              </tr>
            )}
            {result.items.map((item) => {
              const image = asPopulatedMedia(item.featuredImage);
              return (
              <tr key={item._id.toString()}>
                <td className="p-3">
                  <BlogImageViewer image={image ? { secureUrl: image.secureUrl, altText: image.altText } : null} title={item.title} />
                </td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3 text-neutral-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/blog/${item._id}/preview`} className="text-neutral-700 underline">
                      Preview
                    </Link>
                    <Link href={`/admin/blog/${item._id}/edit`} className="text-neutral-700 underline">
                      Edit
                    </Link>
                    {canDelete && (
                      <form action={deleteBlogPostAction.bind(null, item._id.toString())}>
                        <button type="submit" className="text-red-600 underline">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Page {result.page} of {result.pages} · {result.total} total
        </span>
        <div className="flex gap-2">
          {result.page > 1 && (
            <Link href={`/admin/blog?page=${result.page - 1}`} className="underline">
              Previous
            </Link>
          )}
          {result.page < result.pages && (
            <Link href={`/admin/blog?page=${result.page + 1}`} className="underline">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-yellow-100 text-yellow-800",
    ARCHIVED: "bg-neutral-200 text-neutral-700",
  };
  return <span className={`rounded px-2 py-1 text-xs font-medium ${colors[status] ?? ""}`}>{status}</span>;
}
