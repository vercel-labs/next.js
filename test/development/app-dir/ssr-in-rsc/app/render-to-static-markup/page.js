import ReactDOMServer from 'react-dom/server'

const staticMarkup = ReactDOMServer.renderToStaticMarkup(<p>TEST</p>)

export default function Page() {
  return <div id="static-markup">{staticMarkup}</div>
}
