"use server";

import { cookies } from "next/headers";

export async function cookieReproAction() {
  const cookieStore = await cookies();
  cookieStore.set("middleware-repro", "from-action");
  cookieStore.set("action-repro", "from-action-1");
  cookieStore.set("action-repro", "from-action-2");
}
