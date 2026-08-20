// Spoof an Android arm64 host (e.g. Termux) so Next.js' SWC loader takes the
// android-arm64 code path on any machine.
Object.defineProperty(process, 'platform', { value: 'android' })
Object.defineProperty(process, 'arch', { value: 'arm64' })

const { loadBindings } = await import('next/dist/build/swc/index.js')
try {
  await loadBindings()
  console.log('LOADED SWC BINDINGS (issue not reproduced)')
} catch (e) {
  console.log('FAILED:', e && e.message)
  process.exitCode = 1
}
