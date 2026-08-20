import { Html, Head, Main, NextScript } from 'next/document'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'block',
  variable: '--font-inter',
})

export default function Document() {
  return (
    <Html className={`${inter.className} ${inter.variable}`}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
