"use client";

import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import { useAsync } from "@/lib/hooks/useAsync";
import { propertiesApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ComparablesSection({ propertyId }: { propertyId: number | string }) {
  const comparables = useAsync(() => propertiesApi.getComparables(propertyId), [propertyId]);
  const trends = useAsync(() => propertiesApi.getMarketTrends(propertyId), [propertyId]);

  return (
    <SectionCard title="Comparables & Market Trends">
      <div className="space-y-5">
        <AsyncSection
          status={comparables.status}
          error={comparables.error}
          data={comparables.data}
          isEmpty={(comparables.data?.length ?? 0) === 0}
          emptyTitle="No comparable listings found"
          unavailableTitle="Comparable listings temporarily unavailable"
        >
          {(listings) => (
            <ul className="divide-y divide-brass-soft">
              {listings.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <p className="font-medium text-ink">{c.address}</p>
                    <p className="text-xs text-ink-muted">
                      {c.bedrooms} bd · {c.bathrooms} ba · {c.distanceMiles.toFixed(1)} mi away
                      {c.soldDate ? ` · Sold ${formatDate(c.soldDate)}` : ""}
                    </p>
                  </div>
                  <span className="font-medium text-ink">{formatCurrency(c.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </AsyncSection>

        <div className="border-t border-brass-soft pt-4">
          <p className="mb-2 text-xs font-semibold text-ink-faint">Median price by period</p>
          <AsyncSection
            status={trends.status}
            error={trends.error}
            data={trends.data}
            isEmpty={(trends.data?.length ?? 0) === 0}
            emptyTitle="No market trend data available"
            unavailableTitle="Market trends temporarily unavailable"
          >
            {(points) => {
              const max = Math.max(...points.map((p) => p.medianPrice), 1);
              return (
                <div className="flex items-end gap-2" style={{ height: 80 }}>
                  {points.map((p) => (
                    <div key={p.period} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm bg-brass"
                        style={{ height: `${(p.medianPrice / max) * 64}px` }}
                        title={`${p.period}: ${formatCurrency(p.medianPrice)}`}
                      />
                      <span className="text-[10px] text-ink-faint">{p.period}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          </AsyncSection>
        </div>
      </div>
    </SectionCard>
  );
}
