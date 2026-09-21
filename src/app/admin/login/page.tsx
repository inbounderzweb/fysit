import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

const FEATURES = [
  { title: "Manage Content", description: "Publish pages, services, and blog posts in one place." },
  { title: "Track Enquiries", description: "Respond to patient enquiries and appointment requests." },
  { title: "Role-Based Access", description: "Give your team exactly the access they need." },
];

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/login-page-cover-photo.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-[75%_center]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-indigo-950/85 via-indigo-950/40 to-indigo-950/10" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
          <Link href="/" className="w-fit text-sm text-white/80 hover:text-white">
            ← Back to home
          </Link>

          <div className="flex flex-col gap-8 text-white">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold xl:text-4xl">Manage The Fysit, All in One Place</h2>
              <p className="max-w-sm text-white/80">
                Sign in to your admin dashboard to keep the site, services, and patient enquiries up to date.
              </p>
            </div>

            <ul className="flex flex-col gap-5">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-linear-to-b from-indigo-50 via-white to-teal-50 px-4 py-10 sm:px-6 lg:w-1/2">
        <div className="w-full max-w-sm rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl shadow-indigo-100/50 sm:max-w-md sm:p-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <Logo />
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Login to Your Account</h1>
              <p className="text-sm text-neutral-500">Sign in to manage your site content.</p>
            </div>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>

          <Link
            href="/"
            className="mt-6 block text-center text-sm text-neutral-500 hover:text-neutral-700 lg:hidden"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m8 12.5 2.5 2.5 5.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
