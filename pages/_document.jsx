import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function MyDocument() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script id="id-1" strategy="beforeInteractive" src="/one.js" />
        <Script id="id-2" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `console.log('inline-2')` }} />
        <Script id="id-3" strategy="beforeInteractive" src="/three.js" />
        <Script id="id-4" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `console.log('inline-4')` }} />
      </body>
    </Html>
  )
}
