export async function getStaticPaths() {
  // NOTE: page number intentionally left as a number instead of a string
  return { paths: [{ params: { page: 1 } }, { params: { page: 2 } }], fallback: false }
}

export async function getStaticProps({ params }) {
  return { props: { page: params.page } }
}

export default function Page({ page }) {
  return <h1>Article page {page}</h1>
}
