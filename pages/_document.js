import Document, { Html, Head, Main, NextScript } from 'next/document'
import fs from 'fs'
import path from 'path'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

// Mimics the pattern used by antd's SSR docs / @ant-design/static-style-extract:
// read a pre-generated css file from disk during SSR.
function read(label, target) {
  let error = null
  let bytes = 0
  try {
    bytes = fs.readFileSync(target, 'utf8').length
  } catch (e) {
    error = e.code || e.message
  }
  console.log(`[repro] ${label}: ${target} -> ${error ? 'FAIL ' + error : 'OK ' + bytes + ' bytes'}`)
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const cache = createCache()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
      })

    const initialProps = await Document.getInitialProps(ctx)
    const antdStyle = extractStyle(cache, true)

    console.log('[repro] __dirname =', __dirname, '| exists on disk =', fs.existsSync(__dirname))
    read('__dirname-relative read', path.join(__dirname, '../../styles/extracted.css'))
    read('cwd-relative read      ', path.join(process.cwd(), 'styles/extracted.css'))
    console.log('[repro] cssinjs cache entries after SSR =', cache.cache.size)
    console.log('[repro] extractStyle() length =', antdStyle.length)

    return { ...initialProps, antdStyle }
  }

  render() {
    return (
      <Html>
        <Head>
          <style data-antd-cssinjs dangerouslySetInnerHTML={{ __html: this.props.antdStyle || '' }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
