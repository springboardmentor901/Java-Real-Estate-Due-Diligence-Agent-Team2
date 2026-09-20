"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import AsyncSection from "@/components/ui/AsyncSection";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { adminApi } from "@/lib/api";
import { errorMessage } from "@/lib/auth-context";
import { useAsync } from "@/lib/hooks/useAsync";
import { formatDate } from "@/lib/utils";

function AdminReportRequestsContent() {
  const { status, data, error, reload } = useAsync(() => adminApi.getReportRequests(), []);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function updateRequest(requestId: number, action: "approve" | "reject") {
    setWorkingId(requestId);
    setActionError(null);
    try {
      if (action === "approve") await adminApi.approveReportRequest(requestId);
      else await adminApi.rejectReportRequest(requestId);
      reload();
    } catch (err) {
      setActionError(errorMessage(err, "Could not update this report request."));
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Report Requests</h1>
        <p className="text-sm text-ink-muted">Review buyer requests and authorize due-diligence generation.</p>
      </div>
      {actionError && <p className="text-sm text-brick">{actionError}</p>}
      <Card className="p-2">
        <AsyncSection
          status={status}
          error={error}
          data={data}
          isEmpty={(data?.length ?? 0) === 0}
          emptyTitle="No report requests"
          unavailableTitle="Report requests temporarily unavailable"
        >
          {(requests) => (
            <ul className="divide-y divide-brass-soft">
              {requests.map((request) => (
                <li key={request.requestId} className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{request.propertyAddress}</p>
                    <p className="text-xs text-ink-muted">
                      {request.propertyCity}, {request.propertyState} · {request.requesterName} ({request.requesterEmail})
                    </p>
                    <p className="mt-1 text-xs text-ink-faint">Requested {formatDate(request.requestedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-ink-muted">
                      {request.requestStatus}{request.reportStatus ? ` · ${request.reportStatus}` : ""}
                    </span>
                    {request.riskScore != null && <span className="text-sm font-semibold text-ink">Risk {request.riskScore}</span>}
                    {request.requestStatus === "PENDING" && (
                      <>
                        <Button size="sm" onClick={() => updateRequest(request.requestId, "approve")} loading={workingId === request.requestId}>
                          Approve
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => updateRequest(request.requestId, "reject")} disabled={workingId === request.requestId}>
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AsyncSection>
      </Card>
    </div>
  );
}

export default function AdminReportRequestsPage() {
  return (
    <ProtectedRoute requiredRole="ADMINISTRATOR">
      <AdminReportRequestsContent />
    </ProtectedRoute>
  );
}
