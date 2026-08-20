import type { Metadata } from 'next'
export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  alternates: { canonical: '/about?hl=ko_KR', languages: { en: '/about?hl=en_US' } },
}
export default function About() { return <div>about</div> }
