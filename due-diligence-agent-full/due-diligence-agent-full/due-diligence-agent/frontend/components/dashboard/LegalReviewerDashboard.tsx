"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Select from "@/components/ui/Select";
import { useAsync } from "@/lib/hooks/useAsync";
import { reportsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";
import type { CompleteReport } from "@/lib/types";

const LEGAL_CATEGORIES = ["Legal Risk Indicators", "Ownership Verification"] as const;

function scoreFor(report: CompleteReport, category: string) {
  return report.assessments.find((a) => a.category === category)?.score;
}

// Legal reviewers care about legal exposure, not price — so this dashboard
// is organized entirely around the Legal Risk Indicators and Ownership
// Verification categories from the risk assessment, per the spec.
export default function LegalReviewerDashboard() {
  const { user } = useAuth();
  const { status, data, error } = useAsync(() => reportsApi.listByUser(user?.email), [user?.email]);
  const [sortBy, setSortBy] = useState<(typeof LEGAL_CATEGORIES)[number]>("Legal Risk Indicators");

  const sorted = useMemo(() => {
    if (!data) return data;
    return [...data].sort((a, b) => (scoreFor(b, sortBy) ?? 0) - (scoreFor(a, sortBy) ?? 0));
  }, [data, sortBy]);

  const flagged = useMemo(() => {
    if (!data) return [];
    return data.filter((r) =>
      r.assessments.some(
        (a) =>
          (a.category === "Zoning Compliance" && a.score >= 67) ||
          (a.category === "Ownership Verification" && a.score >= 67) ||
          (a.category === "Permit Compliance" && a.score >= 67)
      )
    );
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <SectionCard
        title="Reports by legal exposure"
        action={
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as (typeof LEGAL_CATEGORIES)[number])}
            className="text-xs"
          >
            {LEGAL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Sort by {c}
              </option>
            ))}
          </Select>
        }
      >
        <AsyncSection
          status={status}
          error={error}
          data={sorted}
          isEmpty={(sorted?.length ?? 0) === 0}
          emptyTitle="No reports yet"
          unavailableTitle="Reports temporarily unavailable"
        >
          {(reports) => (
            <ul className="divide-y divide-brass-soft">
              {reports.map((r) => (
                <li key={r.reportId} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                  <div>
                    <Link href={`/properties/${r.propertyId}`} className="font-medium text-ink hover:underline">
                      Property #{r.propertyId}
                    </Link>
                    <p className="text-xs text-ink-faint">{formatDate(r.createdAt)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {LEGAL_CATEGORIES.map((c) => {
                      const score = scoreFor(r, c);
                      return (
                        <Badge key={c} tone={score != null && score >= 67 ? "bad" : "neutral"}>
                          {c.split(" ")[0]}: {score ?? "—"}
                        </Badge>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AsyncSection>
      </SectionCard>

      <SectionCard title="Flagged properties">
        {status === "loading" ? (
          <p className="py-6 text-center text-sm text-ink-muted">Loading…</p>
        ) : flagged.length === 0 ? (
          <EmptyState
            title="Nothing flagged"
            description="Properties with zoning, ownership, or permit compliance issues will appear here automatically."
          />
        ) : (
          <ul className="divide-y divide-brass-soft">
            {flagged.map((r) => (
              <li key={r.reportId} className="py-2.5 text-sm">
                <Link href={`/properties/${r.propertyId}`} className="font-medium text-ink hover:underline">
                  Property #{r.propertyId}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {r.assessments
                    .filter(
                      (a) =>
                        ["Zoning Compliance", "Ownership Verification", "Permit Compliance"].includes(
                          a.category
                        ) && a.score >= 67
                    )
                    .map((a) => (
                      <Badge key={a.category} tone="bad">
                        {a.category}: {a.indicator}
                      </Badge>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
