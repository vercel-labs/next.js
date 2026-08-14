import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({
  weight: '400',
  subsets: ['latin'],
  preload: false,
})

export default function Page() {
  return <p className={notoSansJP.className}>Hello world</p>
}
