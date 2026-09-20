import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { ddSectionStatus, type OverallStatus } from "@/lib/dd-section-status";
import type { EnvironmentalRecord, ReportSection } from "@/lib/types";

function riskTone(risk: string | null): "good" | "warn" | "bad" | "neutral" {
  if (!risk) return "neutral";
  const r = risk.toUpperCase();
  if (r.includes("HIGH")) return "bad";
  if (r.includes("MODERATE") || r.includes("MEDIUM")) return "warn";
  if (r.includes("LOW")) return "good";
  return "neutral";
}

export default function EnvironmentalSection({
  overallStatus,
  overallError,
  section,
}: {
  overallStatus: OverallStatus;
  overallError?: string | null;
  section?: ReportSection<EnvironmentalRecord[]> | null;
}) {
  const { status, error } = ddSectionStatus(overallStatus, overallError, section);

  return (
    <SectionCard title="Environmental Records">
      <AsyncSection
        status={status}
        error={error}
        data={section?.data ?? undefined}
        isEmpty={(section?.data?.length ?? 0) === 0}
        emptyTitle="No environmental records on file"
        unavailableTitle="Environmental records temporarily unavailable"
      >
        {(records) => (
          <ul className="divide-y divide-brass-soft">
            {records.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{r.facilityName || "Facility"}</p>
                  <p className="text-xs text-ink-muted">
                    {r.programName || "—"}
                    {r.interestType ? ` · ${r.interestType}` : ""}
                  </p>
                  <p className="text-xs text-ink-faint">Registry ID: {r.registryId || "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted">{r.siteStatus || ""}</span>
                  <Badge tone={riskTone(r.summaryRisk)}>{r.summaryRisk || "Unknown"}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
