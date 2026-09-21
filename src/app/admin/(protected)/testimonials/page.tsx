import type { Metadata } from "next";
import Link from "next/link";
import { listTestimonialsAdmin } from "@/services/testimonial.service";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { deleteTestimonialAction, reorderTestimonialAction, setTestimonialStatusAction } from "./actions";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const [user, result] = await Promise.all([
    getCurrentUser(),
    listTestimonialsAdmin({ page: params.page, limit: 50 }),
  ]);

  const canCreate = can(user.role, "create", "testimonials");
  const canDelete = can(user.role, "delete", "testimonials");
  const canPublish = can(user.role, "publish", "testimonials");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Testimonials</h1>
        {canCreate && (
          <Link href="/admin/testimonials/new" className="rounded bg-neutral-900 px-4 py-2 text-sm text-white">
            Add Testimonial
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Order</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {result.items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-neutral-500">
                  No testimonials yet.
                </td>
              </tr>
            )}
            {result.items.map((item, index) => (
              <tr key={item._id.toString()}>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    {canPublish && index > 0 && (
                      <form action={reorderTestimonialAction.bind(null, item._id.toString(), "up")}>
                        <button type="submit" className="text-neutral-500 hover:text-neutral-800" aria-label="Move up">
                          ↑
                        </button>
                      </form>
                    )}
                    {canPublish && index < result.items.length - 1 && (
                      <form action={reorderTestimonialAction.bind(null, item._id.toString(), "down")}>
                        <button type="submit" className="text-neutral-500 hover:text-neutral-800" aria-label="Move down">
                          ↓
                        </button>
                      </form>
                    )}
                  </div>
                </td>
                <td className="p-3">{item.authorName}</td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/testimonials/${item._id}/edit`} className="text-neutral-700 underline">
                      Edit
                    </Link>
                    {canPublish && item.status !== "PUBLISHED" && (
                      <form action={setTestimonialStatusAction.bind(null, item._id.toString(), "PUBLISHED")}>
                        <button type="submit" className="text-green-700 underline">
                          Activate
                        </button>
                      </form>
                    )}
                    {canPublish && item.status === "PUBLISHED" && (
                      <form action={setTestimonialStatusAction.bind(null, item._id.toString(), "DRAFT")}>
                        <button type="submit" className="text-yellow-700 underline">
                          Deactivate
                        </button>
                      </form>
                    )}
                    {canDelete && (
                      <form action={deleteTestimonialAction.bind(null, item._id.toString())}>
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
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { PUBLISHED: "ACTIVE", DRAFT: "INACTIVE", ARCHIVED: "ARCHIVED" };
  const colors: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-800",
    DRAFT: "bg-yellow-100 text-yellow-800",
    ARCHIVED: "bg-neutral-200 text-neutral-700",
  };
  return (
    <span className={`rounded px-2 py-1 text-xs font-medium ${colors[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}
