"use server";

import { headers } from "next/headers";

export async function signIn(formData: FormData) {
  const h = await headers();
  console.log("[action] email field:", formData.get("email"));
  console.log("[action] header referer:", h.get("referer"));
  console.log("[action] header next-url:", h.get("next-url"));
  console.log("[action] header x-url:", h.get("x-url"));
  console.log("[action] all header names:", [...h.keys()].join(","));

  // Is there any public API to read the current request URL / searchParams?
  const nextServer = await import("next/server");
  const nextHeaders = await import("next/headers");
  console.log("[action] next/server exports:", Object.keys(nextServer).join(","));
  console.log("[action] next/headers exports:", Object.keys(nextHeaders).join(","));

  // Undocumented internal workaround suggested in the issue thread
  try {
    const { workUnitAsyncStorage } = await import(
      "next/dist/server/app-render/work-unit-async-storage.external"
    );
    const store = workUnitAsyncStorage.getStore() as any;
    console.log("[action] workUnit store type:", store?.type);
    console.log("[action] workUnit store keys:", store ? Object.keys(store).join(",") : "undefined");
    console.log("[action] workUnit store.url:", JSON.stringify(store?.url ?? null));
  } catch (err) {
    console.log("[action] internal workaround threw:", (err as Error).message);
  }
}
