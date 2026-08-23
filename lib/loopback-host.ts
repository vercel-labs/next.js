import { isIP } from "node:net";

export function isLoopbackHost(host: string): boolean {
  const bare = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "");
  if (isIP(bare) === 4) return bare.startsWith("127.");
  if (isIP(bare) === 6) return bare === "::1";
  return bare === "localhost";
}
