export default function P({ id }) { return <div>product {id}</div> }
export function getStaticPaths() {
  return { paths: [{ params: { id: '1', slug: 'exists' } }], fallback: true }
}
export function getStaticProps({ params }) {
  if (params.slug !== 'exists') return { notFound: true }
  return { props: { id: params.id } }
}
