// The code the docs tell you to use, verbatim location: pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  console.log('[_document] manual signal handling active')
  process.on('SIGTERM', () => {
    console.log('[_document] Received SIGTERM: cleaning up')
  })
}

export default function Document() {
  return (
    <Html>
      <Head />
      <body><Main /><NextScript /></body>
    </Html>
  )
}
