import ReactDOMServer from 'react-dom/server'

const staticMarkup = ReactDOMServer.renderToStaticMarkup(<p>TEST</p>)

export default function TestPage() {
  return <p>123 {staticMarkup}</p>
}
