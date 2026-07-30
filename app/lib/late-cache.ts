import { cacheLife, cacheTag } from "next/cache";
import { FILL_DELAY_MS, sleep } from "./cache";

/**
 * A second shared `"use cache"` entry. `/slow` reaches it only *after* a long
 * stretch of uncached async work, while `/late-reader` and `/b` read it
 * directly.
 *
 * That asymmetry is what makes the poisoning observable: `/slow` is the route
 * that fills (and corrupts) the entry, the others only ever read it.
 *
 * The payload deliberately contains a nested promise. The outer object is
 * serialized into the Flight stream immediately while `detail` is still
 * pending, so an interrupted fill produces a *partially written* stream rather
 * than an empty one -- which is what a real cached payload looks like when it
 * contains anything streamed or nested.
 */
export async function getLateData(): Promise<{
  title: string;
  detail: Promise<string>;
}> {
  "use cache";
  cacheLife("hours");
  cacheTag("late-data");

  return {
    title: "late-data",
    detail: sleep(FILL_DELAY_MS).then(() => "ok"),
  };
}

/** Reads the entry end to end. Returns the marker only if nothing was lost. */
export async function readLateData(): Promise<string> {
  const late = await getLateData();
  return `${late.title}-${await late.detail}`;
}
