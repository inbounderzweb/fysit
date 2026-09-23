import "server-only";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactEnquiry } from "@/models/ContactEnquiry";
import { getPagination, totalPages, startOfMonth, startOfDay } from "@/lib/utils";
import type { EnquiryStatus } from "@/lib/constants";
import type { EnquiryInput } from "@/validations/enquiry.schema";

export async function createEnquiry(input: Omit<EnquiryInput, "company">, ipAddress?: string) {
  await connectToDatabase();
  return ContactEnquiry.create({
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    subject: input.subject || undefined,
    message: input.message,
    ipAddress,
  });
}

export async function listEnquiriesAdmin(params: {
  page?: string | number;
  limit?: string | number;
  status?: EnquiryStatus;
  search?: string;
}) {
  await connectToDatabase();
  const { page, limit, skip } = getPagination(params);
  const filter: Record<string, unknown> = {};
  if (params.status) filter.status = params.status;
  if (params.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }

  const [items, count] = await Promise.all([
    ContactEnquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ContactEnquiry.countDocuments(filter),
  ]);

  return { items, page, limit, total: count, pages: totalPages(count, limit) };
}

export async function getEnquiryById(id: string) {
  await connectToDatabase();
  return ContactEnquiry.findById(id).lean();
}

export async function setEnquiryStatus(id: string, status: EnquiryStatus) {
  await connectToDatabase();
  return ContactEnquiry.findByIdAndUpdate(id, { status }, { new: true });
}

export async function deleteEnquiry(id: string) {
  await connectToDatabase();
  return ContactEnquiry.findByIdAndDelete(id);
}

export async function getEnquiryStats() {
  await connectToDatabase();
  const since = startOfMonth();
  const [newCount, total, totalThisMonth, newThisMonth] = await Promise.all([
    ContactEnquiry.countDocuments({ status: "NEW" }),
    ContactEnquiry.countDocuments(),
    ContactEnquiry.countDocuments({ createdAt: { $gte: since } }),
    ContactEnquiry.countDocuments({ status: "NEW", createdAt: { $gte: since } }),
  ]);
  return { new: newCount, total, totalThisMonth, newThisMonth };
}

export async function listRecentEnquiries(limit = 5) {
  await connectToDatabase();
  return ContactEnquiry.find().select("name subject status createdAt").sort({ createdAt: -1 }).limit(limit).lean();
}

/** Daily enquiry counts for the last `days` calendar days (oldest first), for the dashboard chart. */
export async function getEnquiryDailyCounts(days = 7): Promise<{ date: string; count: number }[]> {
  await connectToDatabase();
  const today = startOfDay(new Date());
  const rangeStart = new Date(today);
  rangeStart.setDate(rangeStart.getDate() - (days - 1));

  const rows = await ContactEnquiry.aggregate<{ _id: string; count: number }>([
    { $match: { createdAt: { $gte: rangeStart } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);
  const countsByDate = new Map(rows.map((row) => [row._id, row.count]));

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(rangeStart);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: countsByDate.get(key) ?? 0 };
  });
}
