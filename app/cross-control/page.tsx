"use client";
import { useState } from "react";
import { Card } from "../cross/card";

export default function CrossControl() {
  const [big, setBig] = useState(false);
  return (
    <div>
      <p>Control: identical components swapped with useState instead of routing.</p>
      <button id="open-detail" onClick={() => setBig(true)}>open</button>
      {big ? <Card id="card" big /> : <Card id="card" big={false} />}
    </div>
  );
}
