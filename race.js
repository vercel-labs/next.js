// Deterministically place the manifests into the exact state the dev bundler
// produces during a rebuild (file exists, length 0) while a request is in
// flight, and report what the dev server answers.
const fs = require('fs')
const PORT = Number(process.env.PORT || 5177)

const targets = [
  { label: 'client-reference-manifest (evalManifest)', file: '.next/dev/server/app/pricing/page_client-reference-manifest.js', route: '/pricing' },
  { label: 'build-manifest.json (loadManifest)', file: '.next/dev/build-manifest.json', route: '/about' },
  { label: 'next-font-manifest.json (loadManifest)', file: '.next/dev/server/next-font-manifest.json', route: '/docs' },
]

const get = async (route) => {
  const res = await fetch(`http://localhost:${PORT}${route}`)
  await res.text()
  return res.status
}

;(async () => {
  let failures = 0
  for (const t of targets) {
    const original = fs.readFileSync(t.file)
    // warm the route so the only variable is the manifest content
    await get(t.route)
    fs.writeFileSync(t.file, '') // <- zero bytes, file present: the rebuild window
    const status = await get(t.route)
    fs.writeFileSync(t.file, original)
    const restored = await get(t.route)
    console.log(`${t.label}: GET ${t.route} while zero-byte -> ${status}, after restore -> ${restored}`)
    if (status !== 200) failures++
  }
  console.log(failures > 0 ? 'REPRODUCED' : 'not reproduced')
  process.exit(failures > 0 ? 0 : 1)
})()
