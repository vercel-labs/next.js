import type { Metadata } from 'next'

// `width`/`height` are accepted by TwitterImageDescriptor even though the
// Twitter/X Cards markup spec has no twitter:image:width / twitter:image:height.
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png',
        alt: 'Next.js',
        width: 1200,
        height: 630,
        secureUrl: 'https://nextjs.org/og.png',
        type: 'image/png',
      },
    ],
  },
}

export default function Page() {
  return <p>issue 81123</p>
}
