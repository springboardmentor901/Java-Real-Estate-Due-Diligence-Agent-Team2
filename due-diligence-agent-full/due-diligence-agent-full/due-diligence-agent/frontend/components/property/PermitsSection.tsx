import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { ddSectionStatus, type OverallStatus } from "@/lib/dd-section-status";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Permit, ReportSection } from "@/lib/types";

function permitTone(status: string | null): "good" | "warn" | "neutral" {
  if (!status) return "neutral";
  const s = status.toUpperCase();
  if (s.includes("FINAL") || s.includes("APPROVED") || s.includes("CLOSED")) return "good";
  if (s.includes("OPEN") || s.includes("PENDING") || s.includes("EXPIRED")) return "warn";
  return "neutral";
}

export default function PermitsSection({
  overallStatus,
  overallError,
  section,
}: {
  overallStatus: OverallStatus;
  overallError?: string | null;
  section?: ReportSection<Permit[]> | null;
}) {
  const { status, error } = ddSectionStatus(overallStatus, overallError, section);

  return (
    <SectionCard title="Building Permit Records">
      <AsyncSection
        status={status}
        error={error}
        data={section?.data ?? undefined}
        isEmpty={(section?.data?.length ?? 0) === 0}
        emptyTitle="No permit records on file"
        unavailableTitle="Permit records temporarily unavailable"
      >
        {(permits) => (
          <ul className="divide-y divide-brass-soft">
            {permits.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {p.permitType || "Permit"} · {p.permitNumber || "—"}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {p.description || "No description"}
                    {p.contractorName ? ` · ${p.contractorName}` : ""}
                  </p>
                  <p className="text-xs text-ink-faint">
                    Issued {formatDate(p.issueDate)}
                    {p.expirationDate ? ` · Expires ${formatDate(p.expirationDate)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-muted">{formatCurrency(p.estimatedCost)}</span>
                  <Badge tone={permitTone(p.status)}>{p.status || "Unknown"}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
