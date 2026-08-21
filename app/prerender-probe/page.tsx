import * as nodeTimersPromises from 'node:timers/promises'

export default async function Page() {
  // "Third-party library" code that runs during a (pre)render.
  const immediate = setImmediate(() => {})
  clearImmediate(immediate)

  const info = {
    immediateCtor: (immediate as any).constructor?.name,
    isNodeImmediate: (immediate as any).constructor?.name === 'Immediate',
    timersPromisesSetImmediateName: nodeTimersPromises.setImmediate.name,
    nextTickName: process.nextTick.name,
  }
  console.log('[prerender-probe]', JSON.stringify(info))
  return <pre>{JSON.stringify(info, null, 2)}</pre>
}
