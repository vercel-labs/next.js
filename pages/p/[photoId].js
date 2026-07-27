import { useRouter } from 'next/router'

export default function PhotoPage() {
  const { photoId } = useRouter().query
  return (
    <main data-page="photo">
      <h1 data-testid="standalone">Standalone photo {photoId}</h1>
    </main>
  )
}

export function getStaticProps() {
  return { props: {} }
}

export function getStaticPaths() {
  return {
    paths: [{ params: { photoId: '0' } }, { params: { photoId: '1' } }],
    fallback: false,
  }
}
