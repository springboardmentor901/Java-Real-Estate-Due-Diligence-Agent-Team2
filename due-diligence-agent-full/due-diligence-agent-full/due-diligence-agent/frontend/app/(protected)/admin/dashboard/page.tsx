"use client";

import Card from "@/components/ui/Card";
import AsyncSection from "@/components/ui/AsyncSection";
import AuditLogTable from "@/components/admin/AuditLogTable";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAsync } from "@/lib/hooks/useAsync";
import { adminApi } from "@/lib/api";

const SUMMARY_LABELS: Record<string, string> = {
  totalUsers: "Registered users",
  totalPropertiesSearched: "Properties searched",
  totalReportsGenerated: "Reports generated",
  reportsLast7Days: "Reports (last 7 days)",
};

function AdminDashboardContent() {
  const { status, data, error } = useAsync(() => adminApi.getSummary(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Admin Dashboard</h1>
        <p className="text-sm text-ink-muted">Platform-wide activity and audit trail.</p>
      </div>

      <AsyncSection
        status={status}
        error={error}
        data={data}
        unavailableTitle="Platform summary temporarily unavailable"
      >
        {(summary) => (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(SUMMARY_LABELS).map(([key, label]) => (
              <Card key={key} className="p-4">
                <p className="text-xs text-ink-faint">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {(summary as unknown as Record<string, number>)[key] ?? "—"}
                </p>
              </Card>
            ))}
          </div>
        )}
      </AsyncSection>

      <AuditLogTable />
    </div>
  );
}

// Extra, Administrator-only check layered on top of the same
// ProtectedRoute wrapper every other page uses (spec section 5).
export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="ADMINISTRATOR">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
