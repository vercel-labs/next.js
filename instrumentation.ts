export function onRequestError(err: unknown, request: unknown, context: unknown) {
  const e = err as Error
  console.log(
    '[onRequestError] name=%s message=%j cause=%j keys=%j',
    e?.name,
    e?.message,
    (e as any)?.cause,
    Object.keys(e ?? {})
  )
  console.log('[onRequestError] stack:\n' + e?.stack)
}
