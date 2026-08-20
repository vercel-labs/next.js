export default function Page({ page }) {
  return <div>Props: {page}</div>
}

export async function getStaticPaths() {
  return { paths: [{ params: { page: 'a' } }, { params: { page: 'b.git' } }], fallback: false }
}

export async function getStaticProps({ params }) {
  return { props: { page: params.page } }
}
