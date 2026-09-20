"use client";

import { useCallback, useEffect, useState } from "react";
import type { Property } from "@/lib/types";

const KEY = "dda_recently_viewed";
const MAX_ITEMS = 5;

/**
 * Recently-viewed properties are client-only (the backend doesn't track
 * this — see frontend spec section 4.2), so we keep the last few property
 * summaries in localStorage, per browser.
 */
export function useRecentlyViewed() {
  const [items, setItems] = useState<Property[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
  }, []);

  const addRecentlyViewed = useCallback((property: Property) => {
    setItems((prev) => {
      const next = [property, ...prev.filter((p) => p.id !== property.id)].slice(
        0,
        MAX_ITEMS
      );
      window.localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recentlyViewed: items, addRecentlyViewed };
}
