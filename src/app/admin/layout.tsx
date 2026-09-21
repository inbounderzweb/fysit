import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Intentionally thin: only sets shared admin metadata (no-index). Auth is
// enforced in the (protected) route group's layout, not here — this layout
// also wraps /admin/login, which must stay reachable when signed out.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
