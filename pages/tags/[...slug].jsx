export async function getStaticPaths() {
  return { paths: [{ params: { slug: [1, 2] } }], fallback: false }
}
export async function getStaticProps({ params }) { return { props: { slug: params.slug } } }
export default function P({ slug }) { return <pre>{JSON.stringify(slug)}</pre> }
