import type { Metadata } from "next";
import Link from "next/link";
import { listPagesAdmin } from "@/services/page.service";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { CONTENT_STATUSES, type ContentStatus } from "@/lib/constants";
import { deletePageAction } from "./actions";

export const metadata: Metadata = { title: "Pages" };

function parseStatus(value: string | undefined): ContentStatus | undefined {
  return CONTENT_STATUSES.includes(value as ContentStatus) ? (value as ContentStatus) : undefined;
}

export default async function PagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [user, result] = await Promise.all([
    getCurrentUser(),
    listPagesAdmin({
      page: params.page,
      status: parseStatus(params.status),
    }),
  ]);

  const canCreate = can(user.role, "create", "pages");
  const canDelete = can(user.role, "delete", "pages");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Pages</h1>
        {canCreate && (
          <Link href="/admin/pages/new" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
            New Page
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Updated</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {result.items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-neutral-500">
                  No pages yet.
                </td>
              </tr>
            )}
            {result.items.map((item) => (
              <tr key={item.id}>
                <td className="p-3">{item.title}</td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3 text-neutral-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/pages/${item.id}/edit`} className="text-neutral-700 underline">
                      Edit
                    </Link>
                    {canDelete && (
                      <form action={deletePageAction.bind(null, item.id)}>
                        <button type="submit" className="text-red-600 underline">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Page {result.page} of {result.pages} · {result.total} total
        </span>
        <div className="flex gap-2">
          {result.page > 1 && (
            <Link href={`/admin/pages?page=${result.page - 1}`} className="underline">
              Previous
            </Link>
          )}
          {result.page < result.pages && (
            <Link href={`/admin/pages?page=${result.page + 1}`} className="underline">
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
  return (
    <span className={`rounded px-2 py-1 text-xs font-medium ${colors[status] ?? ""}`}>{status}</span>
  );
}
