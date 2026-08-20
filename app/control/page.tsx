"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const tabs = ["A", "B"];

export default function Control() {
  const [active, setActive] = useState("A");
  return (
    <div>
      <p>Control: same layoutId highlight driven by useState (no App Router navigation).</p>
      <div id="tabs" style={{ display: "flex", gap: 24 }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            onClick={() => setActive(tab)}
            style={{ position: "relative", padding: "8px 24px", background: "none", border: 0, font: "inherit" }}
          >
            {tab}
            {active === tab ? (
              <motion.div
                id="control-highlight"
                layoutId="control-highlight"
                transition={{ type: "tween", duration: 1.5, ease: "linear" }}
                style={{ position: "absolute", inset: 0, background: "#3b82f6", borderRadius: 8, zIndex: -1 }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
