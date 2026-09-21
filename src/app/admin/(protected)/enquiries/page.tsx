import type { Metadata } from "next";
import Link from "next/link";
import { listEnquiriesAdmin } from "@/services/enquiry.service";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "@/lib/constants";

export const metadata: Metadata = { title: "Enquiries" };

function parseStatus(value: string | undefined): EnquiryStatus | undefined {
  return ENQUIRY_STATUSES.includes(value as EnquiryStatus) ? (value as EnquiryStatus) : undefined;
}

export default async function EnquiriesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const result = await listEnquiriesAdmin({ page: params.page, status, search: params.search });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Enquiries</h1>

      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-2">
        <StatusTab href="/admin/enquiries" active={!status} label="All" />
        {ENQUIRY_STATUSES.map((s) => (
          <StatusTab key={s} href={`/admin/enquiries?status=${s}`} active={status === s} label={s.replace("_", " ")} />
        ))}
      </div>

      <form method="get" className="flex gap-3">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Search by name or email…"
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Subject</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {result.items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-neutral-500">
                  No enquiries found.
                </td>
              </tr>
            )}
            {result.items.map((item) => (
              <tr key={item._id.toString()} className="hover:bg-neutral-50">
                <td className="p-3">
                  <Link href={`/admin/enquiries/${item._id}`} className="text-neutral-900 underline">
                    {item.name}
                  </Link>
                </td>
                <td className="p-3 text-neutral-600">{item.email}</td>
                <td className="p-3 text-neutral-600">{item.subject || "—"}</td>
                <td className="p-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="p-3 text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</td>
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
            <Link href={`/admin/enquiries?page=${result.page - 1}${status ? `&status=${status}` : ""}`} className="underline">
              Previous
            </Link>
          )}
          {result.page < result.pages && (
            <Link href={`/admin/enquiries?page=${result.page + 1}${status ? `&status=${status}` : ""}`} className="underline">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-t px-3 py-1.5 text-sm font-medium ${
        active ? "border-b-2 border-indigo-600 text-indigo-600" : "text-neutral-500 hover:text-neutral-700"
      }`}
    >
      {label}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-neutral-200 text-neutral-700",
  };
  return (
    <span className={`rounded px-2 py-1 text-xs font-medium ${colors[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
