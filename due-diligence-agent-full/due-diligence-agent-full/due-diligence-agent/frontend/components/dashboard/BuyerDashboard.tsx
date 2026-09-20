"use client";

import Link from "next/link";
import SectionCard from "@/components/ui/SectionCard";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import PropertySearchBar from "./PropertySearchBar";
import RecentReportsList from "./RecentReportsList";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { useAuth } from "@/lib/auth-context";
import { useAsync } from "@/lib/hooks/useAsync";
import { reportsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

// Buyers just want a clear read on "is this property safe to buy?" —
// so risk / flood / tax show up next to every property here.
export default function BuyerDashboard() {
  const { recentlyViewed } = useRecentlyViewed();
  const { user } = useAuth();
  const { data: reports } = useAsync(() => reportsApi.listByUser(user?.email), [user?.email]);

  function riskFor(propertyId: number) {
    return reports
      ?.filter((r) => r.propertyId === propertyId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Find a property">
        <PropertySearchBar />
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Recently viewed properties">
          {recentlyViewed.length === 0 ? (
            <EmptyState
              title="No properties viewed yet"
              description="Properties you open will show up here for quick access."
            />
          ) : (
            <ul className="divide-y divide-brass-soft">
              {recentlyViewed.map((p) => {
                const report = riskFor(p.id);
                const flood = report?.assessments.find((a) => a.category === "Flood Risk Status");
                const tax = report?.assessments.find((a) => a.category === "Tax Due Analysis");
                return (
                  <li key={p.id} className="py-3">
                    <Link href={`/properties/${p.id}`} className="font-medium text-ink hover:underline">
                      {p.address}
                    </Link>
                    <p className="text-xs text-ink-muted">
                      {p.city}, {p.state} · {formatCurrency(p.price)}
                    </p>
                    {report ? (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge tone="info">Overall risk {report.riskScore ?? "—"}</Badge>
                        {flood && <Badge tone="neutral">Flood: {flood.indicator}</Badge>}
                        {tax && <Badge tone="neutral">Tax: {tax.indicator}</Badge>}
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-ink-faint">No report requested yet</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Your reports">
          <RecentReportsList limit={5} />
        </SectionCard>
      </div>
    </div>
  );
}
