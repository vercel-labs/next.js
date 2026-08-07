import { brokenGuard, brokenGuardWithThrow, okViaParameter, okViaStrictNull } from "./lib";

export const dynamic = "force-dynamic";

// All four must stay reachable, otherwise tree-shaking removes the comparison.
export default async function Page({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const { v } = await searchParams;
  const t =
    v === "b" ? await brokenGuardWithThrow()
    : v === "c" ? await okViaParameter()
    : v === "d" ? await okViaStrictNull()
    : await brokenGuard();
  return <p>{t.name}</p>;
}
