import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* simulate a GTM-like third-party script injecting a <script> into <head> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d,s){var j=d.createElement(s);
              j.async=true;j.src='/fake-gtm.js';var c=d.head.querySelector('meta[name=next-head-count]')||d.head.querySelector('script');d.head.insertBefore(j,c);})(document,'script');`,
          }}
        />
      </body>
    </Html>
  )
}
