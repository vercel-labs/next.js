import { cookies } from "next/headers";

export async function getCurrentUserId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get("uid")?.value;
}
