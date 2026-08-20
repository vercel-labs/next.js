import Page from '../../components/Page'

export default function SSG() {
  return <Page />
}

export async function getStaticProps({ params }) {
  const data = Array.from({ length: 50 }, (_, i) => ({ id: i, albumId: params.id }))
  const copies = 25
  return { props: { hydrationData: new Array(copies).fill(data) } }
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}
