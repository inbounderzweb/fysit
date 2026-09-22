import type { Metadata } from "next";
import { getPageStats } from "@/services/page.service";
import { listRecentAuditLogs } from "@/services/audit.service";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [stats, recentActivity] = await Promise.all([getPageStats(), listRecentAuditLogs(10)]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Published Pages" value={stats.published} />
        <StatCard label="Draft Pages" value={stats.draft} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-medium text-neutral-900">Recent Activity</h2>
        <ul className="divide-y divide-neutral-200 rounded border border-neutral-200 bg-white">
          {recentActivity.length === 0 && (
            <li className="p-4 text-sm text-neutral-500">No activity yet.</li>
          )}
          {recentActivity.map((entry) => (
            <li key={entry._id.toString()} className="flex items-center justify-between p-4 text-sm">
              <span>
                <span className="font-medium">{entry.action}</span> on {entry.entity}
              </span>
              <span className="text-neutral-500">{new Date(entry.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-neutral-200 bg-white p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
