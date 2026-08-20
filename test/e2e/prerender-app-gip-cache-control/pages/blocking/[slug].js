export default function Page({ slug }) {
  return <p id="slug">{slug}</p>
}

export function getStaticProps({ params }) {
  return {
    props: { slug: params.slug },
    revalidate: 2,
  }
}

export function getStaticPaths() {
  return {
    paths: ['/blocking/prerendered'],
    fallback: 'blocking',
  }
}
