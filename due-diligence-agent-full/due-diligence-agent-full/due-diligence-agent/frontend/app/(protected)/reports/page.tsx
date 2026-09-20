"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import AsyncSection from "@/components/ui/AsyncSection";
import { useAsync } from "@/lib/hooks/useAsync";
import { reportRequestsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function ReportHistoryPage() {
  const { status, data, error } = useAsync(() => reportRequestsApi.listMine(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Report History</h1>
        <p className="text-sm text-ink-muted">Track approval and access for every report request.</p>
      </div>

      <Card className="p-2">
        <AsyncSection
          status={status}
          error={error}
          data={data}
          isEmpty={(data?.length ?? 0) === 0}
          emptyTitle="No report requests yet"
          unavailableTitle="Report requests temporarily unavailable"
        >
          {(reports) => (
            <ul className="divide-y divide-brass-soft">
              {reports.map((r) => (
                <li key={r.requestId} className="flex items-center justify-between gap-3 px-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{r.propertyAddress}</p>
                      <p className="text-xs text-ink-muted">{r.propertyCity}, {r.propertyState} · Requested {formatDate(r.requestedAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-ink-muted">
                        {r.requestStatus}{r.reportStatus ? ` · ${r.reportStatus}` : ""}
                      </span>
                      {r.riskScore != null && <span className="text-sm font-semibold text-ink">Risk {r.riskScore}</span>}
                      {r.reportId != null && r.reportStatus === "COMPLETED" && (
                        <Link href={`/reports/${r.reportId}`} className="text-sm font-medium text-brass hover:underline">
                          View report
                        </Link>
                      )}
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
