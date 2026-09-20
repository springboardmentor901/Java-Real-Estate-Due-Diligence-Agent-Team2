"use client";

import Link from "next/link";
import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAsync } from "@/lib/hooks/useAsync";
import { reportsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { scoreTone } from "@/lib/utils";
import type { CompleteReport } from "@/lib/types";

function toneToBar(tone: ReturnType<typeof scoreTone>) {
  if (tone === "good") return "bg-forest";
  if (tone === "warn") return "bg-amber";
  if (tone === "bad") return "bg-brick";
  return "bg-line-strong";
}

export default function RiskDashboard({ propertyId }: { propertyId: number | string }) {
  const { user } = useAuth();

  // Risk scores live on a report, not on the property itself — so this
  // section first checks whether any report already exists for this
  // property before it can show anything (see frontend spec, section 4.4).
  const { status, data, error } = useAsync(
    () => reportsApi.listByUser(user?.email),
    [user?.email]
  );

  const latestReport: CompleteReport | undefined = data
    ?.filter((r) => String(r.propertyId) === String(propertyId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

  return (
    <SectionCard title="Risk Assessment">
      <AsyncSection
        status={status}
        error={error}
        data={data}
        unavailableTitle="Risk assessment temporarily unavailable"
      >
        {() =>
          !latestReport ? (
            <EmptyState
              title="No risk assessment yet"
              description="Request a due diligence report to see the risk assessment for this property."
              action={
                <Link href={`#request-report`}>
                  <Button size="sm" variant="secondary">
                    Jump to report request
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-md border border-line bg-paper px-4 py-3">
                <div>
                  <p className="text-xs text-ink-faint">Overall risk score</p>
                  <p className="text-2xl font-semibold text-ink">
                    {latestReport.riskScore ?? "—"}
                    <span className="text-sm font-normal text-ink-faint"> / 100</span>
                  </p>
                </div>
                <Link href={`/reports/${latestReport.reportId}`}>
                  <Button size="sm" variant="secondary">
                    View full report
                  </Button>
                </Link>
              </div>

              <ul className="space-y-3">
                {latestReport.assessments.map((a) => {
                  const tone = scoreTone(a.score);
                  return (
                    <li key={a.category}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-ink">{a.category}</span>
                        <Badge tone={tone}>{a.indicator}</Badge>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-brass-soft">
                        <div
                          className={`h-full ${toneToBar(tone)}`}
                          style={{ width: `${Math.min(100, Math.max(0, a.score))}%` }}
                        />
                      </div>
                      {a.notes && <p className="mt-1 text-xs text-ink-muted">{a.notes}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        }
      </AsyncSection>
    </SectionCard>
  );
}
