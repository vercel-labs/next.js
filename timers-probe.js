// Probes the two runtime behaviors that Next.js' `createAtomicTimerGroup`
// (packages/next/src/server/app-render/app-render-scheduling.ts) depends on.
'use strict'

const t = setTimeout(() => {}, 1000)
const hasIdleStart = '_idleStart' in t && typeof t._idleStart === 'number'
console.log('_idleStart present & numeric:', hasIdleStart, '->', t._idleStart)
console.log(
  hasIdleStart
    ? 'no warning expected'
    : 'WARNING EXPECTED: Next.js takes the `warnAboutTimers()` branch'
)
clearTimeout(t)

// Does mutating `_idleStart` actually influence when the timer fires?
const start = Date.now()
const t2 = setTimeout(
  () => console.log('1000ms timer with _idleStart -= 5000 fired after', Date.now() - start, 'ms'),
  1000
)
if (hasIdleStart) t2._idleStart -= 5000
