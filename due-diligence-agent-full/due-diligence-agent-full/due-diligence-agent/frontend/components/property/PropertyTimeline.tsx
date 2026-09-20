"use client";

import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import { useAsync } from "@/lib/hooks/useAsync";
import { propertiesApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function PropertyTimeline({ propertyId }: { propertyId: number | string }) {
  const { status, data, error } = useAsync(
    () => propertiesApi.getTimeline(propertyId),
    [propertyId]
  );

  return (
    <SectionCard title="Property Timeline">
      <AsyncSection
        status={status}
        error={error}
        data={data}
        isEmpty={(data?.length ?? 0) === 0}
        emptyTitle="No timeline events yet"
        unavailableTitle="Property timeline temporarily unavailable"
      >
        {(entries) => (
          <ol className="relative ml-2 space-y-5 border-l border-line pl-5">
            {entries.map((e, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-brass" />
                <p className="text-xs text-ink-faint">{formatDate(e.date)}</p>
                <p className="text-sm font-medium text-ink">{e.label}</p>
                <p className="text-sm text-ink-muted">{e.description}</p>
              </li>
            ))}
          </ol>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
