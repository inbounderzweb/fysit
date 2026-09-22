import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { can } from "@/lib/permissions";
import { adminNavigation } from "@/config/navigation";
import { logout } from "../actions";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const visibleNav = adminNavigation.filter((item) => can(user.role, "read", item.resource));

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="w-64 shrink-0 border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-4">
          <p className="font-semibold text-neutral-900">Fysit Admin</p>
          <p className="text-xs text-neutral-500">
            {user.name} · {user.role}
          </p>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <Link href="/admin/dashboard" className="rounded px-3 py-2 text-sm hover:bg-neutral-100">
            Dashboard
          </Link>
          {visibleNav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-sm hover:bg-neutral-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="p-2">
          <button type="submit" className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
