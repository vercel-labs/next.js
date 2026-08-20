import { cookies } from "next/headers";

export async function triggerRepro(): Promise<string> {
  const store = await cookies();
  return store.get("session")?.value ?? "anonymous";
}
