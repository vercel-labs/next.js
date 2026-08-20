// Simulates a third-party library that must pick a router module at runtime.
export async function initLibrary(appDir) {
  const moduleId = appDir ? 'next/navigation' : 'next/router'
  const mod = await import(moduleId)
  return Object.keys(mod)
}
