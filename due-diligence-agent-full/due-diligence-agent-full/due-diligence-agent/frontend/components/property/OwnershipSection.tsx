import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { ddSectionStatus, type OverallStatus } from "@/lib/dd-section-status";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OwnershipRecord, ReportSection } from "@/lib/types";

export default function OwnershipSection({
  overallStatus,
  overallError,
  section,
}: {
  overallStatus: OverallStatus;
  overallError?: string | null;
  section?: ReportSection<OwnershipRecord[]> | null;
}) {
  const { status, error } = ddSectionStatus(overallStatus, overallError, section);

  return (
    <SectionCard title="Ownership Records">
      <AsyncSection
        status={status}
        error={error}
        data={section?.data ?? undefined}
        isEmpty={(section?.data?.length ?? 0) === 0}
        emptyTitle="No ownership records on file"
        unavailableTitle="Ownership records temporarily unavailable"
      >
        {(records) => (
          <ul className="divide-y divide-brass-soft">
            {records.map((r) => {
              const multipleOwners = !!r.secondOwnerName;
              return (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {r.ownerName}
                      {multipleOwners && <span className="text-ink-muted"> &amp; {r.secondOwnerName}</span>}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {r.ownershipType || "Ownership type unknown"}
                      {r.mailingAddress ? ` · ${r.mailingAddress}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <p className="text-sm text-ink">{formatCurrency(r.saleAmount)}</p>
                      <p className="text-xs text-ink-muted">{formatDate(r.saleDate)}</p>
                    </div>
                    {multipleOwners && <Badge tone="warn">Multiple owners</Badge>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
