"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `callback` every `intervalMs` while `enabled` is true.
 * Used for report-status polling and the notification bell.
 */
export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled: boolean
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => callbackRef.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
