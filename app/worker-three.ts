self.onmessage = async () => {
  let error: string | null = null
  let revision: string | null = null
  try {
    const three = await import('three')
    revision = three.REVISION
  } catch (e: any) {
    error = String(e && e.message ? e.message : e)
  }
  // @ts-ignore
  self.postMessage({ threeImportError: error, revision })
}
