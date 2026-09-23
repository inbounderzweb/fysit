"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminNavItem } from "@/config/navigation";
import type { SafeUser } from "@/lib/dal";
import { GlobalSearch } from "@/components/admin/global-search";
import { NotificationBell, type ActivityItem } from "@/components/admin/notification-bell";
import { UserMenu } from "@/components/admin/user-menu";
import {
  HomeIcon,
  DocumentIcon,
  ChatIcon,
  MailIcon,
  ImageIcon,
  GearIcon,
  ExternalLinkIcon,
  LeafIcon,
  ChevronRightIcon,
  MenuIcon,
} from "@/components/admin/icons";

const NAV_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  blog: DocumentIcon,
  testimonials: ChatIcon,
  enquiries: MailIcon,
  media: ImageIcon,
  settings: GearIcon,
};

export function AdminShell({
  user,
  visibleNav,
  logoutAction,
  recentActivity,
  children,
}: {
  user: SafeUser;
  visibleNav: AdminNavItem[];
  logoutAction: () => void;
  recentActivity: ActivityItem[];
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <p className="font-semibold text-neutral-900">Fysit Admin</p>
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMobileOpen}
          className="rounded p-2 text-neutral-600 hover:bg-neutral-100"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex -translate-x-full flex-col border-r border-neutral-200 bg-white transition-all duration-200 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : ""
        } ${isCollapsed ? "lg:w-20" : "w-64"}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-neutral-100 p-4">
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate font-semibold text-neutral-900">The Fysit</p>
              <p className="truncate text-xs text-teal-600">Wellness Simplified</p>
            </div>
          )}
          {isCollapsed && (
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-indigo-600 text-sm font-bold text-white">
              F
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {!isCollapsed && <p className="px-2 pb-1 text-xs font-semibold tracking-wide text-neutral-400">MAIN</p>}

          <NavLink
            href="/admin/dashboard"
            icon={HomeIcon}
            label="Dashboard"
            collapsed={isCollapsed}
            active={pathname === "/admin/dashboard"}
            onNavigate={() => setIsMobileOpen(false)}
          />
          {visibleNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={NAV_ICONS[item.resource] ?? DocumentIcon}
              label={item.label}
              collapsed={isCollapsed}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              onNavigate={() => setIsMobileOpen(false)}
            />
          ))}

          <div className="my-2 border-t border-neutral-100" />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            <ExternalLinkIcon className="h-5 w-5 shrink-0" />
            {!isCollapsed && "View Website"}
          </a>
        </nav>

        {!isCollapsed && (
          <div className="m-3 rounded-xl bg-teal-50 p-3">
            <LeafIcon className="h-5 w-5 text-teal-600" />
            <p className="mt-2 text-sm font-semibold text-neutral-900">Help &amp; Support</p>
            <p className="mt-1 text-xs text-neutral-500">Need help? Check our documentation or contact support.</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="hidden items-center gap-2 border-t border-neutral-100 px-4 py-3 text-sm text-neutral-500 hover:bg-neutral-50 lg:flex"
        >
          <ChevronRightIcon className={`h-4 w-4 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
          {!isCollapsed && "Collapse Menu"}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 hidden items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-3 lg:flex">
          <GlobalSearch />
          <div className="flex items-center gap-3">
            <NotificationBell activity={recentActivity} />
            <UserMenu user={user} logoutAction={logoutAction} />
          </div>
        </header>

        <main className="flex-1 p-4 pt-20 lg:p-6 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  collapsed: boolean;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
        active ? "bg-indigo-50 font-medium text-indigo-600" : "text-neutral-700 hover:bg-neutral-100"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && label}
    </Link>
  );
}
