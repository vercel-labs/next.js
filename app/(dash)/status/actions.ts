"use server";

import { revalidatePath } from "next/cache";
import { readStatus, writeStatus } from "@/lib/store";

// The mutation under test: flip draft → ready, then revalidate the page so the
// client is supposed to receive a fresh render. The whole bug is that the client
// can silently NOT receive it when the connection pool is exhausted.
export async function markReady() {
  const current = await readStatus();
  if (current === "draft") {
    await writeStatus("ready");
  }
  revalidatePath("/status");
}
