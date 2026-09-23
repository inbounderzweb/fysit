import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEnquiryById } from "@/services/enquiry.service";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { setEnquiryStatusAction, deleteEnquiryAction } from "../actions";

export const metadata: Metadata = { title: "Enquiry Detail" };

const STATUS_LABELS: Record<string, string> = {
  NEW: "Mark as New",
  CONTACTED: "Mark as Contacted",
  IN_PROGRESS: "Mark as In Progress",
  RESOLVED: "Mark as Resolved",
  ARCHIVED: "Archive",
};

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, enquiry] = await Promise.all([getCurrentUser(), getEnquiryById(id)]);

  if (!enquiry) {
    notFound();
  }

  const canUpdate = can(user.role, "update", "enquiries");
  const canDelete = can(user.role, "delete", "enquiries");

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">{enquiry.subject || "Enquiry"}</h1>

      <dl className="grid grid-cols-[120px_1fr] gap-y-2 rounded border border-neutral-200 bg-white p-4 text-sm">
        <dt className="text-neutral-500">Name</dt>
        <dd className="text-neutral-900">{enquiry.name}</dd>
        <dt className="text-neutral-500">Email</dt>
        <dd>
          <a href={`mailto:${enquiry.email}`} className="text-indigo-600 underline">
            {enquiry.email}
          </a>
        </dd>
        <dt className="text-neutral-500">Phone</dt>
        <dd>
          {enquiry.phone ? (
            <a href={`tel:${enquiry.phone}`} className="text-indigo-600 underline">
              {enquiry.phone}
            </a>
          ) : (
            "—"
          )}
        </dd>
        <dt className="text-neutral-500">Status</dt>
        <dd className="text-neutral-900">{enquiry.status.replace("_", " ")}</dd>
        <dt className="text-neutral-500">Received</dt>
        <dd className="text-neutral-900">{new Date(enquiry.createdAt).toLocaleString()}</dd>
        <dt className="text-neutral-500">Message</dt>
        <dd className="whitespace-pre-wrap text-neutral-900">{enquiry.message}</dd>
      </dl>

      {canUpdate && (
        <div className="flex flex-wrap gap-2">
          {ENQUIRY_STATUSES.filter((status) => status !== enquiry.status).map((status) => (
            <form key={status} action={setEnquiryStatusAction.bind(null, id, status)}>
              <button
                type="submit"
                className="rounded border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                {STATUS_LABELS[status]}
              </button>
            </form>
          ))}
        </div>
      )}

      {canDelete && (
        <form action={deleteEnquiryAction.bind(null, id)}>
          <button type="submit" className="text-sm text-red-600 underline">
            Delete Enquiry
          </button>
        </form>
      )}
    </div>
  );
}
