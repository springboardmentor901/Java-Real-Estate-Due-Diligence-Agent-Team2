"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { propertiesApi } from "@/lib/api";
import { errorMessage } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import type { AddressValidationResponse, Property } from "@/lib/types";

const PAGE_SIZE = 12;

function PropertySearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAddress = searchParams.get("address") || "";

  const [addressInput, setAddressInput] = useState(initialAddress);
  const [propertyType, setPropertyType] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");
  const [page, setPage] = useState(0);

  const [mode, setMode] = useState<"browse" | "search">(initialAddress ? "search" : "browse");
  const [results, setResults] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [validation, setValidation] = useState<AddressValidationResponse | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setValidation(null);
      try {
        if (mode === "search" && addressInput.trim()) {
          const data = await propertiesApi.search(addressInput.trim());
          if (!cancelled) {
            setResults(data);
            setTotalPages(1);
          }
        } else {
          const data = await propertiesApi.browse({
            page,
            size: PAGE_SIZE,
            sort: "address,asc",
            propertyType: propertyType || undefined,
            minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
            minBathrooms: minBathrooms ? Number(minBathrooms) : undefined,
          });
          if (!cancelled) {
            setResults(data.content);
            setTotalPages(Math.max(1, data.totalPages));
          }
        }
      } catch (err) {
        if (!cancelled) setError(errorMessage(err, "Could not load properties."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mode, addressInput, propertyType, minBedrooms, minBathrooms, page]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    if (addressInput.trim()) {
      setMode("search");
      router.replace(`/properties?address=${encodeURIComponent(addressInput.trim())}`);
    } else {
      setMode("browse");
      router.replace("/properties");
    }
  }

  async function handleValidateAddress() {
    if (!addressInput.trim()) return;
    setValidating(true);
    try {
      const res = await propertiesApi.validateAddress(addressInput.trim());
      setValidation(res);
    } catch (err) {
      setError(errorMessage(err, "Could not validate this address."));
    } finally {
      setValidating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium text-ink">Property Search</h1>
        <p className="text-sm text-ink-muted">Search by address, or browse every property on file.</p>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Address"
              placeholder="123 Main St"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
          </div>
          <Select
            label="Property type"
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setMode("browse");
              setPage(0);
            }}
          >
            <option value="">Any type</option>
            <option value="SINGLE_FAMILY">Single family</option>
            <option value="CONDO">Condo</option>
            <option value="MULTI_FAMILY">Multi-family</option>
            <option value="COMMERCIAL">Commercial</option>
          </Select>
          <Select
            label="Min bedrooms"
            value={minBedrooms}
            onChange={(e) => {
              setMinBedrooms(e.target.value);
              setMode("browse");
              setPage(0);
            }}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </Select>
          <Select
            label="Min bathrooms"
            value={minBathrooms}
            onChange={(e) => {
              setMinBathrooms(e.target.value);
              setMode("browse");
              setPage(0);
            }}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Button type="submit">Search</Button>
            {mode === "search" && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setAddressInput("");
                  setMode("browse");
                  setPage(0);
                  router.replace("/properties");
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-muted">
          <Spinner className="h-5 w-5" /> Loading properties…
        </div>
      ) : error ? (
        <EmptyState title="Couldn't load properties" description={error} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No properties found"
          description={
            mode === "search"
              ? "No existing records match this address. You can validate it to confirm it's a real, standardized address."
              : "Try adjusting your filters."
          }
          action={
            mode === "search" && (
              <div className="flex flex-col items-center gap-2">
                <Button size="sm" variant="secondary" onClick={handleValidateAddress} loading={validating}>
                  Validate this address
                </Button>
                {validation && (
                  <p className="max-w-sm text-xs text-ink-muted">
                    Standardized as <span className="font-medium text-ink-muted">{validation.formattedAddress}</span>{" "}
                    ({validation.latitude.toFixed(4)}, {validation.longitude.toFixed(4)})
                  </p>
                )}
              </div>
            )
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <Link key={p.id} href={`/properties/${p.id}`}>
                <Card className="h-full p-4 transition-colors hover:border-brass/60">
                  <p className="font-medium text-ink">{p.address}</p>
                  <p className="text-sm text-ink-muted">
                    {p.city}, {p.state}
                  </p>
                  {(p.bedrooms != null || p.bathrooms != null) && (
                    <p className="mt-1 text-xs text-ink-faint">
                      {p.bedrooms != null ? `${p.bedrooms} bd` : ""}
                      {p.bedrooms != null && p.bathrooms != null ? " · " : ""}
                      {p.bathrooms != null ? `${p.bathrooms} ba` : ""}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">{p.propertyType || "Unknown type"}</span>
                    <span className="font-semibold text-ink">{formatCurrency(p.price)}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {mode === "browse" && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-ink-muted">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PropertySearchPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-sm text-ink-muted">Loading…</div>}>
      <PropertySearchInner />
    </Suspense>
  );
}
