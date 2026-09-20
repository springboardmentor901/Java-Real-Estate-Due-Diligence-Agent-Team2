"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import RequestReportButton from "@/components/report/RequestReportButton";
import OwnershipSection from "@/components/property/OwnershipSection";
import TaxHistorySection from "@/components/property/TaxHistorySection";
import ZoningSection from "@/components/property/ZoningSection";
import FloodZoneSection from "@/components/property/FloodZoneSection";
import PermitsSection from "@/components/property/PermitsSection";
import EnvironmentalSection from "@/components/property/EnvironmentalSection";
import UtilitySection from "@/components/property/UtilitySection";
import RiskDashboard from "@/components/property/RiskDashboard";
import ComparablesSection from "@/components/property/ComparablesSection";
import ValueHistoryChart from "@/components/property/ValueHistoryChart";
import PropertyTimeline from "@/components/property/PropertyTimeline";
import { useAsync } from "@/lib/hooks/useAsync";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";
import { propertiesApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addRecentlyViewed } = useRecentlyViewed();

  const property = useAsync(() => propertiesApi.getById(id), [id]);
  const dueDiligence = useAsync(() => propertiesApi.getDueDiligence(id), [id]);

  useEffect(() => {
    if (property.data) addRecentlyViewed(property.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.data]);

  if (property.status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-ink-muted">
        <Spinner className="h-5 w-5" /> Loading property…
      </div>
    );
  }

  if (property.status === "error" || !property.data) {
    return (
      <EmptyState
        title="Couldn't load this property"
        description={property.error || "It may not exist, or the server is unavailable."}
        action={
          <Link href="/properties" className="text-sm font-medium text-ink hover:underline">
            Back to Property Search
          </Link>
        }
      />
    );
  }

  const p = property.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-ink-faint">{p.propertyType || "Property"}</p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">{p.address}</h1>
          <p className="text-sm text-ink-muted">
            {p.city}, {p.state} · {formatCurrency(p.price)}
          </p>
        </div>
        <RequestReportButton propertyId={id} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <OwnershipSection
          overallStatus={dueDiligence.status}
          overallError={dueDiligence.error}
          section={dueDiligence.data?.ownership}
        />
        <TaxHistorySection
          overallStatus={dueDiligence.status}
          overallError={dueDiligence.error}
          section={dueDiligence.data?.taxHistory}
        />
        <ZoningSection
          overallStatus={dueDiligence.status}
          overallError={dueDiligence.error}
          section={dueDiligence.data?.zoning}
        />
        <FloodZoneSection
          overallStatus={dueDiligence.status}
          overallError={dueDiligence.error}
          section={dueDiligence.data?.floodZone}
        />
        <PermitsSection
          overallStatus={dueDiligence.status}
          overallError={dueDiligence.error}
          section={dueDiligence.data?.permits}
        />
        <EnvironmentalSection
          overallStatus={dueDiligence.status}
          overallError={dueDiligence.error}
          section={dueDiligence.data?.environmentalRecords}
        />
      </div>

      <UtilitySection propertyId={id} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <RiskDashboard propertyId={id} />
        <ComparablesSection propertyId={id} />
        <ValueHistoryChart propertyId={id} />
        <PropertyTimeline propertyId={id} />
      </div>
    </div>
  );
}
