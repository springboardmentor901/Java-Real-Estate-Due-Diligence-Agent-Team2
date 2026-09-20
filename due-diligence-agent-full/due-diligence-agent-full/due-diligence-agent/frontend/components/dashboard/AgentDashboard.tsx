"use client";

import SectionCard from "@/components/ui/SectionCard";
import EmptyState from "@/components/ui/EmptyState";
import PropertySearchBar from "./PropertySearchBar";
import RecentReportsList from "./RecentReportsList";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { useAsync } from "@/lib/hooks/useAsync";
import { propertiesApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

// Agents juggle many properties for many clients at once, so the report
// list is the focus here, plus a pricing-context widget rather than a
// single risk verdict.
export default function AgentDashboard() {
  const { recentlyViewed } = useRecentlyViewed();
  const latest = recentlyViewed[0];
  const trends = useAsync(
    () => (latest ? propertiesApi.getMarketTrends(latest.id) : Promise.resolve([])),
    [latest?.id]
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Find a property">
        <PropertySearchBar />
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Requested reports">
          <RecentReportsList limit={10} />
        </SectionCard>

        <SectionCard title="Market trend snapshot">
          {!latest ? (
            <EmptyState
              title="Open a property to see market context"
              description="A snapshot of pricing trends for the last property you viewed will show up here."
            />
          ) : trends.status === "loading" ? (
            <p className="py-6 text-center text-sm text-ink-muted">Loading…</p>
          ) : trends.status === "error" || (trends.data?.length ?? 0) === 0 ? (
            <EmptyState title="Market trend data temporarily unavailable" />
          ) : (
            <div>
              <p className="mb-2 text-xs text-ink-muted">Based on {latest.address}</p>
              <div className="flex items-end gap-2" style={{ height: 80 }}>
                {trends.data!.map((p) => {
                  const max = Math.max(...trends.data!.map((t) => t.medianPrice), 1);
                  return (
                    <div key={p.period} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm bg-brass"
                        style={{ height: `${(p.medianPrice / max) * 64}px` }}
                        title={`${p.period}: ${formatCurrency(p.medianPrice)}`}
                      />
                      <span className="text-[10px] text-ink-faint">{p.period}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
