"use client";

import Spinner from "./Spinner";
import EmptyState from "./EmptyState";

/**
 * Wraps a single piece of async UI (a due-diligence section, a widget, a
 * table…) with consistent loading / error / empty handling.
 *
 * This is what makes "if one section fails to load, the rest of the page
 * keeps working" (see the frontend spec, section 2 step 3) trivial: every
 * section owns its own AsyncSection instead of the whole page having one
 * big loading/error state.
 */
export default function AsyncSection<T>({
  status,
  error,
  data,
  isEmpty,
  emptyTitle = "Nothing to show yet",
  unavailableTitle = "Temporarily unavailable",
  children,
}: {
  status: "loading" | "error" | "success";
  error?: string | null;
  data?: T;
  isEmpty?: boolean;
  emptyTitle?: string;
  unavailableTitle?: string;
  children: (data: T) => React.ReactNode;
}) {
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-ink-muted">
        <Spinner className="h-4 w-4" /> Loading…
      </div>
    );
  }

  if (status === "error") {
    return (
      <EmptyState
        title={unavailableTitle}
        description={error || "This section couldn't load. The rest of the page is unaffected."}
      />
    );
  }

  if (isEmpty || data === undefined || data === null) {
    return <EmptyState title={emptyTitle} />;
  }

  return <>{children(data)}</>;
}
