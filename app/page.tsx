'use client'

// Bracket access is what `noPropertyAccessFromIndexSignature: true` forces you to write.
// It type checks, but Next.js only inlines *dot* access on `process.env.*`,
// so this is `undefined` in the browser bundle.
const bracketAccess = process.env['NEXT_PUBLIC_FOO']

export default function Page() {
  return <pre id="out">{JSON.stringify({ bracketAccess: bracketAccess ?? null })}</pre>
}
