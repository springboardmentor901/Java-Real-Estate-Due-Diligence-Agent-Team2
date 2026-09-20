"use client";

import Link from "next/link";
import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { useAsync } from "@/lib/hooks/useAsync";
import { reportsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatDate } from "@/lib/utils";

// Lenders review many loan applications at once and care about financial
// exposure specifically, so this is a dense table (not cards) keyed on
// risk score, tax status, and flood zone per the spec.
export default function FinancialInstitutionDashboard() {
  const { user } = useAuth();
  const { status, data, error } = useAsync(() => reportsApi.listByUser(user?.email), [user?.email]);

  const sorted = data
    ? [...data].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    : data;

  return (
    <SectionCard title="Portfolio risk overview">
      <AsyncSection
        status={status}
        error={error}
        data={sorted}
        isEmpty={(sorted?.length ?? 0) === 0}
        emptyTitle="No reports yet"
        unavailableTitle="Reports temporarily unavailable"
      >
        {(reports) => (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="pb-2 font-medium">Property</th>
                  <th className="pb-2 font-medium">Overall risk</th>
                  <th className="pb-2 font-medium">Tax status</th>
                  <th className="pb-2 font-medium">Flood zone</th>
                  <th className="pb-2 font-medium">Report date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brass-soft">
                {reports.map((r) => {
                  const tax = r.assessments.find((a) => a.category === "Tax Due Analysis");
                  const flood = r.assessments.find((a) => a.category === "Flood Risk Status");
                  return (
                    <tr key={r.reportId}>
                      <td className="py-2">
                        <Link
                          href={`/properties/${r.propertyId}`}
                          className="font-medium text-ink hover:underline"
                        >
                          Property #{r.propertyId}
                        </Link>
                      </td>
                      <td className="py-2">
                        <Badge tone={(r.riskScore ?? 0) >= 67 ? "bad" : (r.riskScore ?? 0) >= 34 ? "warn" : "good"}>
                          {r.riskScore ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-2 text-ink-muted">{tax?.indicator || "—"}</td>
                      <td className="py-2 text-ink-muted">{flood?.indicator || "—"}</td>
                      <td className="py-2 text-ink-muted">{formatDate(r.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
