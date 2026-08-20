export async function initLibrary(appDir) {
  const mod = appDir ? await import('next/navigation') : await import('next/router')
  return Object.keys(mod)
}
