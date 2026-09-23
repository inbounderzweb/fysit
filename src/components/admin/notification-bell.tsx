"use client";

import { useState } from "react";
import { BellIcon } from "@/components/admin/icons";

export type ActivityItem = { id: string; action: string; entity: string; createdAt: string };

function describe(item: ActivityItem): string {
  const entity = item.entity.replace(/([A-Z])/g, " $1").trim();
  const verbs: Record<string, string> = {
    CREATE: "created",
    UPDATE: "updated",
    DELETE: "deleted",
    PUBLISH: "published",
    UNPUBLISH: "unpublished",
    ARCHIVE: "archived",
    LOGIN: "signed in",
    LOGOUT: "signed out",
    LOGIN_FAILED: "failed to sign in",
    MEDIA_UPLOAD: "uploaded",
    MEDIA_DELETE: "deleted",
  };
  return `${entity} ${verbs[item.action] ?? item.action.toLowerCase()}`;
}

export function NotificationBell({ activity }: { activity: ActivityItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  // Lazy initializer: runs once on mount rather than on every render.
  const [dayAgo] = useState(() => Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = activity.filter((item) => new Date(item.createdAt).getTime() >= dayAgo).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Recent activity"
        aria-expanded={isOpen}
        className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
      >
        <BellIcon className="h-5 w-5" />
        {recentCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-neutral-200 bg-white shadow-lg">
            <div className="border-b border-neutral-100 p-3">
              <p className="text-sm font-semibold text-neutral-900">Recent Activity</p>
            </div>
            {activity.length === 0 ? (
              <p className="p-4 text-sm text-neutral-500">No recent activity.</p>
            ) : (
              <ul className="max-h-80 divide-y divide-neutral-100 overflow-y-auto">
                {activity.map((item) => (
                  <li key={item.id} className="p-3 text-sm">
                    <p className="text-neutral-900">{describe(item)}</p>
                    <p className="text-xs text-neutral-400">{new Date(item.createdAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
