"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { reportsApi } from "@/lib/api";
import { errorMessage } from "@/lib/auth-context";

export default function RequestReportButton({ propertyId }: { propertyId: number | string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await reportsApi.request(propertyId);
      router.push("/reports");
    } catch (err) {
      setError(errorMessage(err, "Could not request a report for this property."));
      setLoading(false);
    }
  }

  return (
    <div id="request-report" className="flex flex-col items-end gap-1">
      <Button onClick={handleClick} loading={loading}>
        Request Due Diligence Report
      </Button>
      {error && <p className="text-sm text-brick">{error}</p>}
    </div>
  );
}
