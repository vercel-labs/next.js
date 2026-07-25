"use client";

// Mirrors the useBrowserSideEffects / useFilterParam pattern from consumer-webapp-next:
//
// 1. Filter state lives in React useState (not derived from URL on each render).
// 2. useSearchParams() is read to preserve unrelated query params when building
//    the new URL — same as the nonSearchRelatedParams merge in useBrowserSideEffects.
// 3. router.replace is called as a side effect *inside* the setState updater,
//    matching the useFilterParam pattern where browserSideEffects() is called
//    inside setFilterParams(). In React concurrent mode, updaters can be replayed,
//    which can produce duplicate router.replace calls and contribute to the
//    PPR retry that drops scroll: false.

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PARAM_KEY = "color";

export function Checkboxes({
  colors,
  initialSelected,
}: {
  colors: string[];
  initialSelected: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(initialSelected);

  // Closes over the useSearchParams() snapshot at the time of the last render.
  // On rapid successive clicks before the first navigation commits (force-dynamic
  // requires a server round-trip), this snapshot is stale — matching the race
  // condition in useBrowserSideEffects.
  const browserSideEffects = useCallback(
    (newSelected: string[]) => {
      const next = new URLSearchParams(
        Object.fromEntries(
          [...searchParams.entries()].filter(([key]) => key !== PARAM_KEY)
        )
      );
      for (const c of newSelected) {
        next.append(PARAM_KEY, c);
      }
      const query = next.toString();
      router.replace(query ? `?${query}` : "/", { scroll: false });
    },
    [router, searchParams]
  );

  function toggle(color: string) {
    // router.replace is called inside the setState updater — matching
    // useFilterParam's pattern of calling browserSideEffects() inside
    // setFilterParams(updater).
    setSelected((current) => {
      const newSelected = current.includes(color)
        ? current.filter((c) => c !== color)
        : [...current, color];

      browserSideEffects(newSelected);

      return newSelected;
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {colors.map((color) => (
        <label
          key={color}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          <input
            type="checkbox"
            checked={selected.includes(color)}
            onChange={() => toggle(color)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span style={{ textTransform: "capitalize" }}>{color}</span>
        </label>
      ))}
    </div>
  );
}
