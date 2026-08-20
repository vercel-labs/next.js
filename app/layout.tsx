import { Noto_Serif_SC } from 'next/font/google'

// Google Fonts lists `chinese-simplified` as a subset of Noto Serif SC:
// https://fonts.googleapis.com/css2?family=Noto+Serif+SC&subset=chinese-simplified
// but next/font's bundled font-data.json only records
// ["cyrillic","latin","latin-ext","vietnamese"] for it, so this build fails.
const notoSerifSC = Noto_Serif_SC({
  weight: ['400'],
  subsets: ['chinese-simplified'],
  variable: '--font-noto-serif-sc',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={notoSerifSC.variable}>
      <body>{children}</body>
    </html>
  )
}
