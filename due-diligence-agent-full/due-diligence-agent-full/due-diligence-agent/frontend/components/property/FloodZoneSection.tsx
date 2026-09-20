import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { ddSectionStatus, type OverallStatus } from "@/lib/dd-section-status";
import { formatDateTime } from "@/lib/utils";
import type { FloodZoneInfo, ReportSection } from "@/lib/types";

export default function FloodZoneSection({
  overallStatus,
  overallError,
  section,
}: {
  overallStatus: OverallStatus;
  overallError?: string | null;
  section?: ReportSection<FloodZoneInfo> | null;
}) {
  const { status, error } = ddSectionStatus(overallStatus, overallError, section);

  return (
    <SectionCard title="Flood Zone Verification">
      <AsyncSection
        status={status}
        error={error}
        data={section?.data ?? undefined}
        emptyTitle="No flood zone data on file"
        unavailableTitle="Flood zone data temporarily unavailable"
      >
        {(f) => (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-4">
              <Badge tone={f.inSpecialFloodHazardArea ? "bad" : "good"}>
                {f.inSpecialFloodHazardArea ? "High flood risk" : "Low flood risk"}
              </Badge>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Flood zone</dt>
              <dd className="font-medium text-ink">
                {f.floodZone || "—"}
                {f.floodZoneSubtype ? ` (${f.floodZoneSubtype})` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">FIRM panel</dt>
              <dd className="font-medium text-ink">{f.firmPanel || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Panel effective date</dt>
              <dd className="font-medium text-ink">{f.firmPanelEffectiveDate || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Elevation</dt>
              <dd className="font-medium text-ink">
                {f.elevationFeet != null ? `${f.elevationFeet.toFixed(1)} ft` : "—"}
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-4">
              <dt className="text-xs text-ink-faint">Checked</dt>
              <dd className="text-ink-muted">{formatDateTime(f.checkedAt)}</dd>
            </div>
          </dl>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
