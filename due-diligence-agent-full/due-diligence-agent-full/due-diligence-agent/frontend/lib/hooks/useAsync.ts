"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessage } from "@/lib/auth-context";

type Status = "loading" | "error" | "success";

/**
 * Fetches `fn()` whenever `deps` change, exposing loading/error/data state
 * shaped for <AsyncSection>. Each call site gets its own independent
 * request, which is what lets one failed section leave the rest of a page
 * alone.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);
    fnRef
      .current()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err, "This section couldn't load."));
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  return { status, data, error, reload, setData };
}
