// Stand-in for @sentry/core `uuid4()` (utils/misc.ts)
export function thirdPartyUuid(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID().replace(/-/g, "");
  }
  return "fallback";
}
