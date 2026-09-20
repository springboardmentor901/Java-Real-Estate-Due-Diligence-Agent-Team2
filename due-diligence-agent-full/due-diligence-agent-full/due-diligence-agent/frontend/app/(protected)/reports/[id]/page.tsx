"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import SectionCard from "@/components/ui/SectionCard";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ReportStatusBadge from "@/components/report/ReportStatusBadge";
import { reportsApi } from "@/lib/api";
import { errorMessage } from "@/lib/auth-context";
import { usePolling } from "@/lib/hooks/usePolling";
import { formatDateTime, scoreTone } from "@/lib/utils";
import type { CompleteReport } from "@/lib/types";

const POLL_INTERVAL_MS = 4000;

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [report, setReport] = useState<CompleteReport | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"pdf" | "excel" | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await reportsApi.getById(id);
      setReport(data);
      setStatus("success");
    } catch (err) {
      setError(errorMessage(err, "Could not load this report."));
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Poll while the report is still being generated (spec section 4.5).
  // Report generation currently runs synchronously on the backend, so this
  // mostly matters if that ever becomes asynchronous — polling a completed
  // report is a harmless no-op.
  const isPending = report?.status === "REQUESTED" || report?.status === "IN_PROGRESS";
  usePolling(load, POLL_INTERVAL_MS, isPending);

  async function downloadReport(format: "pdf" | "excel") {
    setDownloading(format);
    try {
      const blob = format === "pdf"
        ? await reportsApi.downloadPdf(report!.reportId)
        : await reportsApi.downloadExcel(report!.reportId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `report-${report!.reportId}.${format === "pdf" ? "pdf" : "xlsx"}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errorMessage(err, `Could not download the ${format.toUpperCase()} report.`));
    } finally {
      setDownloading(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-ink-muted">
        <Spinner className="h-5 w-5" /> Loading report…
      </div>
    );
  }

  if (status === "error" || !report) {
    return (
      <EmptyState
        title="Couldn't load this report"
        description={error || undefined}
        action={
          <Link href="/reports" className="text-sm font-medium text-ink hover:underline">
            Back to Report History
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">
            Report #{report.reportId}
          </h1>
          <Link
            href={`/properties/${report.propertyId}`}
            className="text-sm text-ink-muted hover:underline"
          >
            Property #{report.propertyId}
          </Link>
        </div>
        <ReportStatusBadge status={report.status} />
      </div>

      {isPending && (
        <Card className="flex items-center gap-3 p-4 text-sm text-ink-muted">
          <Spinner className="h-4 w-4" />
          Generating your due diligence report — this page updates automatically.
        </Card>
      )}

      {report.status === "FAILED" && (
        <Card className="p-4 text-sm text-brick-dark">
          {report.executiveSummary || "Report generation failed. Please try requesting it again."}
        </Card>
      )}

      {report.status === "COMPLETED" && (
        <>
          <SectionCard title="Executive Summary">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl font-semibold text-ink">{report.riskScore ?? "—"}</span>
              <span className="text-sm text-ink-muted">/ 100 overall risk score</span>
            </div>
            <p className="whitespace-pre-line text-sm text-ink-muted">{report.executiveSummary}</p>
            <p className="mt-3 text-xs text-ink-faint">Generated {formatDateTime(report.createdAt)}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => downloadReport("pdf")} loading={downloading === "pdf"}>
                Download PDF
              </Button>
              <Button variant="secondary" onClick={() => downloadReport("excel")} loading={downloading === "excel"}>
                Download Excel
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Risk Assessment Breakdown">
            <ul className="space-y-3">
              {report.assessments.map((a) => (
                <li key={a.category} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">{a.category}</p>
                    {a.notes && <p className="text-xs text-ink-muted">{a.notes}</p>}
                  </div>
                  <Badge tone={scoreTone(a.score)}>
                    {a.indicator} · {a.score}
                  </Badge>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Property Timeline">
            <ol className="relative ml-2 space-y-4 border-l border-line pl-5">
              {report.propertyTimeline.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-brass" />
                  <p className="text-xs text-ink-faint">{e.date}</p>
                  <p className="text-sm font-medium text-ink">{e.label}</p>
                  <p className="text-sm text-ink-muted">{e.description}</p>
                </li>
              ))}
            </ol>
          </SectionCard>
        </>
      )}
    </div>
  );
}
