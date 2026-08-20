import type { Metadata } from 'next'
export const metadata: Metadata = {
  metadataBase: new URL('https://someurl.fr'),
  alternates: { canonical: '/abs?someparams=true' },
}
export default function Page() { return <p>abs</p> }
