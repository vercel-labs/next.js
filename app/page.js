"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    // The root DOM node of the page segment IS the scroll container.
    <div
      id="scroller"
      style={{ height: 150, width: 320, overflow: "auto", border: "1px solid #333" }}
    >
      <p id="focus-log">focus log: (none)</p>
      <input
        id="q"
        onInput={(e) => router.replace(`/?q=${encodeURIComponent(e.currentTarget.value)}`)}
        onBlur={() => {
          document.getElementById("focus-log").textContent =
            "blur -> activeElement=" +
            (document.activeElement ? document.activeElement.id || document.activeElement.tagName : "null");
        }}
      />
      <input
        id="q-native"
        onInput={(e) => history.replaceState(null, "", `/?q=${encodeURIComponent(e.currentTarget.value)}`)}
      />
      <div style={{ height: 800 }} />
    </div>
  );
}
