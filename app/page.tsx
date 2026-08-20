import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('http://localhost:3000'),
    title: 'Generate Metadata Bug',
    alternates: {
      canonical: '/?hl=ko_KR',
      languages: {
        'x-default': '/',
        en: '/?hl=en_US',
        ko: '/?hl=ko_KR',
      },
    },
  }
}

export default function Home() {
  return <div>View source: check the alternate/canonical link tags</div>
}
