"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { useAsync } from "@/lib/hooks/useAsync";
import { propertiesApi } from "@/lib/api";
import { errorMessage } from "@/lib/auth-context";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Utility, UtilityRequest } from "@/lib/types";

const EMPTY_FORM: UtilityRequest = {
  utilityType: "",
  providerName: "",
  serviceStatus: "ACTIVE",
  accountNumber: "",
  monthlyAverageCost: null,
  source: "Manual Entry",
};

export default function UtilitySection({ propertyId }: { propertyId: number | string }) {
  const { status, data, error, reload } = useAsync(
    () => propertiesApi.getUtilities(propertyId),
    [propertyId]
  );

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<UtilityRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function startAdd() {
    setForm(EMPTY_FORM);
    setEditingId("new");
    setFormError(null);
  }

  function startEdit(u: Utility) {
    setForm({
      utilityType: u.utilityType,
      providerName: u.providerName || "",
      serviceStatus: u.serviceStatus || "ACTIVE",
      accountNumber: u.accountNumber || "",
      monthlyAverageCost: u.monthlyAverageCost,
      source: u.source || "Manual Entry",
    });
    setEditingId(u.id);
    setFormError(null);
  }

  async function save() {
    if (!form.utilityType.trim()) {
      setFormError("Utility type is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingId === "new") {
        await propertiesApi.addUtility(propertyId, form);
      } else if (typeof editingId === "number") {
        await propertiesApi.updateUtility(propertyId, editingId, form);
      }
      setEditingId(null);
      reload();
    } catch (err) {
      setFormError(errorMessage(err, "Could not save this utility."));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Remove this utility record?")) return;
    try {
      await propertiesApi.deleteUtility(propertyId, id);
      reload();
    } catch (err) {
      window.alert(errorMessage(err, "Could not delete this utility."));
    }
  }

  return (
    <SectionCard
      title="Utility Information"
      action={
        editingId === null && (
          <Button size="sm" variant="secondary" onClick={startAdd}>
            + Add utility
          </Button>
        )
      }
    >
      {editingId !== null && (
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-md border border-line bg-paper p-4 sm:grid-cols-2">
          <Input
            label="Utility type"
            placeholder="e.g. Electric, Water, Gas"
            value={form.utilityType}
            onChange={(e) => setForm({ ...form, utilityType: e.target.value })}
          />
          <Input
            label="Provider"
            value={form.providerName}
            onChange={(e) => setForm({ ...form, providerName: e.target.value })}
          />
          <Select
            label="Service status"
            value={form.serviceStatus}
            onChange={(e) => setForm({ ...form, serviceStatus: e.target.value })}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="UNKNOWN">Unknown</option>
          </Select>
          <Input
            label="Account number"
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          />
          <Input
            label="Monthly average cost"
            type="number"
            step="0.01"
            value={form.monthlyAverageCost ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                monthlyAverageCost: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
          <Input
            label="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
          {formError && <p className="sm:col-span-2 text-sm text-brick">{formError}</p>}
          <div className="flex gap-2 sm:col-span-2">
            <Button size="sm" onClick={save} loading={saving}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <AsyncSection
        status={status}
        error={error}
        data={data}
        isEmpty={(data?.length ?? 0) === 0}
        emptyTitle="No utility information recorded yet"
        unavailableTitle="Utility information temporarily unavailable"
      >
        {(utilities) => (
          <ul className="divide-y divide-brass-soft">
            {utilities.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {u.utilityType}
                    {u.providerName ? ` · ${u.providerName}` : ""}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Account {u.accountNumber || "—"} · Updated {formatDateTime(u.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-muted">{formatCurrency(u.monthlyAverageCost)}/mo</span>
                  <Badge tone={u.serviceStatus === "ACTIVE" ? "good" : "neutral"}>
                    {u.serviceStatus || "Unknown"}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(u)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(u.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
