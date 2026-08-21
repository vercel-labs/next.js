import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            crossOrigin="anonymous"
            src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"
          />
          <script
            crossOrigin="anonymous"
            src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
