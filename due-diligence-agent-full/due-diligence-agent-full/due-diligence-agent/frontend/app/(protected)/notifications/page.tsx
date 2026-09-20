"use client";

import Card from "@/components/ui/Card";
import AsyncSection from "@/components/ui/AsyncSection";
import { useAsync } from "@/lib/hooks/useAsync";
import { notificationsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { status, data, error } = useAsync(
    () => notificationsApi.listByUser(user?.email),
    [user?.email]
  );
  const sorted = data ? [...data].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) : data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Notifications</h1>
        <p className="text-sm text-ink-muted">Your full notification history.</p>
      </div>

      <Card className="p-2">
        <AsyncSection
          status={status}
          error={error}
          data={sorted}
          isEmpty={(sorted?.length ?? 0) === 0}
          emptyTitle="No notifications yet"
          unavailableTitle="Notifications temporarily unavailable"
        >
          {(items) => (
            <ul className="divide-y divide-brass-soft">
              {items.map((n) => (
                <li key={n.id} className="flex items-start gap-3 px-3 py-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.read ? "bg-transparent" : "bg-steel"
                    }`}
                  />
                  <div>
                    <p className={n.read ? "text-sm text-ink-muted" : "text-sm font-medium text-ink"}>
                      {n.message}
                    </p>
                    <p className="text-xs text-ink-faint">{formatDateTime(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AsyncSection>
      </Card>
    </div>
  );
}
