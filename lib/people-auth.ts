import { fixturePrincipal, type PeoplePrincipal } from "@/lib/people-fixture-auth";

export type { PeoplePrincipal };

export function peoplePrincipalFromHeaders(h: Headers): PeoplePrincipal | null {
  return fixturePrincipal(h.get("host"));
}
