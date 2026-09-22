import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Sets shared admin metadata (no-index), fonts, and the admin-only
// stylesheet (./globals.css, not loaded on public routes). Auth is enforced
// in the (protected) route group's layout, not here — this layout also
// wraps /admin/login, which must stay reachable when signed out.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </div>
  );
}
