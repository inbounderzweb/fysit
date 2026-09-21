import Link from "next/link";
import { publicNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-semibold">
            {siteConfig.name}
          </Link>
          <nav aria-label="Primary" className="flex gap-6 text-sm">
            {publicNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </footer>
    </>
  );
}
