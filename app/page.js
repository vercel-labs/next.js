'use client'

// Next.js injects its Buffer polyfill into the client bundle whenever `Buffer`
// is referenced (webpack ProvidePlugin -> next/dist/compiled/buffer).
export default function Page() {
  return (
    <main>
      <p id="out">{Buffer.from('hello next.js#66115').toString('base64')}</p>
      <p>
        <a href="/bigint-dep">/bigint-dep</a> (dependency shipping BigInt literals)
      </p>
    </main>
  )
}
