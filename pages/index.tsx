import pagesQuery from '../queries/pagesQuery'

export default function Index() {
  return <pre id="out">{JSON.stringify(pagesQuery, null, 2)}</pre>
}
