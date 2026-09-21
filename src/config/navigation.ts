import type { Resource } from "@/lib/permissions";

export type NavItem = { label: string; href: string };

// Only routes that actually exist. Add an item back once its public page
// ships (e.g. Services/Projects once they get a public route, About once
// a "about" CMS Page is published and linked here).
export const publicNavigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export type AdminNavItem = { label: string; href: string; resource: Resource };

// `resource` maps to lib/permissions.ts so the admin layout can filter this
// list down to what the signed-in user's role is actually allowed to see.
export const adminNavigation: AdminNavItem[] = [
  { label: "Blog", href: "/admin/blog", resource: "blog" },
  { label: "Testimonials", href: "/admin/testimonials", resource: "testimonials" },
  { label: "Enquiries", href: "/admin/enquiries", resource: "enquiries" },
  { label: "Media", href: "/admin/media", resource: "media" },
  { label: "Settings", href: "/admin/settings", resource: "settings" }
];
// export const adminNavigation: AdminNavItem[] = [
//   { label: "Pages", href: "/admin/pages", resource: "pages" },
//   { label: "Services", href: "/admin/services", resource: "services" },
//   { label: "Projects", href: "/admin/projects", resource: "projects" },
//   { label: "Blog", href: "/admin/blog", resource: "blog" },
//   { label: "Categories", href: "/admin/categories", resource: "categories" },
//   { label: "Tags", href: "/admin/tags", resource: "tags" },
//   { label: "FAQs", href: "/admin/faqs", resource: "faqs" },
//   { label: "Testimonials", href: "/admin/testimonials", resource: "testimonials" },
//   { label: "Team", href: "/admin/team", resource: "team" },
//   { label: "Media", href: "/admin/media", resource: "media" },
//   { label: "Enquiries", href: "/admin/enquiries", resource: "enquiries" },
//   { label: "Users", href: "/admin/users", resource: "users" },
//   { label: "Redirects", href: "/admin/redirects", resource: "redirects" },
//   { label: "Settings", href: "/admin/settings", resource: "settings" },
//   { label: "Audit Logs", href: "/admin/audit-logs", resource: "auditLogs" },
// ];
