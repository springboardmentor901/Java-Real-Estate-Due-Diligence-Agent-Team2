import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { ddSectionStatus, type OverallStatus } from "@/lib/dd-section-status";
import { formatCurrency } from "@/lib/utils";
import type { ReportSection, TaxHistoryRecord } from "@/lib/types";

export default function TaxHistorySection({
  overallStatus,
  overallError,
  section,
}: {
  overallStatus: OverallStatus;
  overallError?: string | null;
  section?: ReportSection<TaxHistoryRecord[]> | null;
}) {
  const { status, error } = ddSectionStatus(overallStatus, overallError, section);

  return (
    <SectionCard title="Property Tax History">
      <AsyncSection
        status={status}
        error={error}
        data={section?.data ?? undefined}
        isEmpty={(section?.data?.length ?? 0) === 0}
        emptyTitle="No tax history on file"
        unavailableTitle="Tax history temporarily unavailable"
      >
        {(records) => (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="pb-2 font-medium">Year</th>
                <th className="pb-2 font-medium">Assessed value</th>
                <th className="pb-2 font-medium">Market value</th>
                <th className="pb-2 font-medium text-right">Tax amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brass-soft">
              {[...records]
                .sort((a, b) => (b.taxYear || 0) - (a.taxYear || 0))
                .map((r) => {
                  const overdue = !r.taxAmount || r.taxAmount <= 0;
                  return (
                    <tr key={r.id}>
                      <td className="py-2 font-medium text-ink">{r.taxYear}</td>
                      <td className="py-2 text-ink-muted">{formatCurrency(r.assessedValue)}</td>
                      <td className="py-2 text-ink-muted">{formatCurrency(r.marketValue)}</td>
                      <td className="py-2 text-right">
                        {overdue ? (
                          <Badge tone="bad">Unpaid / overdue</Badge>
                        ) : (
                          <span className="font-medium text-ink">
                            {formatCurrency(r.taxAmount)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
