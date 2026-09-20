"use client";

import { useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import AsyncSection from "@/components/ui/AsyncSection";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useAsync } from "@/lib/hooks/useAsync";
import { adminApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

const ACTION_TYPES = ["", "LOGIN", "REGISTER", "SEARCH", "REPORT_REQUEST", "PROFILE_UPDATE"];

export default function AuditLogTable() {
  const [user, setUser] = useState("");
  const [actionType, setActionType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ user: "", actionType: "", from: "", to: "" });

  const { status, data, error } = useAsync(
    () => adminApi.getAuditLogs(appliedFilters),
    [appliedFilters]
  );

  return (
    <SectionCard title="Audit Log">
      <form
        className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedFilters({ user, actionType, from, to });
        }}
      >
        <Input label="User" placeholder="Email" value={user} onChange={(e) => setUser(e.target.value)} />
        <Select label="Action type" value={actionType} onChange={(e) => setActionType(e.target.value)}>
          {ACTION_TYPES.map((a) => (
            <option key={a} value={a}>
              {a || "All"}
            </option>
          ))}
        </Select>
        <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <Button type="submit" variant="secondary">
          Apply filters
        </Button>
      </form>

      <AsyncSection
        status={status}
        error={error}
        data={data}
        isEmpty={(data?.length ?? 0) === 0}
        emptyTitle="No audit log entries match these filters"
        unavailableTitle="Audit log temporarily unavailable"
      >
        {(logs) => (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="pb-2 font-medium">Timestamp</th>
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Action</th>
                  <th className="pb-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brass-soft">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 text-ink-muted">{formatDateTime(log.timestamp)}</td>
                    <td className="py-2 font-medium text-ink">{log.user}</td>
                    <td className="py-2 text-ink-muted">{log.actionType}</td>
                    <td className="py-2 text-ink-muted">{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AsyncSection>
    </SectionCard>
  );
}
