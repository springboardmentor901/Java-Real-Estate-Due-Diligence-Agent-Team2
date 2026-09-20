import type { ReportSection } from "./types";

export type OverallStatus = "loading" | "error" | "success";

/**
 * Every property-detail section is backed by one field inside the single
 * aggregated /due-diligence response. This maps that response's overall
 * fetch state + that field's own SUCCESS/FAILED flag into one status each
 * section component can feed straight into <AsyncSection>.
 */
export function ddSectionStatus<T>(
  overall: OverallStatus,
  overallError: string | null | undefined,
  section: ReportSection<T> | null | undefined
): { status: OverallStatus; error: string | null } {
  if (overall === "loading") return { status: "loading", error: null };
  if (overall === "error") {
    return { status: "error", error: overallError || "Temporarily unavailable." };
  }
  if (!section || section.status === "FAILED") {
    return {
      status: "error",
      error: section?.errorMessage || "This section is temporarily unavailable.",
    };
  }
  return { status: "success", error: null };
}
