"use client";

import { useState } from "react";
import { ChevronDownIcon, LogOutIcon } from "@/components/admin/icons";
import type { SafeUser } from "@/lib/dal";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";
}

export function UserMenu({ user, logoutAction }: { user: SafeUser; logoutAction: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-neutral-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          {initials(user.name)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium text-neutral-900">{user.name}</span>
          <span className="block text-xs text-neutral-500">{user.role}</span>
        </span>
        <ChevronDownIcon className="h-4 w-4 text-neutral-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOutIcon className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
