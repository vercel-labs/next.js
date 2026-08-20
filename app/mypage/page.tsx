import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://someurl.fr'),
  alternates: {
    canonical: './?someparams=true',
  },
}

export default function Page() {
  return <p>mypage</p>
}
