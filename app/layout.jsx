import {
  BIZ_UDGothic,
  M_PLUS_1p,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Shippori_Antique_B1,
  Zen_Kaku_Gothic_New,
  Zen_Old_Mincho,
} from 'next/font/google'

const notoSans = Noto_Sans_JP({ variable: '--f-1', preload: false, subsets: ['latin'], weight: ['400', '700'] })
const notoSerif = Noto_Serif_JP({ variable: '--f-2', preload: false, subsets: ['latin'], weight: ['400', '700'] })
const bizUd = BIZ_UDGothic({ variable: '--f-3', preload: false, subsets: ['latin'], weight: ['400', '700'] })
const mPlus = M_PLUS_1p({ variable: '--f-4', preload: false, subsets: ['latin'], weight: ['400', '500', '700'] })
const shippori = Shippori_Antique_B1({ variable: '--f-5', preload: false, subsets: ['latin'], weight: '400' })
const zenKaku = Zen_Kaku_Gothic_New({ variable: '--f-6', preload: false, subsets: ['latin'], weight: ['400', '700'] })
const zenOld = Zen_Old_Mincho({ variable: '--f-7', preload: false, subsets: ['latin'], weight: ['400', '700'] })

const fontClasses = [
  notoSans.variable, notoSerif.variable, bizUd.variable, mPlus.variable,
  shippori.variable, zenKaku.variable, zenOld.variable,
].join(' ')

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={fontClasses}>
      <body>{children}</body>
    </html>
  )
}
