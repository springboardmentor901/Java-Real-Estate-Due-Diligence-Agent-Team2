import Badge from "@/components/ui/Badge";
import type { ReportStatus } from "@/lib/types";

const TONE: Record<ReportStatus, "neutral" | "info" | "good" | "bad"> = {
  REQUESTED: "neutral",
  IN_PROGRESS: "info",
  COMPLETED: "good",
  FAILED: "bad",
};

const LABEL: Record<ReportStatus, string> = {
  REQUESTED: "Requested",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export default function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <Badge tone={TONE[status]}>{LABEL[status]}</Badge>;
}
