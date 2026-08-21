// Simulates the browser clicking "Open in editor" in the Next.js error overlay
// by calling the same dev-server endpoint the overlay calls.
// Requires `npm run dev:fake-macos` to be running on port 3000.
import path from 'node:path'

const file = process.argv[2] || 'app/page.tsx'
const url = `http://localhost:3000/__nextjs_launch-editor?file=${encodeURIComponent(
  file
)}&line1=3&column1=9`
const res = await fetch(url)
console.log(`GET ${url} -> ${res.status}`)
console.log(
  `Now look at the dev server output for "${path.basename(file)}".`,
  '\nBUG: it prints "Could not open page.tsx in the editor." even though',
  'VSCodium is running.'
)
