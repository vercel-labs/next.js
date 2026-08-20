export async function generateMetadata() {
  return {
    metadataBase: new URL('https://example.com'),
    alternates: { canonical: '/discover?id=12345-qwerty' },
  }
}

export default function Discover() {
  return <h1>discover</h1>
}
