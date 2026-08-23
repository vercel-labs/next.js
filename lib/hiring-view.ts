import { isLoopbackHost } from "@/lib/loopback-host";

export type CandidateView = { id: string; name: string; stage: string; label: string };

export function buildCandidateView(rows: { id: string; name: string; stage: string }[]): CandidateView[] {
  return rows.map((r) => ({ ...r, label: `${r.name} — ${r.stage}` }));
}

export function isLocalReviewer(host: string): boolean {
  return isLoopbackHost(host);
}
