"use client";

import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import { useAsync } from "@/lib/hooks/useAsync";
import { propertiesApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

const WIDTH = 560;
const HEIGHT = 140;
const PADDING = 24;

export default function ValueHistoryChart({ propertyId }: { propertyId: number | string }) {
  const { status, data, error } = useAsync(
    () => propertiesApi.getValueHistory(propertyId),
    [propertyId]
  );

  return (
    <SectionCard title="Value History">
      <AsyncSection
        status={status}
        error={error}
        data={data}
        isEmpty={(data?.length ?? 0) < 2}
        emptyTitle="Not enough value history to chart yet"
        unavailableTitle="Value history temporarily unavailable"
      >
        {(points) => {
          const values = points.map((p) => p.value);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min || 1;
          const stepX = (WIDTH - PADDING * 2) / (points.length - 1);

          const coords = points.map((p, i) => ({
            x: PADDING + i * stepX,
            y: HEIGHT - PADDING - ((p.value - min) / range) * (HEIGHT - PADDING * 2),
          }));
          const path = coords
            .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
            .join(" ");

          const first = points[0];
          const last = points[points.length - 1];
          const change = last.value - first.value;
          const pct = first.value ? (change / first.value) * 100 : 0;

          return (
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-ink">{formatCurrency(last.value)}</p>
                <p className={change >= 0 ? "text-sm text-forest" : "text-sm text-brick"}>
                  {change >= 0 ? "+" : ""}
                  {pct.toFixed(1)}% since {formatDate(first.date)}
                </p>
              </div>
              <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Property value over time">
                <path d={path} fill="none" stroke="#8a6a2f" strokeWidth={2} />
                {coords.map((c, i) => (
                  <circle key={i} cx={c.x} cy={c.y} r={2.5} fill="#8a6a2f" />
                ))}
              </svg>
              <div className="flex justify-between text-xs text-ink-faint">
                <span>{formatDate(first.date)}</span>
                <span>{formatDate(last.date)}</span>
              </div>
            </div>
          );
        }}
      </AsyncSection>
    </SectionCard>
  );
}
