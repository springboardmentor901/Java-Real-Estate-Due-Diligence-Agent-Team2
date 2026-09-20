"use client";

import { useAuth } from "@/lib/auth-context";
import { roleLabel } from "@/lib/utils";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import LegalReviewerDashboard from "@/components/dashboard/LegalReviewerDashboard";
import FinancialInstitutionDashboard from "@/components/dashboard/FinancialInstitutionDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Welcome back, {user.fullName.split(" ")[0]}</h1>
        <p className="text-sm text-ink-muted">{roleLabel(user.role)} dashboard</p>
      </div>

      {user.role === "BUYER" && <BuyerDashboard />}
      {user.role === "REAL_ESTATE_AGENT" && <AgentDashboard />}
      {user.role === "LEGAL_REVIEWER" && <LegalReviewerDashboard />}
      {user.role === "FINANCIAL_INSTITUTION" && <FinancialInstitutionDashboard />}
      {user.role === "ADMINISTRATOR" && (
        <div className="rounded-md border border-dashed border-line-strong p-6 text-sm text-ink-muted">
          Administrators use a dedicated{" "}
          <a href="/admin/dashboard" className="font-medium text-ink hover:underline">
            Admin Dashboard
          </a>{" "}
          instead of this page.
        </div>
      )}
    </div>
  );
}
