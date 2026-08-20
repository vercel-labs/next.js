// Simulates a third-party dependency that ships BigInt literals to the client.
// Next.js/SWC does NOT downlevel or flag these even though the default
// browserslist target includes Safari 12, so iOS < 14 throws
// "SyntaxError: No identifiers allowed directly after numeric literal"
// for the whole chunk (uncatchable, parse time).
export function big() {
  try {
    return String(2n ** 10n)
  } catch {
    return 'n/a'
  }
}
