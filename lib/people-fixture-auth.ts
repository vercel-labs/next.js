import { isLoopbackHost } from "@/lib/loopback-host";

export type PeoplePrincipal = { id: string; email: string; roles: string[] };

export function fixturePrincipal(host: string | null): PeoplePrincipal | null {
  if (!host || !isLoopbackHost(host)) return null;
  return { id: "fixture-1", email: "dev@example.com", roles: ["hiring"] };
}
