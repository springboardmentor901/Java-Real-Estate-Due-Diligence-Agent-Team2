"use client";

import Link from "next/link";
import AsyncSection from "@/components/ui/AsyncSection";
import ReportStatusBadge from "@/components/report/ReportStatusBadge";
import { useAsync } from "@/lib/hooks/useAsync";
import { reportsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";

export default function RecentReportsList({ limit = 5 }: { limit?: number }) {
  const { user } = useAuth();
  const { status, data, error } = useAsync(() => reportsApi.listByUser(user?.email), [user?.email]);

  const sorted = data ? [...data].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) : data;

  return (
    <AsyncSection
      status={status}
      error={error}
      data={sorted}
      isEmpty={(sorted?.length ?? 0) === 0}
      emptyTitle="No reports requested yet"
      unavailableTitle="Reports temporarily unavailable"
    >
      {(reports) => (
        <ul className="divide-y divide-brass-soft">
          {reports.slice(0, limit).map((r) => (
            <li key={r.reportId} className="flex items-center justify-between gap-2 py-2.5 text-sm">
              <div>
                <Link
                  href={`/properties/${r.propertyId}`}
                  className="font-medium text-ink hover:underline"
                >
                  Property #{r.propertyId}
                </Link>
                <p className="text-xs text-ink-faint">{formatDate(r.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {r.riskScore != null && (
                  <span className="text-xs text-ink-muted">Risk {r.riskScore}</span>
                )}
                <Link href={`/reports/${r.reportId}`}>
                  <ReportStatusBadge status={r.status} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AsyncSection>
  );
}
