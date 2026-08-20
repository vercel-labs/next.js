export default function Slug({ slug }) {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 40 }}>
      <h1 id="slug-page">Slug page: {String(slug)}</h1>
    </main>
  )
}

export async function getStaticProps({ params }) {
  return { props: { slug: params.slug.join('/') } }
}

export async function getStaticPaths() {
  // only /hello is pre-rendered; every other path must 404
  return { paths: [{ params: { slug: ['hello'] } }], fallback: false }
}
