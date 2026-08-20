import Document, { Html, Head, Main, NextScript } from 'next/document'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={`${inter.className} ${inter.variable}`}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
