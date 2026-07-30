import { cacheLife, cacheTag } from "next/cache";

/**
 * Artificial latency for the cache fill. In a real app this is a cross-region
 * database / KV round trip. Making it explicit here is the whole point of this
 * repro: it widens the window in which the fill can be interrupted.
 */
export const FILL_DELAY_MS = Number(process.env.REPRO_FILL_DELAY_MS ?? 800);

/** Artificial latency *before* the cache is read (non-cache I/O in a parent). */
export const PRE_READ_DELAY_MS = Number(process.env.REPRO_PRE_READ_DELAY_MS ?? 300);

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A shared, tagged `"use cache"` entry that several routes read from their
 * shell -- the same shape as an app-wide "platform settings" cache.
 */
export async function getSharedSettings(): Promise<{
  title: string;
  filledAt: string;
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("shared-settings");

  // Stand-in for a slow database read.
  await sleep(FILL_DELAY_MS);

  return {
    title: "shared-settings-ok",
    filledAt: new Date().toISOString(),
  };
}
