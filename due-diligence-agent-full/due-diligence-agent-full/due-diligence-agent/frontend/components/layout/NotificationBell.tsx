"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { notificationsApi } from "@/lib/api";
import { usePolling } from "@/lib/hooks/usePolling";
import type { NotificationItem } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const POLL_INTERVAL_MS = 45_000;

/**
 * Header bell shown on every logged-in page (frontend spec section 4.7).
 * Polls the notifications endpoint periodically and shows a badge without
 * requiring the user to open the full notifications page.
 *
 * The /api/notifications endpoint isn't implemented on the backend yet, so
 * failures here are swallowed quietly rather than surfacing an error in
 * the header on every page.
 */
export default function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationsApi.listByUser(user.email);
      setItems(data);
      setAvailable(true);
    } catch {
      setAvailable(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  usePolling(load, POLL_INTERVAL_MS, !!user);

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-paper/70 hover:bg-white/10 hover:text-paper"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brick text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-md border border-line bg-surface shadow-[0_4px_16px_rgba(32,29,23,0.12)]">
          <div className="flex items-center justify-between border-b border-brass-soft px-4 py-2">
            <span className="text-sm font-semibold text-ink">Notifications</span>
            <Link
              href="/notifications"
              className="text-xs font-medium text-ink-muted hover:text-ink"
              onClick={() => setOpen(false)}
            >
              View all
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {!available ? (
              <p className="px-4 py-6 text-center text-sm text-ink-muted">
                Notifications aren&apos;t available right now.
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-muted">
                You&apos;re all caught up.
              </p>
            ) : (
              <ul className="divide-y divide-brass-soft">
                {items.slice(0, 6).map((n) => (
                  <li key={n.id} className="px-4 py-3 text-sm">
                    <p className={n.read ? "text-ink-muted" : "font-medium text-ink"}>
                      {n.message}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">{formatDateTime(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
