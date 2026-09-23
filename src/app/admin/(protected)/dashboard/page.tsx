import type { Metadata } from "next";
import Link from "next/link";
import { getPageStats } from "@/services/page.service";
import { getBlogStats, listRecentBlogPosts } from "@/services/blog.service";
import { getTestimonialStats } from "@/services/testimonial.service";
import { getEnquiryStats, listRecentEnquiries, getEnquiryDailyCounts } from "@/services/enquiry.service";
import { getMediaStats } from "@/services/media.service";
import { listRecentAuditLogs } from "@/services/audit.service";
import { StatTile } from "@/components/admin/stat-tile";
import { EnquiriesChart } from "@/components/admin/enquiries-chart";
import { asPopulatedMedia } from "@/types/media";
import {
  DocumentIcon,
  ChatIcon,
  PeopleIcon,
  MailIcon,
  ChartIcon,
  ImageIcon,
  LeafIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  UploadIcon,
  GearIcon,
  ClockIcon,
} from "@/components/admin/icons";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [
    pageStats,
    blogStats,
    testimonialStats,
    enquiryStats,
    mediaStats,
    dailyEnquiries,
    recentBlogPosts,
    recentEnquiries,
    recentActivity,
  ] = await Promise.all([
    getPageStats(),
    getBlogStats(),
    getTestimonialStats(),
    getEnquiryStats(),
    getMediaStats(),
    getEnquiryDailyCounts(7),
    listRecentBlogPosts(4),
    listRecentEnquiries(4),
    listRecentAuditLogs(8),
  ]);

  const rangeStart = new Date(dailyEnquiries[0].date);
  const rangeEnd = new Date(dailyEnquiries[dailyEnquiries.length - 1].date);
  const rangeLabel = `${rangeStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${rangeEnd.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500">Welcome back! Here&apos;s what&apos;s happening with your website.</p>
        </div>
        <span className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600">
          {rangeLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile icon={DocumentIcon} label="Published Pages" value={pageStats.published} delta={pageStats.publishedThisMonth} color="indigo" />
        <StatTile icon={DocumentIcon} label="Draft Pages" value={pageStats.draft} delta={pageStats.draftThisMonth} color="neutral" />
        <StatTile icon={DocumentIcon} label="Blog Posts" value={blogStats.total} delta={blogStats.totalThisMonth} color="green" />
        <StatTile icon={ChatIcon} label="Published Posts" value={blogStats.published} delta={blogStats.publishedThisMonth} color="blue" />

        <StatTile icon={LeafIcon} label="Testimonials" value={testimonialStats.total} delta={testimonialStats.totalThisMonth} color="yellow" />
        <StatTile icon={PeopleIcon} label="Active Testimonials" value={testimonialStats.active} delta={testimonialStats.activeThisMonth} color="pink" />
        <StatTile icon={MailIcon} label="New Enquiries" value={enquiryStats.new} delta={enquiryStats.newThisMonth} color="indigo" />
        <StatTile icon={ChartIcon} label="Total Enquiries" value={enquiryStats.total} delta={enquiryStats.totalThisMonth} color="teal" />

        <StatTile icon={ImageIcon} label="Total Media" value={mediaStats.total} delta={mediaStats.totalThisMonth} color="blue" />

        <div className="col-span-2 flex items-center justify-between gap-4 rounded-2xl bg-linear-to-br from-indigo-50 to-teal-50 p-5 sm:col-span-2 lg:col-span-3">
          <div className="flex items-center gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white sm:flex">
              <LeafIcon className="h-6 w-6 text-teal-600" />
            </span>
            <div>
              <p className="font-semibold text-neutral-900">Keep your content fresh</p>
              <p className="text-sm text-neutral-600">Publish new blog posts, update your services, and share patient success stories.</p>
            </div>
          </div>
          <Link
            href="/admin/blog/new"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create New Post
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <ChartIcon className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="font-semibold text-neutral-900">Enquiries Overview</p>
              <p className="text-xs text-neutral-500">New enquiries received in the last 7 days</p>
            </div>
          </div>
          <EnquiriesChart data={dailyEnquiries} />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="mb-1 font-semibold text-neutral-900">Quick Actions</p>
          <p className="mb-4 text-xs text-neutral-500">Common tasks</p>
          <div className="flex flex-col gap-2">
            <QuickAction href="/admin/blog/new" icon={DocumentIcon} label="Create New Blog Post" />
            <QuickAction href="/admin/testimonials/new" icon={LeafIcon} label="Add Testimonial" />
            <QuickAction href="/admin/enquiries" icon={MailIcon} label="View Enquiries" />
            <QuickAction href="/admin/media" icon={UploadIcon} label="Upload Media" />
            {/* <QuickAction href="/admin/pages" icon={DocumentIcon} label="Manage Pages" /> */}
            <QuickAction href="/admin/settings" icon={GearIcon} label="Update Settings" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-neutral-900">Recent Blog Posts</p>
            <Link href="/admin/blog" className="text-sm text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {recentBlogPosts.length === 0 && <li className="text-sm text-neutral-500">No posts yet.</li>}
            {recentBlogPosts.map((post) => {
              const image = asPopulatedMedia(post.featuredImage);
              return (
                <li key={post._id.toString()}>
                  <Link href={`/admin/blog/${post._id}/edit`} className="flex items-center gap-3">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- small admin list thumbnail
                      <img src={image.secureUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                        <DocumentIcon className="h-5 w-5 text-neutral-400" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{post.title}</p>
                      <span
                        className={`text-xs ${post.status === "PUBLISHED" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-neutral-900">Recent Enquiries</p>
            <Link href="/admin/enquiries" className="text-sm text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {recentEnquiries.length === 0 && <li className="text-sm text-neutral-500">No enquiries yet.</li>}
            {recentEnquiries.map((enquiry) => (
              <li key={enquiry._id.toString()}>
                <Link href={`/admin/enquiries/${enquiry._id}`} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                    {initials(enquiry.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{enquiry.name}</p>
                    <p className="truncate text-xs text-neutral-500">{enquiry.subject || "No subject"}</p>
                  </div>
                  <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                    {enquiry.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-neutral-900">Recent Activity</p>
          </div>
          <ul className="flex flex-col gap-3">
            {recentActivity.length === 0 && <li className="text-sm text-neutral-500">No activity yet.</li>}
            {recentActivity.map((entry) => (
              <li key={entry._id.toString()} className="flex items-start gap-2">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300" />
                <div className="min-w-0">
                  <p className="text-sm text-neutral-900">
                    <span className="font-medium">{entry.action}</span> on {entry.entity}
                  </p>
                  <p className="text-xs text-neutral-400">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm hover:bg-neutral-50"
    >
      <span className="flex items-center gap-2 text-neutral-700">
        <Icon className="h-4 w-4 text-neutral-400" />
        {label}
      </span>
      <ChevronRightIcon className="h-4 w-4 text-neutral-300" />
    </Link>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}
