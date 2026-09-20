import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Badge from "@/components/ui/Badge";
import { ddSectionStatus, type OverallStatus } from "@/lib/dd-section-status";
import type { ReportSection, ZoningInfo } from "@/lib/types";

const RESIDENTIAL_HINTS = ["RESIDENTIAL", "RES", "R-"];

function looksCompliant(z: ZoningInfo): boolean {
  // The backend doesn't return an explicit compliance flag for zoning, so
  // we infer a simple indicator from land use vs. zoning code as a
  // best-effort signal. Swap this for a real field the moment the backend
  // exposes one.
  if (!z.landUse || !z.zoningCode) return true;
  const landUse = z.landUse.toUpperCase();
  const isResidentialZone = RESIDENTIAL_HINTS.some((h) => z.zoningCode!.toUpperCase().includes(h));
  const isResidentialUse = landUse.includes("RESIDENTIAL");
  if (isResidentialZone && !isResidentialUse && landUse !== "") return false;
  return true;
}

export default function ZoningSection({
  overallStatus,
  overallError,
  section,
}: {
  overallStatus: OverallStatus;
  overallError?: string | null;
  section?: ReportSection<ZoningInfo> | null;
}) {
  const { status, error } = ddSectionStatus(overallStatus, overallError, section);

  return (
    <SectionCard title="Zoning Information">
      <AsyncSection
        status={status}
        error={error}
        data={section?.data ?? undefined}
        emptyTitle="No zoning information on file"
        unavailableTitle="Zoning information temporarily unavailable"
      >
        {(z) => {
          const compliant = looksCompliant(z);
          return (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-4">
                <Badge tone={compliant ? "good" : "bad"}>
                  {compliant ? "Likely compliant" : "Possible compliance issue"}
                </Badge>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Zoning code</dt>
                <dd className="font-medium text-ink">{z.zoningCode || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Land use</dt>
                <dd className="font-medium text-ink">{z.landUse || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-faint">Parcel ID</dt>
                <dd className="font-medium text-ink">{z.parcelId || "—"}</dd>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <dt className="text-xs text-ink-faint">Description</dt>
                <dd className="text-ink-muted">{z.zoningDescription || "—"}</dd>
              </div>
            </dl>
          );
        }}
      </AsyncSection>
    </SectionCard>
  );
}
