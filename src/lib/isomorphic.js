// Isomorphic helper: the server-only module is behind a runtime branch,
// so it is never evaluated in the browser.
export async function getCookies() {
  if (typeof window === 'undefined') {
    return (await import('./serverUtils')).getFromServer()
  }
  return (await import('./clientUtils')).getFromClient()
}
