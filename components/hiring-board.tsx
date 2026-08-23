"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildCandidateView, type CandidateView } from "@/lib/hiring-view";

export function HiringBoard({ candidates }: { candidates: CandidateView[] }) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const rows = buildCandidateView(candidates);
  return (
    <div>
      <Input value={q} onChange={(e) => setQ(e.target.value)} />
      <Button onClick={() => router.refresh()}>refresh</Button>
      <ul>{rows.filter((r) => r.label.includes(q)).map((r) => <li key={r.id}>{r.label}</li>)}</ul>
    </div>
  );
}
