import type { Metadata } from 'next'
export const metadata: Metadata = {
  metadataBase: new URL('https://someurl.fr'),
  alternates: { canonical: '.' },
}
export default function Page() { return <p>rel</p> }
