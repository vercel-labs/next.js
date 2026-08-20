self.onmessage = () => {
  const result = {
    typeofWindow: typeof window,
    typeofSelf: typeof self,
    windowAccessError: null as string | null,
    windowKeys: null as string[] | null,
  }
  try {
    // @ts-ignore
    result.windowKeys = Object.keys(window).slice(0, 5)
  } catch (e: any) {
    result.windowAccessError = String(e && e.message ? e.message : e)
  }
  // @ts-ignore
  self.postMessage(result)
}
