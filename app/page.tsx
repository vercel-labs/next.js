import { graphql } from 'react-relay'

const query = graphql`
  query pageQuery {
    __typename
  }
`

export default function Page() {
  return <pre id="out">{JSON.stringify(query)}</pre>
}
