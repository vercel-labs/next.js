import { cache } from 'react'
let n = 0
export const cachedFn = cache(async () => {
  n++
  console.log(`[CACHED-FN EXECUTED, total executions since server start = ${n}]`)
  return 'data'
})
